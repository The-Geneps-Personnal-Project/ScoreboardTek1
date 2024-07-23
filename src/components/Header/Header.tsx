import React from "react";

import "./Header.css";

import header from "../../assets/Header.png";

export const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <div className="Header">
      <div
        className="HeaderImage"
        style={{ backgroundImage: `url(${header})` }}
      />
    </div>
  );
};
