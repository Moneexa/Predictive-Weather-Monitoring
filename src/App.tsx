import React, { FormEvent, useEffect, useState } from 'react';
import { getWeatherUpdate } from './getWeatherUpdate';
import { WeatherUpdate } from './types/Types';
import { getFormalizedReponse } from './getFormalizedResponse';
import axios from 'axios';

const App: React.FC = () => {
    const [dataStuff, setDataStuff] = useState<WeatherUpdate>({
        "currentTemperature": "", "otherTemperatures": {}
    })
    const [userInput, setUserInput] = useState('')
    const [chatResponse, setChatResponse] = useState('')

    useEffect(() => {
        async function abc() {
            const results = await getWeatherUpdate("hourly")
            if (results.status == "success") {
                const response = getFormalizedReponse(results, "hourly")
                if (response) {
                    setDataStuff(response)
                }
            } else {
                alert(results.errorMessage)
            }
        }
        abc()
    }, [])

    const handleInput = (val: string) => {
        setUserInput(val)
    }
    const hanSubmission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        debugger
        try {
            const res = await axios.post('http://localhost:11434/api/generate',
                {
                    model: 'llama3.2', // or another model available in your Ollama
                    stream: false,
                    prompt: userInput + JSON.stringify(dataStuff),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

            const data = await res.data;
            setChatResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return <>
        <form onSubmit={hanSubmission}>
            <input value={userInput} placeholder='Type the prompt here' onChange={(e) => handleInput(e.target.value)} />
        </form>
        <p>{chatResponse}</p>
    </>
};

export default App;
