import React from "react";

import { TeamInfo } from "../../App";

export type TeamsProps = {
  teams: TeamInfo[];
  maxScore: number;
} & React.HTMLAttributes<HTMLDivElement>;
