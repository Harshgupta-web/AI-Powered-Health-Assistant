const API_KEY = "AIzaSyAPcxVq8DSHr7OGgEPBXg4EMgmZNDBF-Fg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function askGemini() {
    const prompt = document.getElementById("userInput").value;
    document.getElementById("userInput").value = "";
    if (!prompt) return alert("Please enter a prompt.");
    document.getElementById("response").style.display = "block";
    document.getElementById("response").innerHTML = "Thinking...";

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Assume you are a professional in the healthcare industry. 
                            Based on the text input provided, analyze the symptoms, medical conditions, or medical tools mentioned. 
                            If the input involves medical instruments or treatments, explain their functions and relevance in a clinical or diagnostic setting. 
                            If the input mentions conditions like fractures, infections, or diseases, provide detailed explanations on the causes, symptoms, and possible treatments or therapies. 
                            Additionally, if the input discusses medical procedures, describe the steps, tools used, and the general purpose of the procedure. 
                            Make sure your analysis is in line with the latest medical standards and guidelines, and offer actionable advice where applicable. 
                            Provide professional, clear, and concise medical information based on the text provided. If the input is just normal message then ask the user to provide a medical related input.
                            Always give responses in plain text format.`
                        }
                    ]
                },
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    document.getElementById("response").innerHTML =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    setTimeout(() => {
        toggleReading();
    }, 1000);
}
