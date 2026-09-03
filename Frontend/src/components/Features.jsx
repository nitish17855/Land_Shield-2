import React from 'react';
import { FileSearch, History, FolderOpen, ShieldAlert, CircleDollarSign, MapPin } from 'lucide-react';

export default function Features() {
  const cards = [
    {
      icon: <FileSearch className="w-5 h-5 text-green-600" />,
      bg: "bg-green-100",
      title: "Raw Land Details",
      desc: "Get complete details of plots like area, location, boundaries, and zoning classifications.",
      link: "Explore Details"
    },
    {
      icon: <History className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
      title: "Past Land History",
      desc: "Access complete ownership history and past transactions to ensure clear title.",
      link: "View History"
    },
    {
      icon: <FolderOpen className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-100",
      title: "Verify Documents",
      desc: "Check validity of sale deeds, mutations, and property tax receipts.",
      link: "Verify Now"
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
      title: "Check Legal Status",
      desc: "Uncover pending litigations, disputes, or encumbrances tied to the property.",
      link: "Check Status"
    },
    {
      icon: <CircleDollarSign className="w-5 h-5 text-rose-600" />,
      bg: "bg-rose-100",
      title: "View Financial Records",
      desc: "Understand the financial health, loans, or mortgages linked to the property.",
      link: "View Records"
    },
    {
      icon: <MapPin className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-100",
      title: "Location Intelligence",
      desc: "Assess nearby infrastructure, development plans, and future value potentials.",
      link: "Explore Map"
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-24 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-landgreen-900 mb-6">
          Now: know the land history<br /> effortlessly before buying.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
          LandShield brings every record, document, and owner history to your fingertips with ultimate clarity and confidence.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${card.bg}`}>
              {card.icon}
            </div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3 group-hover:text-landgreen-700 transition-colors">{card.title}</h3>
            <p className="text-gray-500 mb-6 font-light leading-relaxed min-h-[4rem]">{card.desc}</p>
            <span className="text-sm font-medium text-landgreen-900 flex items-center gap-1 group-hover:gap-2 transition-all">
              {card.link} <span>→</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
