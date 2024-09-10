import "./ProgressBar.css";

import { LinearProgress, linearProgressClasses, styled } from "@mui/material";

import { ProgressBarProps } from "./ProgressBar.props";

const ProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) =>
    prop !== "barColor" && prop !== "backgroundColor",
})<ProgressBarProps>(({ theme, barColor, backgroundColor }) => ({
  height: "5vh",
  borderRadius: 5,
  transform: "skewX(-20deg)", 
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      backgroundColor ||
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      barColor || (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
    transform: "skewX(20deg)",
  },
}));


export default function ProgressBarComponent(props: ProgressBarProps) {
  return (
    <div className="ProgressBar">
      <ProgressBar
        variant="determinate"
        value={props.value}
        barColor={props.barColor}
        backgroundColor={props.backgroundColor}
      />
    </div>
  );
}
