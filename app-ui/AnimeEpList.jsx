"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AnimeEpList = ({ data, selectedEpisode }) => {
  const router = useRouter();
  const total = data?.totalEpisodes || 0;
  const episodes = Array.from({ length: total }, (_, index) => index + 1);

  const episodeGroups = episodes.reduce((acc, episode) => {
    const groupIndex = Math.floor((episode - 1) / 100);
    if (!acc[groupIndex]) {
      acc[groupIndex] = {
        label: `${groupIndex * 100 + 1} - ${Math.min((groupIndex + 1) * 100, total)}`,
        episodes: [],
      };
    }
    acc[groupIndex].episodes.push(episode);
    return acc;
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleEpisodeClick = (episode) => {
    router.push(`/anime?id=${data._id}&ep=${episode}&cat=dub`);
  };

  return (
    <div className="p-4 rounded-lg bg-background-secondary">
      <div className="flex flex-wrap gap-6 mb-4">
        {episodeGroups.map((group, index) => (
          <button key={index} onClick={() => setSelectedIndex(index)} className={`text-sm ${selectedIndex === index ? "text-white" : "text-gray-500"}`}>
            {group.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-16 gap-2">
        {episodeGroups[selectedIndex]?.episodes.map((ep) => (
          <div key={ep} className="w">
            <button
              onClick={() => handleEpisodeClick(ep)}
              className={`w-full h-10 text-white rounded-md hover:bg-background-secondary ${selectedEpisode === ep ? "bg-primary" : "bg-background-tertiary"}`}
            >
              {ep}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeEpList;
