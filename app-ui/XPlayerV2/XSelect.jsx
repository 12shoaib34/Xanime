"use client";
import React from "react";

const XSelect = (props) => {
  const { onSelect = () => {} } = props;
  return (
    <div className="relative">
      <input className="h-12" />
    </div>
  );
};

export default XSelect;
