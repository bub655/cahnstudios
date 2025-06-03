import React from "react";

export default function AudienceCard() {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        📅 Who Should Attend
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>Content creators and influencers</li>
        <li>D2C and startup marketers</li>
        <li>Ad agencies and freelancers</li>
        <li>Anyone curious about integrating AI into creative workflows</li>
      </ul>
    </div>
  );
}
