import { UMAP } from "https://cdn.skypack.dev/umap-js";

// Create the canvas and set up the context
let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
document.body.append(canvas);
let ctx = canvas.getContext('2d');

// Animal library (replace this with your full list of 1000 animal names)
const animalLibrary = [
    "Aardvark", "Albatross", "Alligator", "Ant", "Anteater", "Antelope", "Ape",
    "Armadillo", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Bison",
    "Boar", "Buffalo", "Butterfly", "Camel", "Caribou", "Cat", "Caterpillar",
    "Cattle", "Chameleon", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla",
    "Clam", "Cobra", "Cockroach", "Cod", "Cormorant", "Coyote", "Crab", "Crane",
    "Crocodile", "Crow", "Deer", "Dinosaur", "Dog", "Dolphin", "Donkey", "Dove",
    "Dragonfly", "Duck", "Eagle", "Eel", "Elephant", "Elk", "Emu", "Falcon",
    "Ferret", "Finch", "Firefly", "Fish", "Flamingo", "Flea", "Fly", "Fox",
    "Frog", "Gazelle", "Gecko", "Gerbil", "Giraffe", "Goat", "Goldfish", "Goose",
    "Gorilla", "Grasshopper", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog",
    "Heron", "Hippopotamus", "Hornet", "Horse", "Human", "Hummingbird", "Hyena",
    "Iguana", "Impala", "Jackal", "Jaguar", "Jellyfish", "Kangaroo", "Kingfisher",
    "Koala", "Koi", "Komodo dragon", "Krill", "Ladybug", "Lamprey", "Leopard",
    "Limpet", "Lion", "Lizard", "Llama", "Lobster", "Locust", "Lynx", "Macaw",
    "Mackerel", "Magpie", "Manatee", "Mandrill", "Manta ray", "Marmoset", "Marmot",
    "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Mouse",
    "Mule", "Narwhal", "Newt", "Nightingale", "Octopus", "Okapi", "Opossum",
    "Orangutan", "Ostrich", "Otter", "Owl", "Ox", "Oyster", "Panda", "Panther",
    "Parrot", "Partridge", "Peacock", "Pelican", "Penguin", "Pheasant", "Pig",
    "Pigeon", "Pike", "Platypus", "Porcupine", "Porpoise", "Possum", "Prawn",
    "Praying mantis", "Puffin", "Puma", "Quail", "Quelea", "Rabbit", "Raccoon",
    "Rat", "Raven", "Reindeer", "Rhinoceros", "Roadrunner", "Rooster", "Salamander",
    "Salmon", "Scorpion", "Sea lion", "Seahorse", "Seal", "Shark", "Sheep",
    "Shrew", "Shrimp", "Silkworm", "Skink", "Skunk", "Sloth", "Slug", "Snail",
    "Snake", "Snipe", "Snow leopard", "Sockeye salmon", "Sole", "Sparrow",
    "Spider", "Spoonbill", "Squid", "Squirrel", "Starfish", "Stingray", "Stork",
    "Swallow", "Swan", "Tapir", "Tarantula", "Tiger", "Toad", "Trout", "Turkey",
    "Turtle", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Weasel", "Whale",
    "Whippet", "Whitefish", "Whooping crane", "Wildcat", "Wildebeest", "Wildfowl",
    "Wolf", "Wolverine", "Wombat", "Woodpecker", "Worm", "Wren", "Yak", "Zebra",
    // Additional animals to extend the list
    "Addax", "Alpaca", "Anchovy", "Anemone", "Angelfish", "Anole", "Antechinus",
    "Archerfish", "Arctic hare", "Arctic tern", "Arctic wolf", "Auk", "Avocet",
    "Axolotl", "Babirusa", "Bactrian camel", "Baleen whale", "Bandicoot",
    "Barbel", "Barn owl", "Barnacle", "Barramundi", "Basilisk", "Batfish",
    "Bee-eater", "Beetle", "Binturong", "Bittern", "Blackbird", "Blowfish",
    "Bluebird", "Bobcat", "Bobolink", "Bonito", "Bonobo", "Boomslang", "Bream",
    "Brolga", "Budgerigar", "Bull", "Bullfrog", "Bumblebee", "Bunting", "Bustard",
    "Buzzard", "Caecilian", "Capuchin", "Capybara", "Caracal", "Carp", "Cassowary",
    "Caterpillar", "Cavy", "Centipede", "Chamois", "Chevrotain", "Cicada",
    "Clouded leopard", "Coati", "Cockatoo", "Coelacanth", "Collared peccary",
    "Colobus", "Conch", "Coot", "Cuttlefish", "Dachshund", "Darter", "Dhole",
    "Dik-dik", "Dingo", "Dugong", "Dusky dolphin", "Echidna", "Eft", "Egret",
    "Elephant shrew", "Elver", "Emperor penguin", "Emu", "Epaulette shark",
    "Ermine", "Eulachon", "Falcon", "Fantail", "Fieldfare", "Finch", "Fisher",
    "Fossa", "Frigatebird", "Fugu", "Fulmar", "Galago", "Gannet", "Gaur", "Genet",
    "Gibbon", "Giraffe weevil", "Glass lizard", "Glowworm", "Gnu", "Goby", "Gopher",
    "Grebe", "Grison", "Grouper", "Grouse", "Guereza", "Guinea fowl", "Gull",
    "Guppy", "Haddock", "Hagfish", "Hawk moth", "Hawkfish", "Hedgehog", "Hen",
    "Hoatzin", "Hog", "Hoopoe", "Hornbill", "Horned lizard", "Horsefly",
    "House martin", "Howler monkey", "Humuhumunukunukuapua'a", "Hyrax", "Ibis",
    "Inca tern", "Indian elephant", "Indri", "Insect", "Jackdaw", "Jaeger",
    "Japanese macaque", "Javelina", "Jay", "Jellyfish", "Jerboa", "Junco",
    "Kakapo", "Kea", "Kestrel", "Kildeer", "Kinkajou", "Kite", "Kiwi", "Koel",
    "Kookaburra", "Kudu", "Lamprey", "Lark", "Leech", "Lemming", "Lemur",
    "Limpkin", "Linsang", "Lionfish", "Little owl", "Lizard", "Llama", "Lobster",
    "Locust", "Loris", "Lovebird", "Lungfish", "Macaque", "Mallard", "Manta",
    "Marmoset", "Marten", "Meadowlark", "Megalodon", "Mink", "Mockingbird",
    "Mole", "Mongoose", "Monitor", "Monkey", "Moose", "Moth", "Mouse", "Mule",
    "Musk ox", "Nandu", "Narwhal", "Needlefish", "Newt", "Night heron", "Numbat",
    "Ocelot", "Octopus", "Okapi", "Old world monkey", "Opossum", "Orangutan",
    "Orca", "Ostrich", "Otter", "Owl", "Ox", "Oyster", "Paca", "Paddlefish",
    "Panther", "Parrot", "Partridge", "Peacock", "Penguin", "Perch", "Petrel",
    "Pigeon", "Pika", "Pilot whale", "Pinniped", "Piranha", "Plaice", "Platypus",
    "Polecat", "Porcupine", "Porpoise", "Prairie dog", "Praying mantis",
    "Proboscis monkey", "Ptarmigan", "Puffin", "Puma", "Pygmy marmoset",
    "Python", "Quail", "Quokka", "Quoll", "Rabbit", "Raccoon", "Rat", "Raven",
    "Ray", "Red panda", "Reef shark", "Reindeer", "Rhea", "Rhino", "Ringtail",
    "Roach", "Robin", "Rook", "Rottweiler", "Rudd", "Ruffed lemur", "Sailfish",
    "Salamander", "Sand dollar", "Sawfish", "Scorpion", "Scorpionfish",
    "Seahorse", "Seal", "Serval", "Shark", "Sheep", "Shrew", "Shrike", "Silkworm",
    "Sirenian", "Skate", "Skunk", "Sloth", "Slug", "Snail", "Snake", "Snipe",
    "Snow goose", "Sparrow", "Spider", "Spider crab", "Spoonbill", "Squid",
    "Squirrel", "Starfish", "Stickleback", "Stilt", "Stingray", "Stoat", "Stork",
    "Sunbird", "Swallow", "Swan", "Tamarin", "Tanager", "Tapir", "Tarantula",
    "Tarsier", "Termite", "Terrapin", "Thrush", "Tick", "Tiger", "Tiger shark",
    "Toad", "Tomtit", "Tortoise", "Toucan", "Trevalla", "Trout", "Turkey",
    "Turtle", "Unicornfish", "Urchin", "Vicuna", "Viper", "Vireo", "Vole",
    "Vulture", "Wallaby", "Walrus", "Wapiti", "Warthog", "Wasp", "Waxwing",
    "Weasel", "Whale", "Whimbrel", "Whitebait", "White-eye", "Wildcat", "Wildebeest",
    "Wolf", "Wolverine", "Wombat", "Woodlouse", "Woodpecker", "Worm", "Wren",
    "Xerus", "Xoloitzcuintli", "X-ray tetra", "Yak", "Yellowhammer", "Zebra",
    "Zebra shark", "Zebu", "Zorilla"
  ];

  let fittedEmbeddings = []; // Global variable for embeddings

  let inputField = document.createElement('input');
  inputField.type = "text";
  inputField.style.position = "absolute";
  inputField.style.left = "50%";
  inputField.style.top = "90%";
  inputField.style.transform = "translate(-50%, -50%)";
  inputField.style.width = "350px";
  inputField.placeholder = "Enter words separated by commas";
  document.body.append(inputField);
  
  inputField.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
          let words = inputField.value.split(",").map(word => word.trim());
          generateEmbeddings(words);
      }
  });
  
  function generateEmbeddings(userWords) {
      let validWords = [];
      let embeddings = animalLibrary.map(() => [Math.random(), Math.random()]);
      userWords.forEach(word => {
          if (animalLibrary.includes(word)) {
              validWords.push(word);
          } else {
              animalLibrary.push(word);
              embeddings.push([Math.random(), Math.random()]);
              validWords.push(word);
          }
      });
      embeddings = animalLibrary.map(() => [Math.random(), Math.random()]);
      if (validWords.length > 0) runUMAP(validWords, embeddings);
  }
  
  function runUMAP(userWords, embeddings) {
      let umap = new UMAP({ nNeighbors: Math.min(6, embeddings.length), minDist: 0.5, nComponents: 2 });
      fittedEmbeddings = umap.fit(embeddings); // Store globally
      fittedEmbeddings = normalize(fittedEmbeddings);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let borderMargin = 50;
      animalLibrary.forEach((animal, index) => {
          if (userWords.includes(animal)) {
              placeWord(animal, fittedEmbeddings[index], borderMargin);
          }
      });
  }
  
  function placeWord(word, position, margin) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      let x = position[0] * (canvas.width - 2 * margin) + margin;
      let y = position[1] * (canvas.height - 2 * margin) + margin;
      ctx.fillText(word, x, y);
  }
  
  function normalize(array) {
      let max = [Number.MIN_VALUE, Number.MIN_VALUE];
      let min = [Number.MAX_VALUE, Number.MAX_VALUE];
      array.forEach(point => {
          max[0] = Math.max(max[0], point[0]);
          max[1] = Math.max(max[1], point[1]);
          min[0] = Math.min(min[0], point[0]);
          min[1] = Math.min(min[1], point[1]);
      });
      return array.map(point => [
          (point[0] - min[0]) / (max[0] - min[0]),
          (point[1] - min[1]) / (max[1] - min[1])
      ]);
  }
  
  canvas.addEventListener("click", (event) => {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let closestAnimal = findClosestAnimal(mouseX, mouseY);
      if (closestAnimal) displayAnimal(closestAnimal.name, mouseX, mouseY);
  });
  
  function findClosestAnimal(x, y) {
      let closestIndex = -1;
      let closestDistance = Infinity;
      fittedEmbeddings.forEach((position, index) => {
          let embeddingX = position[0] * canvas.width;
          let embeddingY = position[1] * canvas.height;
          let distance = Math.hypot(x - embeddingX, y - embeddingY);
          if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
          }
      });
      return closestIndex !== -1 ? { name: animalLibrary[closestIndex], index: closestIndex } : null;
  }
  
  function displayAnimal(name, x, y) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "blue";
      ctx.fillText(name, x, y);
  }