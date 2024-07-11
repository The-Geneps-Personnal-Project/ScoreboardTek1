import { LinearProgressProps as MuiLinearProgressProps } from "@mui/material/LinearProgress";

export interface ProgressBarProps extends MuiLinearProgressProps {
  value: number;
  barColor?: string;
  backgroundColor?: string;
}
