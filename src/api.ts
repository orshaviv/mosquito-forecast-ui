const baseURL = "https://l0hw1mc2b6.execute-api.us-east-1.amazonaws.com/dev";

export interface City {
  key: string;
  type: string;
  localizedName: string;
  country: {
    id: string;
    localizedName: string;
  };
  administrativeArea: {
    id: string;
    localizedName: string;
  };
}

interface SearchCitiesResponse {
  cities: City[];
}

export const searchCities = async (
  city: string
): Promise<SearchCitiesResponse> => {
  // // TODO: Remove mock
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // return {
  //   cities: [
  //     {
  //       key: "215854",
  //       type: "city",
  //       localizedName: "Tel Aviv",
  //       country: {
  //         id: "IL",
  //         localizedName: "Israel",
  //       },
  //       administrativeArea: {
  //         id: "TA",
  //         localizedName: "Tel Aviv",
  //       },
  //     },
  //     {
  //       key: "123345",
  //       type: "city",
  //       localizedName: "New York",
  //       country: {
  //         id: "US",
  //         localizedName: "United States",
  //       },
  //       administrativeArea: {
  //         id: "NY",
  //         localizedName: "New York",
  //       },
  //     },
  //   ],
  // };

  const res = await fetch(
    `${baseURL}/search-city?q=${encodeURIComponent(city)}`
  );
  const data = await res.json();

  if (res.status !== 200) throw new Error(data);

  return data;
};

type Category = "Low" | "Moderate" | "High";

export interface Forecast {
  name: string;
  localDateTime: string;
  epochDateTime: number;
  value: number;
  category: Category;
  mobileLink: string;
  link: string;
}

export const forecast5d = async (
  cityKey: string
): Promise<{ forecast: Forecast[] }> => {
  // // TODO: Remove mock
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // return {
  //   forecast: [
  //     {
  //       name: "Mosquito Activity Forecast",
  //       localDateTime: "2024-01-21T07:00:00-05:00",
  //       epochDateTime: 1705838400,
  //       value: 0,
  //       category: "Low",
  //       mobileLink:
  //         "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //       link: "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //     },
  //     {
  //       name: "Mosquito Activity Forecast",
  //       localDateTime: "2024-01-22T07:00:00-05:00",
  //       epochDateTime: 1705924800,
  //       value: 1,
  //       category: "Low",
  //       mobileLink:
  //         "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //       link: "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //     },
  //     {
  //       name: "Mosquito Activity Forecast",
  //       localDateTime: "2024-01-23T07:00:00-05:00",
  //       epochDateTime: 1706011200,
  //       value: 2,
  //       category: "Moderate",
  //       mobileLink:
  //         "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //       link: "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //     },
  //     {
  //       name: "Mosquito Activity Forecast",
  //       localDateTime: "2024-01-24T07:00:00-05:00",
  //       epochDateTime: 1706097600,
  //       value: 3,
  //       category: "High",
  //       mobileLink:
  //         "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //       link: "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //     },
  //     {
  //       name: "Mosquito Activity Forecast",
  //       localDateTime: "2024-01-25T07:00:00-05:00",
  //       epochDateTime: 1706184000,
  //       value: 4,
  //       category: "High",
  //       mobileLink:
  //         "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //       link: "http://www.accuweather.com/en/us/new-york-ny/10021/mosquito-activity-weather/349727?lang=en-us",
  //     },
  //   ],
  // };

  const res = await fetch(
    `${baseURL}//forecast/5d/${encodeURIComponent(cityKey)}`
  );

  const data = await res.json();

  if (res.status !== 200) throw new Error(data);

  return data;
};
