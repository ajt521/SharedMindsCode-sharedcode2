let container; // Container for all interactions

// Initialize the app
function init() {
    container = document.createElement("div");
    container.style.width = "80%";
    container.style.margin = "0 auto";
    container.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(container);

    // Create the initial input block
    createInteractionBlock("What do you want to hear and how should it feel?");
}

// Create a new interaction block
function createInteractionBlock(prompt) {
    const block = document.createElement("div");
    block.style.marginBottom = "30px";
    block.style.padding = "20px";
    block.style.border = "1px solid #ddd";
    block.style.borderRadius = "8px";
    block.style.backgroundColor = "#f9f9f9";

    // Prompt input field
    const promptField = document.createElement("textarea");
    promptField.value = prompt;
    promptField.style.width = "100%";
    promptField.style.height = "50px";
    promptField.style.marginBottom = "10px";
    block.appendChild(promptField);

    // Generate button
    const generateButton = document.createElement("button");
    generateButton.innerHTML = "Generate Audio";
    generateButton.style.display = "block";
    generateButton.style.marginBottom = "10px";
    generateButton.onclick = async function () {
        generateAudio(promptField.value, block);
    };
    block.appendChild(generateButton);

    // Add block to the container
    container.appendChild(block);
}

// Generate audio and add it to the block
async function generateAudio(prompt, block) {
    const replicateProxy = "https://replicate-api-proxy.glitch.me";
    let data = {
        version: "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
        input: { prompt_a: prompt },
    };

    try {
        // Request sound data from Replicate
        const response = await fetch(`${replicateProxy}/create_n_get/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const proxyResponse = await response.json();
        const soundUrl = proxyResponse.output.audio;

        console.log("Generated sound URL:", soundUrl);

        // Display audio player
        const audioPlayer = document.createElement("audio");
        audioPlayer.src = soundUrl;
        audioPlayer.controls = true;
        audioPlayer.style.display = "block";
        audioPlayer.style.marginBottom = "10px";
        block.appendChild(audioPlayer);

        // Add interpretation field
        const interpretationField = document.createElement("textarea");
        interpretationField.placeholder = "What did you hear and how did it feel?";
        interpretationField.style.width = "100%";
        interpretationField.style.height = "50px";
        interpretationField.style.marginBottom = "10px";
        block.appendChild(interpretationField);

        // Add "Generate Next" button
        const nextButton = document.createElement("button");
        nextButton.innerHTML = "Generate Next Audio";
        nextButton.style.display = "block";
        nextButton.onclick = function () {
            createInteractionBlock(interpretationField.value);
        };
        block.appendChild(nextButton);

        // Convert audio to Base64 and send to Firebase
        const audioResponse = await fetch(soundUrl);
        const arrayBuffer = await audioResponse.arrayBuffer();
        const soundBufferb64 = bufferToBase64(arrayBuffer);

        console.log("Base64-encoded audio buffer:", soundBufferb64);

        const location = { x: 0, y: 0, z: 0 }; // Placeholder location
        sendToFirebase(prompt, location, soundUrl, soundBufferb64);
    } catch (error) {
        console.error("Error generating audio:", error);
        const errorMessage = document.createElement("p");
        errorMessage.innerHTML = "Error generating audio. Please try again.";
        errorMessage.style.color = "red";
        block.appendChild(errorMessage);
    }
}

// Utility function: Convert ArrayBuffer to Base64
function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Send data to Firebase
function sendToFirebase(prompt, location, soundUrl, soundBufferb64) {
    console.log("Sending data to Firebase...");
    console.log({
        prompt: prompt,
        location: location,
        soundUrl: soundUrl,
        soundBuffer: soundBufferb64,
    });
    // Firebase database integration goes here
}

// Initialize the interface
init();

// let inputField;
// let audioPlayer = null;

// // Initialize the app
// function init() {
//     // Create an input field for the prompt
//     inputField = document.createElement("input");
//     inputField.value = "Grateful Dead meets Hip Hop"; // Example default prompt
//     inputField.style.position = "absolute";
//     inputField.style.top = "50px";
//     inputField.style.left = "50%";
//     inputField.style.transform = "translate(-50%, -50%)";
//     inputField.style.width = "400px";
//     inputField.style.height = "20px";
//     inputField.style.fontSize = "20px";
//     document.body.appendChild(inputField);

//     // Create a button to send the prompt
//     let askButton = document.createElement("button");
//     askButton.innerHTML = "Generate Audio";
//     askButton.style.position = "absolute";
//     askButton.style.top = "80px";
//     askButton.style.left = "50%";
//     askButton.style.transform = "translate(-50%, -50%)";
//     askButton.onclick = function () {
//         askForSound(inputField.value);
//     };
//     document.body.appendChild(askButton);
// }

// async function askForSound(p_prompt) {
//     inputField.value = "Waiting on Results for: " + p_prompt;
//     document.body.style.cursor = "progress";

//     const replicateProxy = "https://replicate-api-proxy.glitch.me";
//     let data = {
//         version: "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
//         input: { prompt_a: p_prompt },
//     };

//     try {
//         console.log("Requesting sound data from Replicate...");
//         const response = await fetch(`${replicateProxy}/create_n_get/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data),
//         });

//         const proxyResponse = await response.json();
//         const soundUrl = proxyResponse.output.audio;

//         console.log("Received sound URL:", soundUrl);

//         // Fetch the audio file and convert it to Base64
//         const audioResponse = await fetch(soundUrl);
//         const arrayBuffer = await audioResponse.arrayBuffer();
//         const soundBufferb64 = bufferToBase64(arrayBuffer);

//         console.log("Base64-encoded audio buffer:", soundBufferb64);

//         // Send the result to Firebase
//         const location = { x: 0, y: 0, z: 0 }; // Example location; update as needed
//         sendToFirebase(p_prompt, location, soundUrl, soundBufferb64);

//         // Reset UI
//         document.body.style.cursor = "default";
//         inputField.value = p_prompt;

//         // Optionally display a play button
//         displayPlayButton(soundUrl);
//     } catch (error) {
//         console.error("Error fetching sound data:", error);
//         document.body.style.cursor = "default";
//         inputField.value = "Error occurred";
//     }
// }

// // Utility function: Convert ArrayBuffer to Base64
// function bufferToBase64(buffer) {
//     const bytes = new Uint8Array(buffer);
//     let binary = "";
//     for (let i = 0; i < bytes.byteLength; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
// }

// // Send data to Firebase
// function sendToFirebase(prompt, location, soundUrl, soundBufferb64) {
//     // Replace this with your Firebase logic
//     console.log("Sending data to Firebase...");
//     console.log({
//         prompt: prompt,
//         location: location,
//         soundUrl: soundUrl,
//         soundBuffer: soundBufferb64,
//     });
//     // Firebase database integration goes here
// }

// // Optional: Display a Play button to play the generated sound
// function displayPlayButton(soundUrl) {
//     const audioPlayer = document.createElement("audio");
//     audioPlayer.src = soundUrl;
//     audioPlayer.controls = true; // Adds built-in play/pause controls
//     audioPlayer.style.position = "absolute";
//     audioPlayer.style.top = "150px";
//     audioPlayer.style.left = "50%";
//     audioPlayer.style.transform = "translate(-50%, -50%)";
//     document.body.appendChild(audioPlayer);
// }


// // Initialize the interface
// init();