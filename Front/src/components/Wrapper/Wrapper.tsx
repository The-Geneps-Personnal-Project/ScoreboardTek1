import React from "react";

import "./Wrapper.css";

import { WrapperProps } from "./Wrapper.props";

import scoreRedFrame from "../../assets/ScoreRedFrame.png";
import scoreBlackFrame from "../../assets/ScoreBlackFrame.png";

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <div className="Wrapper">
      <div
        className="ScoreRedFrame"
        style={{ backgroundImage: `url(${scoreRedFrame})` }}
      />
      <div
        className="ScoreBlackFrame"
        style={{ backgroundImage: `url(${scoreBlackFrame})` }}
      />
      {props.children}
    </div>
  );
};
