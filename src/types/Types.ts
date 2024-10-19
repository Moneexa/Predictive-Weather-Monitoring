export type HourlyUpdate = {
  currentTemperature: number;
  hourlyTemperature: { [key: string]: number };
};

export type ApiResponse =
  | {
      status: "error";
      errorMessage: "Try Again Later, Something Happened";
    }
  | {
      status: "success";
    };
