import { ApiResponse, WeatherUpdate } from "./types/Types";

export const getFormalizedReponse = (
  weatherApiResponse: ApiResponse,
  type: "weekly" | "hourly"
) => {
  if (weatherApiResponse.status === "success") {
    const dataResponse = weatherApiResponse.data;

    let time = dataResponse.type.time;
    const temperature2m = dataResponse.type.temperature_2m;
    const snow = dataResponse.type.snowfall;
    const rain = dataResponse.type.rain;
    const is_day = dataResponse.type.is_day;
    const currentTemp = dataResponse.current.temperature_2m;
    const currentHour = new Date().getHours();
    const today = new Date().getDate();
    const otherTemperaturesObj: WeatherUpdate["otherTemperatures"] = {};
    time.forEach((timeDate: string, index: number) => {
      const hours = new Date(timeDate).getHours();
      const date = new Date(timeDate).getDate();
      if (hours > currentHour && date == today) {
        otherTemperaturesObj[hours] = {
          temperature: `${temperature2m[index]} degree Celcius`,
          "day duration": is_day[index],
          rain: rain[index],
          snow: snow[index],
        };
      }
    });
    const settingObj: WeatherUpdate = {
      currentTemperature: `${currentTemp} degree Celcius`,
      otherTemperatures: otherTemperaturesObj,
    };
    return settingObj;
  }
  return;
};
