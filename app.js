const http = require("http");
const url = require("url");

const PORT = 3000;

// Data structure to store dictionary entries
const dictionary = [];
let number_of_requests = 0;
function printDictionary() {
    for (const entry of dictionary) {
        console.log(`Word: ${entry.word}, Definition: ${entry.definition}`);
    }
}
const validateInput = (word, definition) => {
  if (!word || !definition) {
    return false;
  }
  if (typeof word !== "string" || typeof definition !== "string") {
    return false;
  }
  if (/\d/.test(word)) {
    return false;
  }
  return true;
};
// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log("The server received a request!");
  const parsedUrl = url.parse(req.url);
  const pathName = parsedUrl.pathname;
  console.log(pathName);

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
    console.log(pathName)
    let body = "";
    console.log("POOOOOST1");
    req.on("data", (chunk) => {
        console.log("POOOOOST2");

      body += chunk.toString();
    });
    console.log("POOOOOST3");

    req.on("end", () => {
        console.log("POOOOOST4");

      const { word, definition } = JSON.parse(body);

      if (validateInput(word, definition)) {
        console.log("POOOOOST5");

        number_of_requests++;
        dictionary.push({ word, definition });
        printDictionary();
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log("POOOOOST6");
        res.end(
            
          JSON.stringify({
            success: true,
            message: "Definition created successfully!",
          })
        );
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "Invalid input. Word and definition must be non-empty strings.",
          })
        );
      }
    });
  } else if (pathName.includes("/api/definitions") && req.method === "GET") {

    const parsedUrl = url.parse(req.url, true);
    const queryParameters = parsedUrl.query;
    const searchWord = queryParameters.word
    printDictionary()
    console.log("get1");

    let word_and_definition;
    for (const object of dictionary) {
      if (object.word.toLowerCase() === searchWord) {
        word_and_definition = object;
        break; // Once found, exit the loop
      }
    }


    if (word_and_definition) {
      console.log("nice");
      res.writeHead(200, { "Content-Type": "application/json" });
      number_of_requests++;
      res.end(JSON.stringify(word_and_definition));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Word '${searchWord}' not found!` }));
    }
  }
  console.log("The server received a request!22");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
