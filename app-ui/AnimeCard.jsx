"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdClosedCaption, MdOutlineMic, MdVideocam } from "react-icons/md";

const AnimeCard = (props) => {
  const { data } = props;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/anime?id=${data?._id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer hover:scale-105 duration-300">
      <div className="rounded-md overflow-hidden relative mb-6 max-h-[325px]">
        <Image priority className="object-cover w-full" src={data.image} alt={data.image} width={230} height={325} />
        <div className="pt-6 pb-4 px-4 bg-gradient-to-t from-black/70 to-white/0 absolute bottom-0 left-0 w-full">
          <div className="flex gap-0.5">
            <div className="bg-[#b0e3af] p-1 rounded-s-sm">
              <span className="text-sm text-black font-bold leading-none flex-center">
                <MdClosedCaption size={16} />
                {data.subbedEpisodes}
              </span>
            </div>
            <div className="bg-[#b9e7ff] p-1">
              <span className="text-sm text-black font-bold leading-none flex-center">
                <MdOutlineMic size={16} /> {data.dubbedEpisodes}
              </span>
            </div>
            <div className="bg-white/50 backdrop-blur-xs p-1 rounded-e-lg">
              <span className="text-sm text-black font-bold leading-none flex-center">
                <MdVideocam size={16} /> {data.totalEpisodes}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{data.anime}</h3>
      </div>
    </div>
  );
};

export default AnimeCard;
