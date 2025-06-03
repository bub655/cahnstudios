import React from "react";

export default function Part1Card() {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col aspect-square">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        ✨ Part 1: AI Content Creation
      </h3>
      <ul className="space-y-4 flex-1 overflow-auto">
        <li>
          <h4 className="font-medium text-gray-700">🧠 Fundamentals of AI</h4>
          <p className="text-gray-600 mt-1">
            Learn the basics of AI content creation—choosing the right tools and writing engaging scripts with ChatGPT.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🎤 Training Your Voice Agent</h4>
          <p className="text-gray-600 mt-1">
            Build and fine-tune AI-generated voices. See how metrics guide you to natural, expressive outputs.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🎬 Training Your Video Agent</h4>
          <p className="text-gray-600 mt-1">
            Guide AI video tools to craft engaging visuals. Explore metrics that boost watch time and retention.
          </p>
        </li>
        <li>
          <h4 className="font-medium text-gray-700">🔄 Seamless Integration</h4>
          <p className="text-gray-600 mt-1">
            Combine AI-generated video and audio for a cohesive final product. Streamline editing with AI automation.
          </p>
        </li>
      </ul>
    </div>
  );
}
