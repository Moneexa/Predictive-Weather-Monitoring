export type WeatherUpdate = {
  currentTemperature: string;
  otherTemperatures: {
    [key: string]: {
      temperature: string;
      "day duration": number;
      rain: number;
      snow: number;
    };
  };
};

type ApiPreciseResponse = {
  latitude: 59.915257;
  longitude: 10.742905;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: "GMT";
  timezone_abbreviation: "GMT";
  elevation: number;
  current_units: {
    time: "iso8601";
    interval: "seconds";
    temperature_2m: "°C";
    is_day: "";
    rain: "mm";
    showers: "mm";
    snowfall: "cm";
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    is_day: number;
    rain: number;
    showers: number;
    snowfall: number;
  };
  type: {
    time: string[];
    temperature_2m: number[];
    rain: number[];
    is_day: number[];
    showers: number[];
    snowfall: number[];
  };
};

export type ApiResponse =
  | {
      status: "error";
      errorMessage: "Try Again Later, Something Happened";
    }
  | {
      status: "success";
      data: ApiPreciseResponse;
    };
