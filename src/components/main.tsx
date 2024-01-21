import { Box, Container, Stack, Typography } from "@mui/material";
import level1 from "../assets/mosquito-levels/1.gif";
import level2 from "../assets/mosquito-levels/2.gif";
import level3 from "../assets/mosquito-levels/3.gif";
import level4 from "../assets/mosquito-levels/4.gif";
import level5 from "../assets/mosquito-levels/5.gif";

import { SearchAutocomplete } from "./search-autocomplete";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forecast5d } from "../api";
import { MosquitoCard } from "./mosquito-card";
import useEmblaCarousel from "embla-carousel-react";

const mosquitoLevelToImage = new Map([
  [0, level1],
  [1, level2],
  [2, level3],
  [3, level4],
  [4, level5],
]);

export const Main: React.FC = () => {
  const [cityKey, setCityKey] = useState<string>("");

  const [selectedDay, setSelectedDay] = useState(0);

  const {
    mutate: forecastMutation,
    data: forecastData,
    isSuccess: isForecastSuccess,
    isPending: isForecastPending,
  } = useMutation({
    mutationFn: forecast5d,
  });

  useEffect(() => {
    if (!cityKey) return;
    forecastMutation(cityKey);
  }, [cityKey]);

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const slideSpacing = "1rem";

  return (
    <Container maxWidth="xs" sx={{ padding: 2, height: "100%" }}>
      <Stack
        direction="column"
        flexWrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundImage: `url(${mosquitoLevelToImage.get(
            forecastData?.forecast?.[selectedDay].value ?? 0
          )})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        height="100%"
        borderRadius={2}
      >
        <Stack gap={2} mt={2}>
          <Typography variant="h4">Mosquito Forecast</Typography>
          <SearchAutocomplete onChange={(key) => setCityKey(key)} />
        </Stack>

        <Box width="97%" py={1}>
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
              {forecastData?.forecast.map((forecast, index) => (
                <MosquitoCard
                  key={index}
                  localDateTime={forecast.localDateTime}
                  value={forecast.value}
                  category={forecast.category}
                  onClick={() => setSelectedDay(index)}
                  selected={index === selectedDay}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};
