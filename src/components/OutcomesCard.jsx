import React from "react";

export default function OutcomesCard() {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        ✅ By the end of this webinar, you’ll be able to:
      </h3>
      <ul className="list-disc list-inside space-y-2 flex-1 text-gray-600 overflow-auto">
        <li>Use AI tools like ChatGPT, ElevenLabs, Runway, and more</li>
        <li>Build content faster, with better quality</li>
        <li>Create scroll-stopping ad creatives with minimal effort</li>
      </ul>
    </div>
  );
}
