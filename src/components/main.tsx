import { Box, Chip, Stack } from "@mui/material";
import { SearchAutocomplete } from "./search-autocomplete";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { forecast5d } from "../api";
import { makeStyles } from "tss-react/mui";
import CircularProgress from "@mui/material/CircularProgress";
import { MosquitoCardsCarousel } from "./mosquito-cards-carousel";

const cloudinaryBaseUri = "https://res.cloudinary.com/dptn7fuko/image/upload";

const mosquitoLevelToImage = new Map([
  [0, `${cloudinaryBaseUri}/v1706006793/mosquito-levels/level-1.gif`],
  [1, `${cloudinaryBaseUri}/v1706006795/mosquito-levels/level-2.gif`],
  [2, `${cloudinaryBaseUri}/v1706006780/mosquito-levels/level-3.gif`],
  [3, `${cloudinaryBaseUri}/v1706006790/mosquito-levels/level-4.gif`],
  [4, `${cloudinaryBaseUri}/v1706006791/mosquito-levels/level-5.gif`],
]);

const getMosquitoLevelImage = (level: number) => {
  return mosquitoLevelToImage.get(Math.min(level, 4)) as string;
};

const useStyles = makeStyles<{ backgroundImage: string }>()(
  (theme, { backgroundImage }) => ({
    container: {
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "space-between",
      alignItems: "center",

      width: 600,
      [theme.breakpoints.down("lg")]: {
        width: "100%",
      },
      height: "100vh",

      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      borderRadius: 2,
    },
  })
);

export const Main: React.FC = () => {
  const [cityKey, setCityKey] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);

  const { data: forecastData, isFetching: isForecastFetching } = useQuery({
    queryKey: ["forecast", cityKey],
    queryFn: () => forecast5d(cityKey),
    enabled: !!cityKey,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });

  const selectedForecast = forecastData?.forecast?.[selectedDay];

  const { classes } = useStyles({
    backgroundImage: getMosquitoLevelImage(selectedForecast?.value ?? 0),
  });
  return (
    <Stack className={classes.container}>
      <Stack gap={4} mt={10} alignItems="center" justifyContent="flex-start">
        <SearchAutocomplete onChange={setCityKey} />
        {!!isForecastFetching && <CircularProgress />}
        {!!selectedForecast && (
          <Stack gap={1}>
            <Chip label={selectedForecast.category} />
            <Chip label={`Level ${selectedForecast.value}`} />
          </Stack>
        )}
      </Stack>

      <Box width="97%" p={1}>
        <MosquitoCardsCarousel
          forecast={forecastData?.forecast ?? []}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </Box>
    </Stack>
  );
};
