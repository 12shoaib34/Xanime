"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const AnimeCard = (props) => {
  const { data } = props;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/anime?id=${data?._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border-primary cursor-pointer rounded-xl overflow-hidden border-2 flex flex-col justify-between hover:-translate-y-2 duration-300"
    >
      <Image priority className="object-cover w-full" src={data.image} alt={data.image} width={256} height={253} />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">{data.anime}</h2>
        <p className="text-sm text-gray-500 line-clamp-3">{data.description}</p>
      </div>
    </div>
  );
};

export default AnimeCard;
