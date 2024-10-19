import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HourlyUpdate, ApiResponse } from './types/Types';

const App: React.FC = () => {
    const [dataStuff, setDataStuff] = useState<HourlyUpdate>({
        "currentTemperature": 0, "hourlyTemperature": {}
    })
    const getWeatherUpdate = async () => {
        try {
            const response = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=59.9127&longitude=10.7461&current=temperature_2m&hourly=temperature_2m")
            if (response.data) {
                let time = response.data.hourly.time;
                const temperature2m = response.data.hourly.temperature_2m;
                const currentTemp = response.data.current.temperature_2m;
                const currentHour = new Date().getHours();
                const today = (new Date()).getDate()
                const hourlyTemperatureObj: { [key: number]: number } = {};
                time.forEach((timeDate: string, index: number) => {
                    const hours = (new Date(timeDate)).getHours()
                    const date = (new Date(timeDate)).getDate()
                    if (hours > currentHour && date == today) {
                        hourlyTemperatureObj[hours] = temperature2m[index];
                    }
                });

                // Create the final object with the current temperature and hourly temperature mapping
                const settingObj: HourlyUpdate = {
                    "currentTemperature": currentTemp,
                    "hourlyTemperature": hourlyTemperatureObj
                };

                // Set the state with the newly constructed object
                setDataStuff(settingObj);

                console.log(time); // To inspect the final object
            }
        } catch (error) {

        }

    }
    useEffect(() => {
    }, [])
    return <>
        <p>Current Temperature:{dataStuff.currentTemperature}</p>
        <p>Hourly Temperature:</p>
        {
            Object.entries(dataStuff.hourlyTemperature).map(([time, temp]) => {
                return <p>{time}:{temp}</p>
            })
        }
    </>
};

export default App;
