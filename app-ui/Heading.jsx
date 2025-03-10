import React from "react";

const Heading = (props) => {
  const { children, variant = 1, className = "" } = props;

  const prefix =
    "font-bold before relative pl-5 leading-none before:-translate-y-1/2  before:top-1/2 before:left-0 before:absolute before:h-8 before:w-1 before:bg-primary mb-2";

  switch (variant) {
    case 1:
      return <h1 className={`text-4xl ${prefix} ${className}`}>{children}</h1>;
    case 2:
      return <h2 className={`text-3xl ${prefix} ${className}`}>{children}</h2>;
    case 3:
      return <h3 className={`text-2xl ${prefix} ${className}`}>{children}</h3>;
    case 4:
      return <h4 className={`text-xl ${prefix} ${className}`}>{children}</h4>;
    case 5:
      return <h5 className={`text-lg ${prefix} ${className}`}>{children}</h5>;
    case 6:
      return <h6 className={`text-base ${prefix} ${className}`}>{children}</h6>;
    default:
      return <h1 className={`text-4xl ${prefix} ${className}`}>{children}</h1>;
  }
};

export default Heading;
