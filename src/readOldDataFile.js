const fs = require("fs").promises;

const readOldDataFile = async () => {
  try {
    const data = await fs.readFile("data.json", "utf8");
    const parsedData = await JSON.parse(data);
    return parsedData;
  } catch (err) {
    console.error("Error reading or parsing file: ", error);
    throw err;
  }
};

module.exports = readOldDataFile;
