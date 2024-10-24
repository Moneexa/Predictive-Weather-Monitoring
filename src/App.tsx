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
            const results = await getWeatherUpdate("weekly")
            if (results.status == "success") {
                const response = getFormalizedReponse(results)
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
            const res = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama3.2',  // Adjust based on your model
                    prompt: userInput + JSON.stringify(dataStuff),
                    stream: true,  // Enable streaming if supported by API
                }),
            });
            if (res) {
                const reader = res.body?.getReader();  // Get the reader from the stream
                const decoder = new TextDecoder();
                let done = false;
                let partialData = '';

                while (!done) {
                    if (reader) {
                        const { value, done: readerDone } = await reader?.read();
                        done = readerDone;
                        const chunkValue = decoder.decode(value, { stream: true });
                        partialData += chunkValue;
                        const responses = partialData.split('\n');
                        responses.forEach((responseString, index) => {
                            try {
                                const jsonResponse = JSON.parse(responseString);
                                setChatResponse((prev) => prev + jsonResponse.response); // Append the response
                            } catch (error) {
                                if (index === responses.length - 1) {
                                    partialData = responseString;
                                }
                            }
                        });
                    }
                }
            }
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
