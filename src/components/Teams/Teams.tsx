import React from "react";

import "./Teams.css";

import { TeamsProps } from "./Teams.props";
import ProgressBarComponent from "../ProgressBar/ProgressBar";
import RedTeam from "../../assets/RedTeam.png";
import BlueTeam from "../../assets/BlueTeam.png";
import GreenTeam from "../../assets/GreenTeam.png";
import PinkTeam from "../../assets/PinkTeam.png";
import YellowTeam from "../../assets/YellowTeam.png";
import PurpleTeam from "../../assets/PurpleTeam.png";

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
        return "#B708BA";
      case 3:
        return "#5E23BE";
      case 4:
        return "#11B75E";
      case 5:
        return "#AAB711";
      default:
        return "#9213E7";
    }
  }

  function getLogoColor() {
    switch (rank) {
      case 1:
        return RedTeam;
      case 2:
        return PinkTeam;
      case 3:
        return BlueTeam;
      case 4:
        return GreenTeam;
      case 5:
        return YellowTeam;
      default:
        return PurpleTeam;
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
