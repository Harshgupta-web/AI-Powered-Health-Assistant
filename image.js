const imageUpload = document.getElementById("imageUpload");
const sendImageBtn = document.getElementById("sendImageBtn");
const imageResponseDiv = document.getElementById("response");
let imageBase64 = "";

// 🎨 Convert Image to Base64
imageUpload.onchange = () => {
    const file = imageUpload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        imageBase64 = reader.result.split(",")[1]; // Get Base64 data
        sendImageBtn.disabled = false; // Enable send button
    };
};

// 📤 Send Image to Gemini
async function sendImageToGemini() {
    if (!imageBase64) return alert("No image selected!");
    document.getElementById("response").style.display = "block";
    imageResponseDiv.innerHTML = "Processing image...";

    const API_KEY = "AIzaSyAPcxVq8DSHr7OGgEPBXg4EMgmZNDBF-Fg";
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
                            Analyze the image provided and describe its content in detail. 
                            If the image features medical instruments (e.g., stethoscopes, thermometers, surgical tools), explain their uses, importance, 
                            and how they contribute to diagnosing or treating medical conditions. 
                            If the image shows diagnostic images (e.g., X-rays, MRIs, CT scans), analyze the conditions or injuries depicted, 
                            and provide insights into potential diagnoses, such as bone fractures, organ abnormalities, or other health conditions. 
                            If the image shows a skin condition, infection, or visible symptoms (e.g., rashes, wounds, or infections), 
                            provide a detailed explanation about the symptoms, possible causes (such as bacterial, fungal, or viral infections), 
                            and recommended treatments or preventative measures. If the image is of a medical procedure 
                            (e.g., surgery, injection, or physical therapy), describe the steps involved, the tools used, the general purpose of the procedure, and any safety precautions. 
                            Ensure that the analysis is aligned with the latest medical knowledge and guidelines, and provide professional insights and advice based on the image content.
                            Always give responses in plain text format.`
                        },
                        {
                            inline_data: {
                                mime_type: "image/png",
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    imageResponseDiv.innerHTML =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    setTimeout(() => {
        toggleReading();
    }, 1000);
}

sendImageBtn.onclick = sendImageToGemini;
