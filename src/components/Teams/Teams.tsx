import { Box } from "@mui/material";

import "./Teams.css";

import { TeamsProps } from "./Teams.props";
import ProgressBarComponent from "../ProgressBar/ProgressBar";

export const Teams = (props: TeamsProps) => {
  const { name, logo, score, rank, maxScore } = props;

  function getScore() {
    let total = 0;
    for (const key in score) {
      if (score.hasOwnProperty(key)) {
        total += score[key];
      }
    }
    return total;
  }

  function getBarColor() {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "#0000FF";
    }
  }

  const progressBarValue = (getScore() / maxScore) * 100;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      className="Teams"
    >
      <div className="Teams-name">{name}</div>
      <img src={logo} alt={name} className="Teams-logo" />
      <div className="Teams-score">{getScore()}</div>
      <ProgressBarComponent
        value={progressBarValue}
        barColor={getBarColor()}
        backgroundColor="#E5E4E2"
      />
    </Box>
  );
};
