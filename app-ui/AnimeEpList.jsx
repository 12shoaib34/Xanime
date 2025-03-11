"use client";

import React, { useState, useEffect } from "react";
import Select from "./Select";

const AnimeEpList = ({ data, selectedEpisode }) => {
  const total = data?.totalEpisodes || 0;
  const episodes = Array.from({ length: total }, (_, index) => index + 1);

  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const progress = JSON.parse(localStorage.getItem("progress")) || [];
      setProgress(progress);
    }
  }, []);

  const episodeGroups = episodes.reduce((acc, episode) => {
    const groupIndex = Math.floor((episode - 1) / 100);
    if (!acc[groupIndex]) {
      acc[groupIndex] = {
        index: groupIndex,
        label: `${groupIndex * 100 + 1} - ${Math.min((groupIndex + 1) * 100, total)}`,
        episodes: [],
      };
    }
    acc[groupIndex].episodes.push(episode);
    return acc;
  }, []);

  const getSelectedGroupIndex = () => {
    if (!selectedEpisode) return 0;
    return episodeGroups.findIndex((group) => group.episodes.includes(selectedEpisode)) || 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(getSelectedGroupIndex);

  useEffect(() => {
    setSelectedIndex(getSelectedGroupIndex);
  }, [selectedEpisode]);

  console.log(progress, "progress");

  const handleEpisodeClick = (episode) => {
    const cat = data?.cat?.includes("dub") ? "dub" : "sub";
    const url = `/anime?id=${data._id}&ep=${episode}&cat=${cat}`;

    let currentAnime = progress?.find((anime) => anime._id === data._id) || {};
    if (currentAnime?._id) {
      currentAnime.continueUrl = url;
    } else {
      currentAnime = { _id: data._id, continueUrl: url };
    }

    const updateProgress = [...progress.filter((anime) => anime._id !== data._id), currentAnime];
    localStorage.setItem("progress", JSON.stringify(updateProgress));

    window.location.href = url;
  };

  const progressUrl = progress?.find((anime) => anime._id === data._id)?.continueUrl;

  const onSelect = (e) => {
    setSelectedIndex(e.index);
  };

  return (
    <div className="flex-1 md:max-w-[300px] bg-background rounded-lg max-h-[200px] md:max-h-[calc(100svh-180px)] overflow-hidden flex flex-col">
      <div className="mb-4">
        <Select
          placeholder="Select a group"
          onSelect={onSelect}
          options={episodeGroups}
          valuePropName="index"
          selectedValue={selectedIndex}
        />
      </div>

      <div className="mb-4">
        {progressUrl && !progressUrl?.includes(`${selectedEpisode}`) && (
          <button onClick={() => (window.location.href = progressUrl)} className="btn btn-primary btn-xs w-full">
            Continue
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-8 md:grid-cols-5 gap-2">
          {episodeGroups[selectedIndex]?.episodes.map((ep) => (
            <div key={ep} className="w">
              <button
                onClick={() => handleEpisodeClick(ep)}
                className={`w-full h-10 text-xs md:text-base rounded-md  ${
                  selectedEpisode === ep ? "bg-primary text-black" : "bg-background-secondary text-gray-400"
                } ${data?.filers?.includes(ep) ? "line-through opacity-20" : ""}`}
              >
                {ep}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeEpList;
