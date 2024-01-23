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
      justifyContent: "center",
      height: "100vh",
    },

    app: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "40%",
        maxWidth: 600,
      },
      height: "100%",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      borderRadius: 2,

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
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
    <Box className={classes.container}>
      <Stack className={classes.app}>
        <Stack
          gap={4}
          mt={10}
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
        >
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
    </Box>
  );
};
