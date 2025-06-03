import React from "react";

export default function Part2Card() {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col aspect-square">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        📢 Part 2: Creating AI Ads
      </h3>
      <ul className="space-y-4 flex-1 overflow-auto">
        <li>
          <h4 className="font-medium text-gray-700">⚙️ AI Ad Tools Overview</h4>
          <p className="text-gray-600 mt-1">
            Explore the top AI tools for ad generation. Choose based on your goals and budget.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🎞️ Storyboarding with AI</h4>
          <p className="text-gray-600 mt-1">
            Convert ideas into visual storyboards. Use AI to map narratives and scenes before production.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🖼️ From Images to Video</h4>
          <p className="text-gray-600 mt-1">
            Turn static images into motion videos in a few clicks. Discover tools that bring visuals to life.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🎥 Visual Storytelling</h4>
          <p className="text-gray-600 mt-1">
            Use AI to craft emotion-driven, impactful ads that resonate with your audience.
          </p>
        </li>
      </ul>
    </div>
  );
}
