const notifier = require("node-notifier");
const fs = require("fs").promises;

const scrapeCurrWebData = require("./scrapeCurrWebData");
const readOldDataFile = require("./readOldDataFile");
const compareData = require("./compareData");

async function saveDataToFile() {
  try {
    const savingsRateData = await scrapeWebsite();
    const jsonStr = JSON.stringify(savingsRateData, null, 2);

    await fs.writeFile("data.json", jsonStr);
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

  if (currData !== null && oldData !== null) {
    compareData(currData, oldData);
  } else {
    console.log("Error in getting the data.");
  }
}

main();
