import React from "react";

import "./Wrapper.css";

import { WrapperProps } from "./Wrapper.props";


export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <div className="MegaWrapper">
      <div className="Wrapper">
        {props.children}
      </div>
    </div>
  );
};
