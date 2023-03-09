        const speech = new SpeechSynthesisUtterance()
        function getText (){
            const message = document.getElementById("message").value;
            speech.lang = "en"
            speech.text = message
        }
        function play (){
            getText()
            window.speechSynthesis.speak(speech)
        }
        function resumePlay (){
            getText()
            window.speechSynthesis.resume(speech)
        }
        function stopPlay (){
            getText()
            window.speechSynthesis.cancel(speech)
        }
        function pausePlay (){
            getText()
            window.speechSynthesis.pause(speech)
        }