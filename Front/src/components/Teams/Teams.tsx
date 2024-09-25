import React from "react";

import "./Teams.css";

import { TeamsProps } from "./Teams.props";
import ProgressBarComponent from "../ProgressBar/ProgressBar";

// Logos importés
import RedTeam from "../../assets/RedTeam.png";
import BlueTeam from "../../assets/BlueTeam.png";
import GreenTeam from "../../assets/GreenTeam.png";
import PinkTeam from "../../assets/PinkTeam.png";
import YellowTeam from "../../assets/YellowTeam.png";
import PurpleTeam from "../../assets/PurpleTeam.png";

// Logos spécifiques
import arasaka_logo from "../../../src/assets/Arasaka_Logo.png";
import nomads_logo from "../../../src/assets/Nomad_Logo.png";
import militek_logo from "../../../src/assets/Militek_Logo.png";
import edgerunners_logo from "../../../src/assets/EdgeRunner_LogoBlackGreen.png";

export const Teams: React.FC<TeamsProps> = (props) => {
  const { teams, maxScore } = props;

  function getScore(score: Record<string, number>) {
    return Object.values(score).reduce((total, value) => total + value, 0);
  }


  function getTeamLogo(teamName: string) {
    switch (teamName.toLowerCase()) {
      case "arasaka":
        return arasaka_logo;
      case "nomades":
        return nomads_logo;
      case "militech":
        return militek_logo;
      case "edge runners":
        return edgerunners_logo;
      default:
        return PurpleTeam;
    }
  }

  function getBarColor(teamName: string) {
    switch (teamName.toLowerCase()) {
      case "arasaka":
        return "#C5102C";
      case "nomades":
        return "#B708BA";
      case "militech":
        return "#F5e400";
      case "edge runners":
        return "#11B75E";
      default:
        return "#9213E7";
    }
  }

  function getLogoColor(teamName: string) {
    switch (teamName.toLowerCase()) {
      case "arasaka":
        return RedTeam;
      case "nomades":
        return PinkTeam;
      case "militech":
        return YellowTeam;
      case "edge runners":
        return GreenTeam;
      default:
        return PurpleTeam;
    }
  }

  return (
    <div className="Teams">
      {teams.map((team, index) => {
        const score = getScore(team.score);
        const progressBarValue = (score / maxScore) * 100;
        const indexx = index + 1;

        return (
          <div className="TeamsContainer" key={team.id}>
            <div
              className="Teams-logo-wrapper"
              style={{ backgroundImage: `url(${getLogoColor(team.name)})` }}
            >
              {/* Si tu veux afficher l'image de logo au lieu de background-image */}
              <img src={getTeamLogo(team.name)} alt={team.name} className="Teams-logo" />
            </div>
            <div>
              <div className="Teams-name" style={{ color: getBarColor(team.name) }}>
                {team.name}
              </div>
              <div className="Teams-score">{score}</div>
            </div>
            <ProgressBarComponent
              value={progressBarValue}
              barColor={getBarColor(team.name)}
              backgroundColor="#E5E4E2"
            />
          </div>
        );
      })}
    </div>
  );
};
