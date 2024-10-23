import axios from "axios";
import { ApiResponse } from "./types/Types";
import { apiUrl } from "./config";

export const getWeatherUpdate = async (
  type: "weekly" | "hourly"
): Promise<ApiResponse> => {
  const response = await axios.get(
    `${apiUrl}&current=temperature_2m,is_day,rain,showers,snowfall&${type}=temperature_2m,is_day,rain,showers,snowfall`
  );
  if (response) {
    const dataResp = response.data;
    dataResp["type"] = dataResp[type];
    return {
      status: "success",
      data: dataResp,
    };
  } else {
    return {
      status: "error",
      errorMessage: "Try Again Later, Something Happened",
    };
  }
};
