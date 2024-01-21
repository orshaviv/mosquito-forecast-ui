import React from "react";
import Stack from "@mui/material/Stack";
import { Divider, Paper, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const useStyles = makeStyles<{ selected: boolean }>()(
  (theme, { selected }) => ({
    card: {
      cursor: "pointer",
      height: 120,
      padding: 4,
      borderRadius: 8,
      textAlign: "center",
      flex: `0 0 25%`,
      minWidth: 0,
      pl: "1rem",
      position: "relative",
      color: theme.palette.text.primary,
      backgroundColor: selected
        ? theme.palette.secondary.light
        : theme.palette.background.default,
      opacity: 0.6,
    },
  })
);

export const MosquitoCard: React.FC<{
  localDateTime: string;
  value: number;
  category: string;
  onClick: () => void;
  selected?: boolean;
}> = ({ localDateTime, value, category, onClick, selected }) => {
  const localeDateTime = new Date(localDateTime);
  const date = localeDateTime.getDate();
  const day = localeDateTime.getDay();

  const { classes } = useStyles({ selected: !!selected });

  return (
    <Paper square={false} onClick={onClick} className={classes.card}>
      <Stack>
        <Typography>{date}</Typography>
        <Typography>{days[day]}</Typography>
        <Divider orientation="horizontal" />

        <Typography variant="subtitle1">{value}</Typography>
        <Typography variant="subtitle1">{category}</Typography>
      </Stack>
    </Paper>
  );
};
