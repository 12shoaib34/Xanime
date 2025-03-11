import React from "react";

const XButton = (props) => {
  const { children, onClick = () => {}, className = "", active = false, ...rest } = props;
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`cursor-pointer text-white h-10 w-10 flex justify-center items-center rounded-full hover:bg-primary/30 outlined-3-primary ${
        active ? "bg-primary/50" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default XButton;
