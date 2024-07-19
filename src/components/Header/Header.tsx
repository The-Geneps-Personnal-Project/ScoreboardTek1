import React from "react";

import "./Header.css";

import header from "../../assets/Header.png";

export const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <div className="Header" style={{ backgroundImage: `url(${header})` }}></div>
  );
};
