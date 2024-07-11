import React from "react";

import "./Header.css";

import { Box } from "@mui/material";

export const Header = () => {
  return (
    <Box sx={{ display: "flex" }} className="Header">
      <h2 className="Header-name">Name</h2>
      <h2 className="Header-points">Points</h2>
      <h2 className="Header-progress">Progress</h2>
    </Box>
  );
};
