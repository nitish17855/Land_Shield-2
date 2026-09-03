import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Shield } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      months: 1,
      title: "1 Month Plan",
      price: "$299",
      desc: "Perfect for a single transaction or short-term need.",
      popular: false
    },
    {
      months: 2,
      title: "2 Months Plan",
      price: "$499",
      desc: "Great for ongoing due diligence on a specific property.",
      popular: false
    },
    {
      months: 6,
      title: "6 Months Plan",
      price: "$1,399",
      desc: "Ideal for active buyers looking at multiple properties.",
      popular: true
    },
    {
      months: 12,
      title: "Annual Premium",
      price: "$2,499",
      desc: "Best value. Covers 12 months of premium access.",
      popular: false
    }
  ];

  const benefits = [
    "Unlimited property verifications",
    "Priority document retrieval",
    "Dedicated legal advisor access",
    "Advanced location intelligence reports",
    "Real-time dispute alerts"
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex justify-center items-center gap-2 mb-8 hover:opacity-80 transition">
            <div className="bg-landgreen-900 p-2 rounded-xl text-white">
              <Shield size={24} />
            </div>
            <span className="font-serif font-bold text-2xl text-landgreen-900">LandShield</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-landgreen-900 mb-4">
            Choose your <span className="gold-gradient-text">Protection Plan</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Whether you are making a single purchase or managing a portfolio, we have a plan for you. All plans include full access to LandShield Plus features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white rounded-3xl p-6 shadow-xl border ${plan.popular ? 'border-gold-500' : 'border-gray-100'} flex flex-col`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-landgreen-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-landgreen-900 font-semibold tracking-wider uppercase text-sm mb-2">{plan.title}</h3>
              <div className="flex items-baseline gap-1 text-landgreen-900 mb-2">
                <span className="text-4xl font-serif font-bold">{plan.price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-8 font-light flex-grow">{plan.desc}</p>
              
              <button className={`w-full py-3 rounded-xl font-semibold transition-colors shadow-sm ${plan.popular ? 'bg-gold-500 hover:bg-gold-400 text-landgreen-900' : 'bg-landgreen-900 hover:bg-landgreen-700 text-white'}`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-landgreen-900 mb-6 text-center">All LandShield Plus plans include:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
