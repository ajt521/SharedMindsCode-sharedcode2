const replicateProxy = "https://replicate-api-proxy.glitch.me";

let words = [];
let vocabulary = [
  "aardvark", "albatross", "alligator", "alpaca", "ant", "anteater", "antelope",
  "ape", "armadillo", "donkey", "baboon", "badger", "barracuda", "bat", "bear",
  "beaver", "bee", "bison", "boar", "buffalo", "butterfly", "camel", "capybara",
  "caribou", "cassowary", "cat", "caterpillar", "cattle", "chamois", "cheetah",
  "chicken", "chimpanzee", "chinchilla", "chough", "clam", "cobra", "cockroach",
  "cod", "cormorant", "coyote", "crab", "crane", "crocodile", "crow", "deer",
  "dinosaur", "dog", "dogfish", "dolphin", "donkey", "dotterel", "dove", "dragonfly",
  "duck", "dugong", "dunlin", "eagle", "echidna", "eel", "eland", "elephant",
  "elk", "emu", "falcon", "ferret", "finch", "fish", "flamingo", "fly", "fox",
  "frog", "gaur", "gazelle", "gerbil", "giant panda", "giraffe", "gnat", "gnu",
  "goat", "goldfinch", "goldfish", "goose", "gorilla", "goshawk", "grasshopper",
  "grouse", "guanaco", "gull", "hamster", "hare", "hawk", "hedgehog", "heron",
  "herring", "hippopotamus", "hornet", "horse", "human", "hummingbird", "hyena",
  "ibex", "ibis", "jackal", "jaguar", "jellyfish", "kangaroo", "kingfisher",
  "koala", "kookaburra", "kouprey", "kudu", "lapwing", "lark", "lemur", "leopard",
  "lion", "llama", "lobster", "locust", "loris", "louse", "lyrebird", "magpie",
  "mallard", "manatee", "mandrill", "mantis", "marten", "meerkat", "mink",
  "mole", "mongoose", "monkey", "moose", "mosquito", "mouse", "mule", "narwhal",
  "newt", "nightingale", "octopus", "okapi", "opossum", "oryx", "ostrich", "otter",
  "owl", "ox", "oyster", "panther", "parrot", "partridge", "peafowl", "pelican",
  "penguin", "pheasant", "pig", "pigeon", "polar bear", "pony", "porcupine",
  "porpoise", "quail", "quelea", "quetzal", "rabbit", "raccoon", "rail", "ram",
  "rat", "raven", "red deer", "red panda", "reindeer", "rhinoceros", "rook",
  "salamander", "salmon", "sand dollar", "sandpiper", "sardine", "scorpion",
  "sea lion", "sea urchin", "seahorse", "seal", "shark", "sheep", "shrew",
  "skunk", "snail", "snake", "sparrow", "spider", "spoonbill", "squid", "squirrel",
  "starling", "stingray", "stinkbug", "stork", "swallow", "swan", "tapir",
  "tarsier", "termite", "tiger", "toad", "trout", "turkey", "turtle", "viper",
  "vulture", "wallaby", "walrus", "wasp", "weasel", "whale", "wildcat", "wolf",
  "wolverine", "wombat", "woodcock", "woodpecker", "worm", "wren", "yak", "zebra"
];
let vocabularyEmbeddings = [];
let randomProjectionVector = []; // To store the random vector for projection
let minProj, maxProj; // To store min and max scalar projections

function setup() {
  createCanvas(windowWidth, 600); // Canvas adjusts to window size
  let input_field = createInput("sheep, camel, slug");
  input_field.size(550);

  let button = createButton("Ask");
  button.mousePressed(() => {
    askForEmbeddings(input_field.value());
  });
  textSize(12); // Adjust text size as needed

  // Fetch embeddings for the vocabulary
  getEmbeddings(vocabulary).then((embeddings) => {
    vocabularyEmbeddings = embeddings;
    console.log("Vocabulary embeddings loaded.");
  });
}

function draw() {
  background(255);

  // Draw a horizontal line
  stroke(0);
  line(50, height / 2, width - 50, height / 2);

  // Draw the words
  noStroke();
  fill(0);
  textAlign(CENTER);

  let minDistance = 60; // Minimum horizontal distance between words
  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // Adjust y position to avoid overlap
    if (i > 0 && abs(word.x - words[i - 1].x) < minDistance) {
      // Alternate positions above and below the line
      word.y = words[i - 1].y === height / 2 - 20 ? height / 2 + 20 : height / 2 - 20;
    } else {
      word.y = height / 2 - 20; // Default position above the line
    }

    text(word.phrase, word.x, word.y);
  }
}

async function askForEmbeddings(p_prompt) {
  let phrases = p_prompt.split(",").map((s) => s.trim());
  let embeddingsOutput = await getEmbeddings(phrases);

  words = [];

  // Get the dimension of the embeddings
  let embeddingDim = embeddingsOutput[0].embedding.length;

  // Generate a random vector of the same dimension for projection
  randomProjectionVector = [];
  for (let i = 0; i < embeddingDim; i++) {
    randomProjectionVector.push(Math.random());
  }

  // Compute scalar projections for each embedding
  let scalarProjections = [];
  for (let i = 0; i < embeddingsOutput.length; i++) {
    let embedding = embeddingsOutput[i].embedding;
    let dotProd = dotProduct(embedding, randomProjectionVector);
    scalarProjections.push(dotProd);
  }

  // Get min and max of scalar projections
  minProj = Math.min(...scalarProjections);
  maxProj = Math.max(...scalarProjections);

  // Assign positions to words based on scalar projections
  let startX = 50;
  let endX = width - 50;

  for (let i = 0; i < embeddingsOutput.length; i++) {
    let scalarValue = scalarProjections[i];
    let x = map(scalarValue, minProj, maxProj, startX, endX);
    let phrase = embeddingsOutput[i].input.trim();
    let embedding = embeddingsOutput[i].embedding;
    words.push({ phrase: phrase, embedding: embedding, x: x, y: height / 2 });
  }

  // Sort words by x positions
  words.sort((a, b) => a.x - b.x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  recalculatePositions();
}

function recalculatePositions() {
  let startX = 50;
  let endX = width - 50;

  for (let i = 0; i < words.length; i++) {
    let embedding = words[i].embedding;
    let scalarValue = dotProduct(embedding, randomProjectionVector);
    let x = map(scalarValue, minProj, maxProj, startX, endX);
    words[i].x = x;
  }

  // Sort words by x positions
  words.sort((a, b) => a.x - b.x);
}

function mousePressed() {
  // Check if mouseY is near the line (within a threshold)
  if (abs(mouseY - height / 2) < 30) {
    // Loop through words to find between which two words the mouseX lies
    for (let i = 0; i < words.length - 1; i++) {
      let wordA = words[i];
      let wordB = words[i + 1];

      if (mouseX >= wordA.x && mouseX <= wordB.x) {
        console.log("Clicked between:", wordA.phrase, "and", wordB.phrase);

        // Calculate interpolation factor t
        let t = (mouseX - wordA.x) / (wordB.x - wordA.x);

        // Interpolate embeddings
        let interpEmbedding = [];
        for (let j = 0; j < wordA.embedding.length; j++) {
          interpEmbedding[j] =
            wordA.embedding[j] * (1 - t) + wordB.embedding[j] * t;
        }

        // Exclude all words already displayed
        let excludeWords = words.map((w) => w.phrase);

        // Find the nearest word in vocabulary excluding displayed words
        let nearestWord = findNearestWord(interpEmbedding, excludeWords);

        if (nearestWord) {
          console.log("Nearest Word:", nearestWord.word);

          // Add the new word to the words array
          let newWord = {
            phrase: nearestWord.word,
            embedding: nearestWord.embedding,
            x: mouseX,
            y: height / 2,
          };
          words.push(newWord);

          // Sort words by x positions
          words.sort((a, b) => a.x - b.x);
        } else {
          console.log("No new words to add.");
        }

        break; // Stop after handling one pair
      }
    }
  }
}

function findNearestWord(targetEmbedding, excludeWords) {
  let maxSimilarity = -Infinity;
  let nearestWord = null;
  for (let i = 0; i < vocabularyEmbeddings.length; i++) {
    let vocabWord = vocabularyEmbeddings[i].input.trim();

    // Exclude words that are in the excludeWords list
    if (excludeWords.includes(vocabWord)) {
      continue; // Skip this word
    }

    let vocabEmbedding = vocabularyEmbeddings[i].embedding;
    let similarity = cosineSimilarity(targetEmbedding, vocabEmbedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      nearestWord = {
        word: vocabWord,
        embedding: vocabEmbedding,
      };
    }
  }
  return nearestWord;
}

async function getEmbeddings(wordsArray) {
  // Process words in batches to handle large vocabularies
  let batchSize = 50;
  let allOutputs = [];

  for (let i = 0; i < wordsArray.length; i += batchSize) {
    let batch = wordsArray.slice(i, i + batchSize);
    let promptInLines = batch.join("\n");
    let data = {
      version:
        "75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
      input: {
        inputs: promptInLines,
      },
    };
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/";
    const raw = await fetch(url, options);
    const proxy_said = await raw.json();
    allOutputs = allOutputs.concat(proxy_said.output);
  }
  return allOutputs;
}

function cosineSimilarity(vecA, vecB) {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

function dotProduct(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}
