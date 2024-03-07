const notifier = require("node-notifier");
const fs = require("fs").promises;

const scrapeCurrWebData = require("./src/scrapeCurrWebData");
const readOldDataFile = require("./src/readOldDataFile");
const compareData = require("./src/compareData");

function saveData(currData) {
  try {
    const jsonStr = JSON.stringify(currData, null, 2);
    fs.writeFile("data.json", jsonStr);
    console.log("JSON file has been saved.");
  } catch (err) {
    console.error("An error occurred: ", err);
  }
}

notifier.on("click", function (notifierObject, options, event) {
  console.log("Notification clicked!");
});

notifier.on("close", function (notifierObject, options) {
  console.log("Notification closed!");
});

async function main() {
  const currData = await scrapeCurrWebData();
  const oldData = await readOldDataFile();

  let isSame = true;
  if (currData !== null && oldData !== null) {
    isSame = compareData(currData, oldData);
  } else {
    console.log("Error in getting the data.");
  }

  if (!isSame) {
    saveData(currData);
  }
}

main();
