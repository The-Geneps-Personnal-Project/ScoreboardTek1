import React from "react";

import "./Wrapper.css";

import { Box } from "@mui/material";

import { WrapperProps } from "./Wrapper.props";

export const Wrapper = (props: WrapperProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }} className="Wrapper">
      {props.children}
    </Box>
  );
};
