const http = require("http");
const url = require("url");

const PORT = 3000;

// Data structure to store dictionary entries
const dictionary = [];
let number_of_requests = 0;


const validateInput = (word, definition) => {
    // Check if either word or definition is missing
  if (!word || !definition) {
    return false;
  }
    // Check if both word and definition are strings
  if (typeof word !== "string" || typeof definition !== "string") {
    return false;
  }
    // Check if the word contains any digits
  if (/\d/.test(word)) {
    return false;
  }
    // If all checks pass, return true
  return true;
};

function handleExistingEntry(res, word) {
  // Entry already exists, send a warning response
  res.writeHead(400, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      success: false,
      message: `Error!! '${word}' already exists. Word not saved!`,
      requests: number_of_requests,
      dictionary_length: dictionary.length,
    })
  );
}

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log("The server received a request!");
  const parsedUrl = url.parse(req.url); 
  const pathName = parsedUrl.pathname;

  // Enable CORS (Cross-Origin Resource Sharing) for all routes
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request, respond successfully
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathName === "/api/definitions" && req.method === "POST") {
    number_of_requests++;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    console.log(number_of_requests);
    req.on("end", () => {
      const { word, definition } = JSON.parse(body);

      if (validateInput(word, definition)) {
        const existingEntry = dictionary.find((entry) => entry.word === word);
        if (existingEntry) {
          // Call the function to handle existing entry
          handleExistingEntry(res, word);
        } else {
          dictionary.push({ word, definition });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: `Word: \"${word}\" and definition: "${definition} created successfully!`,
              requests: number_of_requests,
              dictionary_length: dictionary.length,
            })
          );
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message:
              "Invalid input. Word and definition must be non-empty strings.",
            requests: number_of_requests,
            dictionary_length: dictionary.length,
          })
        );
      }
    });
  } else if (pathName.includes("/api/definitions") && req.method === "GET") {
    number_of_requests++;

    const parsedUrl = url.parse(req.url, true);
    const searchWord = parsedUrl.query.word;

    const word_and_definition = dictionary.find((object) => object.word === searchWord);


    if (word_and_definition) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message:  `Word '${searchWord}' found!`,
          definition: word_and_definition.definition,
          requests: number_of_requests,
          dictionary_length: dictionary.length,
        })
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message:
           `Word '${searchWord}' not found!`,
          requests: number_of_requests,
          dictionary_length: dictionary.length,
        })
      );
    }
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
