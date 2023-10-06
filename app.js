const http = require("http");
const url = require("url");

const PORT = 3000;

// Data structure to store dictionary entries
const dictionary = [];
let number_of_requests = 0;

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

  if (pathName === "/store" && req.method === "POST") {
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
  } else if (pathName.startsWith("/search/") && req.method === "GET") {
    const searchWord = pathName.slice("/search/".length).toLowerCase();

    // const definition = dictionary.find(
    //   (Object) => Object.word.toLowerCase() === searchWord
    // );

    let definition;
    let word;
    for (const object of dictionary) {
      if (object.word.toLowerCase() === searchWord) {
        definition = object.definition;
        word = object.word;
        break; // Once found, exit the loop
      }
    }

    if (searchWord in dictionary) {
      const definition = dictionary[searchWord];
      res.writeHead(200, { "Content-Type": "application/json" });
      number_of_requests++;
      res.end(JSON.stringify(definition));
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
