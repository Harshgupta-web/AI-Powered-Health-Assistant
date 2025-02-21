let isReading = false;
        let speech = null;

        function toggleReading() {
            const textContent = document.getElementById("response").textContent;
            const button = document.getElementById("toggleBtn");

            if (isReading) {
                window.speechSynthesis.cancel();
                button.innerText = "🗣";
                isReading = false;
            } else {
                speech = new SpeechSynthesisUtterance(textContent);
                window.speechSynthesis.speak(speech);
                button.innerText = "🔴";
                isReading = true;

                speech.onend = () => {
                    button.innerText = "🗣";
                    isReading = false;
                };
            }
        }