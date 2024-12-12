let container; // Container for all interactions

// Initialize the app
function init() {
    console.log("Initializing the interface...");

    container = document.createElement("div");
    container.style.width = "80%";
    container.style.margin = "0 auto";
    container.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(container);

    // Create the initial input block
    createInteractionBlock("", true); // Initial block, allow user to edit prompt
}

// Create a new interaction block
function createInteractionBlock(prompt, isEditable = false) {
    console.log("Creating a new interaction block with prompt:", prompt);

    const block = document.createElement("div");
    block.style.marginBottom = "30px";
    block.style.padding = "20px";
    block.style.border = "1px solid #ddd";
    block.style.borderRadius = "8px";
    block.style.backgroundColor = "#f9f9f9";

    // Prompt input field
    const promptField = document.createElement("textarea");
    promptField.value = prompt || ""; // Use provided prompt or leave blank
    promptField.placeholder = "What do you want to hear and how should it feel?";
    promptField.style.width = "100%";
    promptField.style.height = "50px";
    promptField.style.marginBottom = "10px";
    promptField.readOnly = !isEditable; // Editable only for the initial block
    block.appendChild(promptField);

    // Generate button
    const generateButton = document.createElement("button");
    generateButton.innerHTML = isEditable ? "Generate Audio" : "Generate Next Audio";
    generateButton.style.display = "block";
    generateButton.style.marginBottom = "10px";
    generateButton.onclick = async function () {
        const userPrompt = promptField.value.trim();
        if (userPrompt) {
            console.log(`${generateButton.innerHTML} button clicked for prompt:`, userPrompt);
            await generateAudio(userPrompt, block);
        } else {
            alert("Please enter a prompt before generating audio.");
        }
    };
    block.appendChild(generateButton);

    // Add block to the container
    container.appendChild(block);
}

// Generate audio and add it to the block
async function generateAudio(prompt, block) {
    console.log("Generating audio for prompt:", prompt);

    const replicateProxy = "https://replicate-api-proxy.glitch.me";
    
    // faster lower quality audio
    let data = {
        version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38", // MusicGen model version ID
        input: {
            prompt: prompt,                      // The user-provided description
            duration: 6,                         // Shorter duration for faster generation
            temperature: 0.8,                    // Slightly reduced for predictable sampling
            top_k: 100,                          // Narrower sampling range for speed
            top_p: 0.1,                          // Slightly broader probability sampling
            continuation: false,                 // No continuation from input audio
            model_version: "stereo-large",       // Specify the MusicGen model
            output_format: "mp3",                // Smaller, faster-to-process format
            continuation_start: 0,               // Default start for continuation
            multi_band_diffusion: false,         // Avoid extra processing steps
            normalization_strategy: "loudness", // Default normalization strategy
            classifier_free_guidance: 2,         // Reduced adherence for speed
            seed: 42                             // Fixed seed for deterministic output
        },
    };

    // // slower higher quality audio
    // let data = {
    //     version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38", // MusicGen model version ID
    //     input: {
    //         prompt: prompt,
    //         duration: 8,
    //         temperature: 1,
    //         top_k: 250,
    //         top_p: 0,
    //         continuation: false,
    //         model_version: "stereo-large",
    //         output_format: "mp3",
    //         continuation_start: 0,
    //         multi_band_diffusion: false,
    //         normalization_strategy: "peak",
    //         classifier_free_guidance: 3,
    //     },
    // };

    try {
        console.log("Sending request to Replicate proxy...");
        const response = await fetch(`${replicateProxy}/create_n_get/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const proxyResponse = await response.json();

        if (!proxyResponse.output) {
            console.error("Unexpected response structure from Replicate:", proxyResponse);
            throw new Error("Invalid response structure from Replicate.");
        }

        const soundUrl = proxyResponse.output; // Correct field for MP3 URL
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
            const interpretation = interpretationField.value.trim();
            if (interpretation) {
                console.log("Next button clicked. New interpretation:", interpretation);
                generateAudio(interpretation, block); // Generate new audio with interpretation
            } else {
                alert("Please provide an interpretation before generating the next audio.");
            }
        };
        block.appendChild(nextButton);

        // Send to Firebase
        const location = { x: 0, y: 0, z: 0 }; // Placeholder location
        sendToFirebase(prompt, location, soundUrl);
    } catch (error) {
        console.error("Error generating audio:", error);
        const errorMessage = document.createElement("p");
        errorMessage.innerHTML = "Error generating audio. Please try again.";
        errorMessage.style.color = "red";
        block.appendChild(errorMessage);
    }
}

// Send data to Firebase
function sendToFirebase(prompt, location, soundUrl) {
    console.log("Sending data to Firebase...");
    console.log({
        prompt: prompt,
        location: location,
        soundUrl: soundUrl,
    });
    // Firebase database integration goes here
}

// Initialize the interface
init();




// let container; // Container for all interactions

// // Initialize the app
// function init() {
//     container = document.createElement("div");
//     container.style.width = "80%";
//     container.style.margin = "0 auto";
//     container.style.fontFamily = "Arial, sans-serif";
//     document.body.appendChild(container);

//     // Create the initial input block
//     createInteractionBlock("What do you want to hear and how should it feel?");
// }

// // Create a new interaction block
// function createInteractionBlock(prompt) {
//     const block = document.createElement("div");
//     block.style.marginBottom = "30px";
//     block.style.padding = "20px";
//     block.style.border = "1px solid #ddd";
//     block.style.borderRadius = "8px";
//     block.style.backgroundColor = "#f9f9f9";

//     // Prompt input field
//     const promptField = document.createElement("textarea");
//     promptField.value = prompt;
//     promptField.style.width = "100%";
//     promptField.style.height = "50px";
//     promptField.style.marginBottom = "10px";
//     block.appendChild(promptField);

//     // Generate button
//     const generateButton = document.createElement("button");
//     generateButton.innerHTML = "Generate Audio";
//     generateButton.style.display = "block";
//     generateButton.style.marginBottom = "10px";
//     generateButton.onclick = async function () {
//         generateAudio(promptField.value, block);
//     };
//     block.appendChild(generateButton);

//     // Add block to the container
//     container.appendChild(block);
// }

// // Generate audio and add it to the block
// async function generateAudio(prompt, block) {
//     const replicateProxy = "https://replicate-api-proxy.glitch.me";
//     let data = {
//         version: "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
//         input: { prompt_a: prompt },
//     };

//     try {
//         // Request sound data from Replicate
//         const response = await fetch(`${replicateProxy}/create_n_get/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data),
//         });

//         const proxyResponse = await response.json();
//         const soundUrl = proxyResponse.output.audio;

//         console.log("Generated sound URL:", soundUrl);

//         // Display audio player
//         const audioPlayer = document.createElement("audio");
//         audioPlayer.src = soundUrl;
//         audioPlayer.controls = true;
//         audioPlayer.style.display = "block";
//         audioPlayer.style.marginBottom = "10px";
//         block.appendChild(audioPlayer);

//         // Add interpretation field
//         const interpretationField = document.createElement("textarea");
//         interpretationField.placeholder = "What did you hear and how did it feel?";
//         interpretationField.style.width = "100%";
//         interpretationField.style.height = "50px";
//         interpretationField.style.marginBottom = "10px";
//         block.appendChild(interpretationField);

//         // Add "Generate Next" button
//         const nextButton = document.createElement("button");
//         nextButton.innerHTML = "Generate Next Audio";
//         nextButton.style.display = "block";
//         nextButton.onclick = function () {
//             createInteractionBlock(interpretationField.value);
//         };
//         block.appendChild(nextButton);

//         // Convert audio to Base64 and send to Firebase
//         const audioResponse = await fetch(soundUrl);
//         const arrayBuffer = await audioResponse.arrayBuffer();
//         const soundBufferb64 = bufferToBase64(arrayBuffer);

//         console.log("Base64-encoded audio buffer:", soundBufferb64);

//         const location = { x: 0, y: 0, z: 0 }; // Placeholder location
//         sendToFirebase(prompt, location, soundUrl, soundBufferb64);
//     } catch (error) {
//         console.error("Error generating audio:", error);
//         const errorMessage = document.createElement("p");
//         errorMessage.innerHTML = "Error generating audio. Please try again.";
//         errorMessage.style.color = "red";
//         block.appendChild(errorMessage);
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
//     console.log("Sending data to Firebase...");
//     console.log({
//         prompt: prompt,
//         location: location,
//         soundUrl: soundUrl,
//         soundBuffer: soundBufferb64,
//     });
//     // Firebase database integration goes here
// }

// // Initialize the interface
// init();
