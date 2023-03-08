        const speech = new SpeechSynthesisUtterance()
        function play (){
            const message = document.getElementById("message").value;
            speech.lang = "en"
            speech.text = message
            speech.pitch = 5000
            window.speechSynthesis.speak(speech)
        }
        function resumePlay (){
            const message = document.getElementById("message").value;
            speech.lang = "en"
            speech.text = message
            speech.pitch = 500
            window.speechSynthesis.resume(speech)
        }
        function stopPlay (){
            const message = document.getElementById("message").value;
            speech.lang = "en"
            speech.text = message
            speech.pitch = 500
            window.speechSynthesis.cancel(speech)
        }
        function pausePlay (){
            const message = document.getElementById("message").value;
            speech.lang = "en"
            speech.text = message
            speech.pitch = 500
            window.speechSynthesis.pause(speech)
        }