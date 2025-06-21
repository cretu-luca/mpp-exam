"use client";

import { useState, useEffect } from "react";
import { fakeNewsData, type FakeNews } from "~/data/fakeNews";

export const FakeNewsSection = () => {
  const [randomNews, setRandomNews] = useState<FakeNews[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get 2-3 random news items for each client
    const shuffled = [...fakeNewsData].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 items
    setRandomNews(shuffled.slice(0, count));
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        📰 Latest Campaign News
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {randomNews.map((news) => (
          <div 
            key={news.id}
            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500 font-medium">
                {news.timestamp}
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                BREAKING
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">
              {news.headline}
            </h3>
            
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              {news.content}
            </p>
            
            <div className="text-xs text-gray-500 font-medium">
              About: {news.candidateName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 