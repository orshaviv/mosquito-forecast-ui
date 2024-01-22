import { Box, Chip, Container, Stack } from "@mui/material";
import level1 from "../assets/mosquito-levels/1.gif";
import level2 from "../assets/mosquito-levels/2.gif";
import level3 from "../assets/mosquito-levels/3.gif";
import level4 from "../assets/mosquito-levels/4.gif";
import level5 from "../assets/mosquito-levels/5.gif";
import { SearchAutocomplete } from "./search-autocomplete";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { forecast5d } from "../api";
import { makeStyles } from "tss-react/mui";
import CircularProgress from "@mui/material/CircularProgress";
import { MosquitoCardsCarousel } from "./mosquito-cards-carousel";

const mosquitoLevelToImage = new Map([
  [0, level1],
  [1, level2],
  [2, level3],
  [3, level4],
  [4, level5],
]);

const getMosquitoLevelImage = (level: number) => {
  return mosquitoLevelToImage.get(Math.min(level, 4));
};

const useStyles = makeStyles()((theme) => ({
  container: {
    width: 600,
    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
    height: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const Main: React.FC = () => {
  const { classes } = useStyles();

  const [cityKey, setCityKey] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);

  const { data: forecastData, isFetching: isForecastFetching } = useQuery({
    queryKey: ["forecast", cityKey],
    queryFn: () => forecast5d(cityKey),
    enabled: !!cityKey,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });

  const selectedForecast = forecastData?.forecast?.[selectedDay];
  return (
    <Container className={classes.container}>
      <Stack
        direction="column"
        flexWrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundImage: `url(${getMosquitoLevelImage(
            selectedForecast?.value ?? 0
          )})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        height="100%"
        width="100%"
        borderRadius={2}
      >
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
    </Container>
  );
};
