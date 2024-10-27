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
                setChatResponse("")

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
    return <div style={{ margin: "10px" }}>
        <form onSubmit={hanSubmission} style={{ padding: "50px", flexGrow: "2 1", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <input value={userInput} placeholder='Type the prompt here' onChange={(e) => handleInput(e.target.value)} style={{
                borderRadius: "25px", width: "100%",
                padding: "10px 25px",
                border: "1px solid #ccc",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }} />
            <button>Submit</button>
        </form>
        <p>{chatResponse}</p>
    </div>
};

export default App;
