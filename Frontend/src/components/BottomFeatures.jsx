import React from 'react';
import { ShieldCheck, FileText, TrendingUp, Clock } from 'lucide-react';

export default function BottomFeatures() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-landgreen-900" />,
      title: "Verified Ownership",
      desc: "Confirm who really owns the land."
    },
    {
      icon: <FileText className="w-6 h-6 text-landgreen-900" />,
      title: "Document Access",
      desc: "Get all key records in one place."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-landgreen-900" />,
      title: "Risk Analysis",
      desc: "Spot issues before they become costly."
    },
    {
      icon: <Clock className="w-6 h-6 text-landgreen-900" />,
      title: "Complete History",
      desc: "Track ownership and transaction history."
    }
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-10 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {features.map((f, i) => (
          <div key={i} className={`flex items-start gap-4 ${i !== 0 ? 'md:pl-8 pt-8 md:pt-0' : ''}`}>
            <div className="p-2 bg-landgreen-50 rounded-lg">
              {f.icon}
            </div>
            <div>
              <h3 className="font-serif font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
