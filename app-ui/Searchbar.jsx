"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FiSearch } from "react-icons/fi";

const Searchbar = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const handleSearchSubmit = () => {
    router.push(`/?search=${search}`);
  };

  const onSearchChange = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }

    const search = e.target.value;
    setSearch(search);
  };

  return (
    <div className="flex border-2 border-primary h-12 rounded-lg relative px-4 mb-4 max-w-xl m-auto">
      <input onKeyDown={onSearchChange} type="text" placeholder="Search..." className="h-full flex-1 outline-none" />
      <button className="ml-auto cursor-pointer" onClick={handleSearchSubmit}>
        <FiSearch size={24} />
      </button>
    </div>
  );
};

export default Searchbar;
