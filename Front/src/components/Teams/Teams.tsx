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
  const { teams, maxScore } = props;

  function getScore(score: Record<string, number>) {
    return Object.values(score).reduce((total, value) => total + value, 0);
  }

  function getBarColor(rank: number) {
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

  function getLogoColor(rank: number) {
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

  return (
    <div className="Teams">
      {teams.map((team, index) => {
        const score = getScore(team.score);
        const progressBarValue = (score / maxScore) * 100;
        const rank = index + 1;

        return (
          <div className="TeamsContainer" key={team.id}>
            <div
              className="Teams-logo-wrapper"
              style={{ backgroundImage: `url(${getLogoColor(rank)})` }}
            >
              {/* <img src={team.logo} alt={team.name} className="Teams-logo" /> */}
            </div>
            <div>
              <div className="Teams-name" style={{ color: getBarColor(rank) }}>
                {team.name}
              </div>
              <div className="Teams-score">{score}</div>
            </div>
            <ProgressBarComponent
              value={progressBarValue}
              barColor={getBarColor(rank)}
              backgroundColor="#E5E4E2"
            />
          </div>
        );
      })}
    </div>
  );
};
