import React from "react";

import "./Teams.css";

import { TeamsProps } from "./Teams.props";
import ProgressBarComponent from "../ProgressBar/ProgressBar";
import RedTeam from "../../assets/RedTeam.png";
import BlueTeam from "../../assets/BlueTeam.png";
import GreenTeam from "../../assets/GreenTeam.png";
import PinkTeam from "../../assets/PinkTeam.png";

export const Teams: React.FC<TeamsProps> = (props) => {
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
        return "#C5102C";
      case 2:
        return "#3A0BF8";
      case 3:
        return "#11B75E";
      default:
        return "#B708BA";
    }
  }

  function getLogoColor() {
    switch (rank) {
      case 1:
        return RedTeam;
      case 2:
        return BlueTeam;
      case 3:
        return GreenTeam;
      default:
        return PinkTeam;
    }
  }

  const progressBarValue = (getScore() / maxScore) * 100;

  return (
    <div className="Teams">
      <div
        className="Teams-logo-wrapper"
        style={{ backgroundImage: `url(${getLogoColor()})` }}
      >
        <img src={logo} alt={name} className="Teams-logo" />
      </div>
      <div>
        <div className="Teams-name" style={{ color: getBarColor() }}>
          {name}
        </div>
        <div className="Teams-score">{getScore()}</div>
      </div>
      <ProgressBarComponent
        value={progressBarValue}
        barColor={getBarColor()}
        backgroundColor="#E5E4E2"
      />
    </div>
  );
};
