        const fileInput = document.getElementById('upload')
        let message = document.getElementById("message")
        const speech = new SpeechSynthesisUtterance()
        fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = () => {
            message.innerHTML = reader.result
        }
        reader.onerror = () => {
            message.textContent = 'Error reading file'
        }
        })
        
        function getText (){
            const message = document.getElementById("message").value
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