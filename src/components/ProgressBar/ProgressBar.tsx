import "./ProgressBar.css";

import { LinearProgress, linearProgressClasses, styled } from "@mui/material";

import { ProgressBarProps } from "./ProgressBar.props";

const ProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) =>
    prop !== "barColor" && prop !== "backgroundColor",
})<ProgressBarProps>(({ theme, barColor, backgroundColor }) => ({
  height: 50,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      backgroundColor ||
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      barColor || (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
  },
}));

export default function ProgressBarComponent(props: ProgressBarProps) {
  console.log(props);

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
