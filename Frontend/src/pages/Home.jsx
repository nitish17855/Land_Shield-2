import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import ContactFooter from '../components/ContactFooter';
import BottomFeatures from '../components/BottomFeatures';

export default function Home({ onContactClick }) {
  return (
    <div className="pt-20">
      <Hero />
      <BottomFeatures />
      <Features />
      <Pricing />
      <ContactFooter onContactClick={onContactClick} />
    </div>
  );
}
