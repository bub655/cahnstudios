// src/components/WebinarDetails.jsx
import React from "react";
import Part1Card from "./Part1Card";
import Part2Card from "./Part2Card";
import AudienceCard from "./AudienceCard";
import OutcomesCard from "./OutcomesCard";

export default function WebinarDetails() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          🔍 What You’ll Learn
        </h2>

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
