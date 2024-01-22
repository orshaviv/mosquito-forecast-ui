import { Box, Stack } from "@mui/system";
import { Forecast } from "../api";
import useEmblaCarousel from "embla-carousel-react";
import { Dispatch } from "react";
import { makeStyles } from "tss-react/mui";
import { Card, CardActions, Chip, Divider, Typography } from "@mui/material";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const useCardStyles = makeStyles<{ selected: boolean }>()(
  (theme, { selected }) => ({
    card: {
      cursor: "pointer",
      padding: 4,
      borderRadius: 8,
      textAlign: "center",
      flex: `0 0 25%`,
      minWidth: 0,
      pl: "1rem",
      position: "relative",
      color: theme.palette.text.primary,
      backgroundColor: selected
        ? "rgba(91, 107, 133, 0.8)"
        : "rgba(135, 142, 153, 0.5)",
    },
  })
);

const MosquitoCard: React.FC<{
  forecast: Forecast;
  onClick: () => void;
  selected?: boolean;
}> = ({ forecast, onClick, selected }) => {
  const localeDateTime = new Date(forecast.localDateTime);
  const date = localeDateTime.getDate();
  const day = localeDateTime.getDay();

  const { classes } = useCardStyles({ selected: !!selected });

  return (
    <Card onClick={onClick} className={classes.card}>
      <Typography>
        {date} {days[day]}
      </Typography>
      <Divider orientation="horizontal" />

      <Stack gap={1} mt={1}>
        <Chip label={forecast.category} />
        <Chip label={`Level ${forecast.value}`} />
      </Stack>

      <CardActions>{/* TBD */}</CardActions>
    </Card>
  );
};

interface MosquitoCardsCarouselProps {
  forecast: Forecast[];
  selectedDay: number;
  setSelectedDay: Dispatch<number>;
}

export const MosquitoCardsCarousel: React.FC<MosquitoCardsCarouselProps> = ({
  forecast,
  selectedDay,
  setSelectedDay,
}) => {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const slideSpacing = "1rem";

  return (
    <Box>
      <Box overflow="hidden" ref={emblaRef}>
        <Stack
          direction="row"
          width="100%"
          gap={1}
          sx={{
            backfaceVisibility: "hidden",
            touchAction: "pan-y",
            ml: `calc(${slideSpacing} * -1)`,
          }}
        >
          {forecast.map((forecast, index) => (
            <MosquitoCard
              key={index}
              forecast={forecast}
              onClick={() => setSelectedDay(index)}
              selected={index === selectedDay}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
