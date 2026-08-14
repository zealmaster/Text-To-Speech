const fileInput = document.getElementById("upload");
const message = document.getElementById("message");
const activeButton = document.getElementById("active-button");
const voiceSelect = document.getElementById("voiceSelect");
const speed = document.getElementById("speed");

const speech = new SpeechSynthesisUtterance();

let isDragOver = false;
let voices = [];


// =========================================================
// DRAG & DROP
// =========================================================

function onDragOver(event) {

    event.preventDefault();
    event.stopPropagation();

    isDragOver = true;

    // Optional: add visual styling
    document
        .querySelector('.file-drop-zone')
        .classList.add('drag-over');
}


function onDragLeave(event) {

    event.preventDefault();
    event.stopPropagation();

    isDragOver = false;

    document
        .querySelector('.file-drop-zone')
        .classList.remove('drag-over');
}


function onDrop(event) {

    event.preventDefault();
    event.stopPropagation();

    isDragOver = false;

    const dropZone =
        document.querySelector('.file-drop-zone');

    dropZone.classList.remove('drag-over');

    const files =
        event.dataTransfer.files;

    if (files && files.length > 0) {
        processFile(files[0]);
    }
}


function onFileSelected(event) {

    const input = event.target;

    if (input.files && input.files.length > 0) {
        processFile(input.files[0]);
    }
}


speed.addEventListener("change", () => {
    speech.rate = speed.value;
});

// =========================================================
// PROCESS FILE
// =========================================================

function processFile(file) {

    const allowedTypes = [
        'txt',
        'pdf',
        'doc',
        'docx'
    ];

    const extension = file.name
        .split('.')
        .pop()
        .toLowerCase();

    if (!extension || !allowedTypes.includes(extension)) {

        alert(
            'Please select a TXT, PDF, DOC, or DOCX file.'
        );

        return;
    }

    console.log('Selected file:', file);

    // Your file processing/upload logic here
}


fileInput.addEventListener(
    "change",
    async (event) => {

        const file =
            event.target.files[0];

        if (!file) return;

        const fileName =
            file.name.toLowerCase();

        activeButton.innerText = "Loading text";

        try {

            // =====================================================
            // TXT
            // =====================================================

            if (fileName.endsWith(".txt")) {

                const reader =
                    new FileReader();

                reader.onload = () => {

                    message.value =
                        reader.result;
                    activeButton.innerText = "Ready!";
                };

                reader.onerror = () => {

                    message.value =
                        "Error reading TXT file.";
                    activeButton.innerText = "Error reading file";
                };

                reader.readAsText(file);
            }


            // =====================================================
            // PDF
            // =====================================================

            else if (fileName.endsWith(".pdf")) {

                const arrayBuffer =
                    await file.arrayBuffer();

                const pdf =
                    await pdfjsLib
                        .getDocument({
                            data: arrayBuffer
                        })
                        .promise;

                let fullText = "";

                // Read every page
                for (
                    let pageNumber = 1;
                    pageNumber <= pdf.numPages;
                    pageNumber++
                ) {

                    const page =
                        await pdf.getPage(pageNumber);

                    const textContent =
                        await page.getTextContent();

                    const pageText =
                        textContent.items
                            .map(item => item.str)
                            .join(" ");

                    fullText +=
                        pageText + "\n\n";
                }

                message.value =
                    fullText.trim();
                activeButton.innerText = "Ready!";
            }


            // =====================================================
            // DOCX
            // =====================================================

            else if (fileName.endsWith(".docx")) {

                const arrayBuffer =
                    await file.arrayBuffer();

                const result =
                    await mammoth.extractRawText({
                        arrayBuffer: arrayBuffer
                    });

                message.value =
                    result.value.trim();
                activeButton.innerText = "Ready!";
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

            console.error(
                "Error reading file. Please try again.",
                error
            );

            message.value =
                "An error occurred while reading the file.";
            activeButton.innerText = "Error reading file";
        }
    }
);


// =========================================================
// GET TEXT
// =========================================================

function getText() {

    const text =
        message.value.trim();

    if (!text) {
        return false;
    }

    speech.text =
        text;

    // =====================================================
    // APPLY SELECTED VOICE
    // =====================================================

    const selectedIndex =
        voiceSelect.value;

    if (selectedIndex !== "") {

        const selectedVoice =
            voices[selectedIndex];

        if (selectedVoice) {

            speech.voice =
                selectedVoice;

            speech.lang =
                selectedVoice.lang;
        }

    } else {

        speech.voice =
            null;

        speech.lang =
            "en-US";
    }

    return true;
}


// =========================================================
// SPEECH VOICES
// =========================================================

function loadVoices() {

    voices =
        window.speechSynthesis.getVoices();

    if (!voiceSelect) {
        return;
    }

    voiceSelect.innerHTML =
        '<option value="">Select Voice</option>';

    voices
        .filter(voice =>
            voice.lang
                .toLowerCase()
                .startsWith("en")
        )
        .forEach((voice) => {

            const option =
                document.createElement("option");

            /*
             * Use the original voice index
             * from the voices array.
             */
            option.value =
                voices.indexOf(voice);

            option.textContent =
                `${voice.name} - ${voice.lang}`;

            voiceSelect.appendChild(option);
        });
}


// =========================================================
// LOAD VOICES
// =========================================================

window.speechSynthesis.onvoiceschanged =
    loadVoices;

loadVoices();


// =========================================================
// VOICE SELECTION
// =========================================================

voiceSelect.addEventListener(
    "change",
    () => {

        const selectedIndex =
            voiceSelect.value;

        // Default voice
        if (selectedIndex === "") {

            speech.voice =
                null;

            speech.lang =
                "en-US";

            return;
        }

        const selectedVoice =
            voices[selectedIndex];

        if (selectedVoice) {

            speech.voice =
                selectedVoice;

            speech.lang =
                selectedVoice.lang;
        }
    }
);


function play() {
    if (!getText()) {
        alert(
            "There is no text to read."
        );
        return;
    }
    activeButton.innerText = "playing";
    // Stop anything currently playing
    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        speech
    );
}

function resumePlay() {
    if (!getText()) {
        alert(
            "There is no text to read."
        );
        return;
    }
    window.speechSynthesis.resume();
    activeButton.innerText = "playing";
}

function pausePlay() {
    if (!getText()) {
        alert(
            "There is no text to read."
        );
        return;
    }
    window.speechSynthesis.pause();
    activeButton.innerText = "paused";
}

function stopPlay() {
    if (!getText()) {
        alert(
            "There is no text to read."
        );
        return;
    }
    window.speechSynthesis.cancel();
    activeButton.innerText = "stopped";
}

function formatReadingDuration(seconds) {

    const totalSeconds =
        Math.max(0, Math.round(seconds));

    const minutes =
        Math.floor(totalSeconds / 60);

    const remainingSeconds =
        totalSeconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
}


// =========================================================
// READING START TIME
// =========================================================

let readingStartTime = null;


speech.addEventListener("start", () => {

    readingStartTime =
        Date.now();

    activeButton.innerText =
        "Reading...";
});


// =========================================================
// READING END
// =========================================================

speech.addEventListener("end", () => {

    if (!readingStartTime) {
        return;
    }

    const elapsedSeconds =
        (Date.now() - readingStartTime) / 1000;

    const durationText =
        formatReadingDuration(elapsedSeconds);

    activeButton.innerText =
        `Finished reading in ${durationText}`;

    readingStartTime = null;
});

// =========================================================
// DISABLE CONTEXT MENU
// =========================================================

document.addEventListener(
    'contextmenu',
    e => e.preventDefault()
);


// =========================================================
// DISABLE DEVTOOLS SHORTCUTS
// =========================================================

document.addEventListener(
    'keydown',
    e => {

        if (
            e.key === 'F12' ||
            (
                e.ctrlKey &&
                e.shiftKey &&
                ['I', 'J', 'C']
                    .includes(
                        e.key.toUpperCase()
                    )
            )
        ) {

            e.preventDefault();
        }
    }
);