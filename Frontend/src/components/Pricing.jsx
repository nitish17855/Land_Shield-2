import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const benefits = [
    "Unlimited property verifications",
    "Priority document retrieval",
    "Dedicated legal advisor access",
    "Advanced location intelligence reports",
    "Real-time dispute alerts"
  ];

  return (
    <section id="product" className="py-24 px-6 lg:px-24 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-landgreen-900 mb-6 leading-tight">
          Explore LandShield <span className="gold-gradient-text">Plus</span>
        </h2>
        <p className="text-gray-600 text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Upgrade to premium protection. Get comprehensive analysis and expert support for your high-value land investments.
        </p>
        
        <ul className="space-y-4 mb-12 flex flex-col items-center">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link 
          to="/pricing" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-landgreen-900 hover:bg-landgreen-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
        >
          See All Plans <span>→</span>
        </Link>
      </div>
    </section>
  );
}
