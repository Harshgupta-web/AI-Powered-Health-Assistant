let mediaRecorder;
let recordedChunks = [];

const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sendBtn = document.getElementById("sendBtn");
const responseDiv = document.getElementById("response");
const bot = document.getElementsByClassName("bot_image")[0];

// 🎥 Get webcam access
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        videoElement.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => recordedChunks.push(event.data);
        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const videoBase64 = await convertBlobToBase64(blob);

            // Store the Base64 video to send later
            localStorage.setItem("videoBase64", videoBase64);
        };
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

// Function to convert Blob to Base64
function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get Base64 part
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// ⏺ Start Recording
startBtn.onclick = async () => {
    bot.style.display = "none";
    if (!videoElement.srcObject) {
        await startCamera();
    }
    recordedChunks = [];

    setTimeout(() => {
        mediaRecorder.start();
    }, 1000);

    startBtn.disabled = true;
    stopBtn.disabled = false;
};

// ⏹ Stop Recording
stopBtn.onclick = () => {
    bot.style.display = "block";
    mediaRecorder.stop();
    stopBtn.disabled = true;
    // sendBtn.disabled = false;
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    sendToGemini();
};

// 📤 Send video to Gemini API
// 📤 Send video to Gemini API
async function sendToGemini() {
    responseDiv.style.display = "block";
    responseDiv.innerHTML = "Processing video...";

    const videoBase64 = localStorage.getItem("videoBase64");
    if (!videoBase64) return alert("No video recorded!");

    const API_KEY = "AIzaSyAPcxVq8DSHr7OGgEPBXg4EMgmZNDBF-Fg"; // Replace with your actual API Key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
                            Analyze the video provided and describe its content in detail. 
                            If the video features medical instruments like a stethoscope, thermometer, or surgical tools, explain their uses and importance in diagnosing or treating medical conditions. 
                            If the video shows an X-ray, CT scan, or MRI, analyze the condition or injury depicted and provide insights into the diagnosis based on the image. 
                            If the video involves a skin condition, infection, or any visible medical symptoms, provide a detailed explanation about the symptoms, possible causes, and suggested treatments. 
                            If the video is about a medical procedure or treatment, describe the steps, tools used, and the general purpose of the procedure. 
                            Provide clear and concise explanations for all healthcare-related content and make sure to include any relevant medical advice or recommendations based on the content of the video.
                            Always give responses in plain text format.`
                        },
                        {
                            inline_data: {
                                mime_type: "video/webm", 
                                data: videoBase64 
                            }
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    responseDiv.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    setTimeout(() => {
        toggleReading();
    }, 1000);
    startBtn.disabled = false;
    stopBtn.disabled = false;
    // sendBtn.disabled = false;
}


// Attach the send button to the sendToGemini function
// sendBtn.onclick = sendToGemini;
