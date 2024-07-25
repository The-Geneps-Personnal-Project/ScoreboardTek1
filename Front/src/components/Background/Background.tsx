import React from "react";

import "./Background.css";

import { BackgroundProps } from "./Background.props";

import backgroundImage from "../../assets/BackgroundDecoration.png";
import bottomDecoration from "../../assets/BottomDecoration.png";
import rightDecoration from "../../assets/RightDecoration.png";

export const Background: React.FC<BackgroundProps> = (props) => {
  return (
    <div
      className="Background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="RightDecoration"
        style={{ backgroundImage: `url(${rightDecoration})` }}
      />
      <div
        className="BottomDecoration"
        style={{ backgroundImage: `url(${bottomDecoration})` }}
      />
      {props.children}
    </div>
  );
};
