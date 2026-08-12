const fileInput = document.getElementById("upload");
const message = document.getElementById("message");
let activeButton = document.getElementById("active-button");

const speech = new SpeechSynthesisUtterance();

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    try {

        // =====================================================
        // TXT
        // =====================================================

        if (fileName.endsWith(".txt")) {

            const reader = new FileReader();

            reader.onload = () => {
                message.value = reader.result;
            };

            reader.onerror = () => {
                message.value = "Error reading TXT file.";
            };

            reader.readAsText(file);
        }


        // =====================================================
        // PDF
        // =====================================================

        else if (fileName.endsWith(".pdf")) {

            const arrayBuffer = await file.arrayBuffer();

            const pdf = await pdfjsLib
                .getDocument({
                    data: arrayBuffer
                })
                .promise;

            let fullText = "";

            // Read every page
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

                const page = await pdf.getPage(pageNumber);

                const textContent = await page.getTextContent();

                const pageText = textContent.items
                    .map(item => item.str)
                    .join(" ");

                fullText += pageText + "\n\n";
            }

            message.value = fullText.trim();
        }


        // =====================================================
        // DOCX
        // =====================================================

        else if (fileName.endsWith(".docx")) {

            const arrayBuffer = await file.arrayBuffer();

            const result = await mammoth.extractRawText({
                arrayBuffer: arrayBuffer
            });

            message.value = result.value.trim();
        }


        // =====================================================
        // DOC
        // =====================================================

        else if (fileName.endsWith(".doc")) {

            message.value =
                "Old Microsoft Word (.doc) files are not supported directly in the browser. " +
                "Please convert the file to .docx and upload it again.";

        }


        // =====================================================
        // UNSUPPORTED FILE
        // =====================================================

        else {

            message.value =
                "Unsupported file type. Please upload a .txt, .pdf, .docx, or .doc file.";

        }

    } catch (error) {

        console.error("Error reading file:", error);

        message.value =
            "An error occurred while reading the file.";

    }
});


// =========================================================
// GET TEXT
// =========================================================

function getText() {

    const text = message.value.trim();

    if (!text) {
        return false;
    }

    speech.lang = "en-US";
    speech.text = text;

    return true;
}


// =========================================================
// PLAY
// =========================================================

function play() {

    if (!getText()) {
        alert("There is no text to read.");
        return;
    }

    activeButton.innerText = "playing"
    // Stop anything currently playing
    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);

}


// =========================================================
// RESUME
// =========================================================

function resumePlay() {
      if (!getText()) {
        alert("There is no text to read.");
        return;
    }
    window.speechSynthesis.resume();
    activeButton.innerText = "playing"
}


// =========================================================
// PAUSE
// =========================================================

function pausePlay() {
      if (!getText()) {
        alert("There is no text to read.");
        return;
    }
    window.speechSynthesis.pause();
    activeButton.innerText = "paused"

}


// =========================================================
// STOP
// =========================================================

function stopPlay() {
      if (!getText()) {
        alert("There is no text to read.");
        return;
    }
    window.speechSynthesis.cancel();
    activeButton.innerText = "stopped"

}