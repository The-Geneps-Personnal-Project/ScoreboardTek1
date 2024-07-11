import React from "react";

export type TeamsProps = {
  name: string;
  logo: string;
  score?: Record<string, number>;
  rank: number;
  maxScore: number;
} & React.HTMLAttributes<HTMLDivElement>;
