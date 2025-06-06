import React from "react";
import Part1Card from "./Part1Card";
import Part2Card from "./Part2Card";
import AudienceCard from "./AudienceCard";
import OutcomesCard from "./OutcomesCard";

export default function WebinarDetails() {
  return (
    <section id="webinar-details" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          🔍 What You'll Learn
        </h2>

        {/* Pricing Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Special Launch Pricing
          </h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <span className="text-xl text-gray-500 line-through block">Regular Price</span>
              <span className="text-3xl text-gray-500 line-through font-bold">$200</span>
            </div>
            <div className="text-6xl text-gray-300">→</div>
            <div className="text-center">
              <span className="text-xl text-green-600 block">Early Bird Price</span>
              <span className="text-5xl text-green-600 font-bold">$58</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-medium">
            <span>🔥</span>
            <span>Save 71% - Limited Time Only</span>
            <span>🔥</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Part1Card />
          <Part2Card />
          <AudienceCard />
          <OutcomesCard />
        </div>
      </div>
    </section>
  );
}
