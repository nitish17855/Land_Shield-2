const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "landshield_default_secret_jwt_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Generate standard signed JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
      auth_provider: user.auth_provider || "local",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Sanitize user object for responses
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar_url || null,
    role: user.role || "user",
    authProvider: user.auth_provider || "local",
    createdAt: user.created_at,
  };
}

/**
 * Register a new user with Email and Password
 */
async function signUp(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Full name, email, and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long.",
    });
  }

  try {
    // Check if user already exists
    const existing = await db.query(
      "SELECT id, email, auth_provider FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];
      if (existingUser.auth_provider === "google") {
        return res.status(409).json({
          success: false,
          error: "An account with this email was registered using Google. Please sign in with Google.",
        });
      }
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, auth_provider)
       VALUES ($1, $2, $3, 'local')
       RETURNING id, name, email, avatar_url, role, auth_provider, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("[Auth] SignUp error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create account. Please try again later.",
    });
  }
}

/**
 * Sign in existing user with Email and Password
 */
async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email address or password.",
      });
    }

    const user = result.rows[0];

    // Check if user was registered with Google without a password
    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        error: "This account was created with Google OAuth. Please sign in using Google.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email address or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[Auth] SignIn error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to sign in. Please try again later.",
    });
  }
}

/**
 * Real Google OAuth ID Token verification and sign-in/sign-up
 */
async function googleAuth(req, res) {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      error: "Google credential token is required.",
    });
  }

  try {
    let payload;

    // Verify token with Google's public keys
    if (GOOGLE_CLIENT_ID) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Fallback decoding if GOOGLE_CLIENT_ID is not configured in .env yet
      payload = jwt.decode(credential);
      if (!payload || !payload.email) {
        throw new Error("Unable to decode Google credential token.");
      }
      console.warn("[Auth] GOOGLE_CLIENT_ID not set in .env. Decoded payload directly.");
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists by google_id or email
    let userResult = await db.query(
      "SELECT * FROM users WHERE google_id = $1 OR email = $2",
      [googleId, normalizedEmail]
    );

    let user;

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      // Update google_id or avatar if missing
      if (!user.google_id || !user.avatar_url) {
        const updateResult = await db.query(
          `UPDATE users 
           SET google_id = COALESCE(google_id, $1), 
               avatar_url = COALESCE(avatar_url, $2),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $3
           RETURNING *`,
          [googleId, picture, user.id]
        );
        user = updateResult.rows[0];
      }
    } else {
      // Create new user with Google profile
      const insertResult = await db.query(
        `INSERT INTO users (name, email, google_id, avatar_url, auth_provider)
         VALUES ($1, $2, $3, $4, 'google')
         RETURNING *`,
        [name || "Google User", normalizedEmail, googleId, picture]
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[Auth] Google OAuth error:", error);
    return res.status(401).json({
      success: false,
      error: error.message || "Google authentication verification failed.",
    });
  }
}

/**
 * Get current authenticated user profile
 */
async function getMe(req, res) {
  try {
    const result = await db.query(
      "SELECT id, name, email, avatar_url, role, auth_provider, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(result.rows[0]),
    });
  } catch (error) {
    console.error("[Auth] getMe error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch user profile.",
    });
  }
}

module.exports = {
  signUp,
  signIn,
  googleAuth,
  getMe,
};
