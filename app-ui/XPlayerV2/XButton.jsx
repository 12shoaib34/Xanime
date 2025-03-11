import React from "react";

const XButton = (props) => {
  const { children, onClick = () => {}, className = "", active = false, ...rest } = props;
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`cursor-pointer h-10 w-10 flex justify-center items-center rounded-full hover:bg-black/50 outlined-3-primary ${
        active ? "bg-black/50" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default XButton;
