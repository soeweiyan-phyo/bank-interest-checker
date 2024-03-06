const fs = require("fs").promises;

async function parseJsonFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing file:", error);
    throw error; // Propagate the error
  }
}

// Example usage
(async () => {
  try {
    const filePath = "data.json";
    const parsedData = await parseJsonFromFile(filePath);
    console.log(parsedData);
  } catch (error) {
    console.error("Error:", error);
  }
})();
