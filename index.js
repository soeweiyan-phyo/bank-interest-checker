const { read } = require("fs");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;

// Best banks' interests comparison website
const url =
  "https://www.canstar.com.au/savings-accounts/best-savings-account-interest-rates/";

// Table names
const tableNames = [
  "highest promotional savings account rates",
  "highest base savings account rates",
  "highest bonus saving account rates",
];

// Current interest rate data
var currSavingsRateData = [];

async function scrapeWebsite() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const grabTables = await page.evaluate(() => {
    // Helper function
    function toCamelCase(str) {
      // Replace special characters with a space and trim excess spaces
      str = str
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => {
          if (char === "\\n") return " ";
          if (char === "\\t") return " ";
          return " " + char.toUpperCase();
        })
        .trim();

      // Split the string into an array of words
      let words = str.split(" ");

      // Convert the first word to lowercase
      let camelCaseString = words[0].toLowerCase();

      // Loop through the remaining words and capitalize the first letter
      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        camelCaseString +=
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      return camelCaseString;
    }

    // Don's need the fourth table
    const usefulTables = 3;
    let savingsRateData = [];

    const tableTags = document.querySelectorAll(
      "div.table-responsive table tbody"
    );

    // For each table
    for (let i = 0; i < usefulTables; i++) {
      let tempTableData = [];

      // Extract features and convert to camelCase
      // table -> tr -> th.innerText
      let features = tableTags[i].children[0].innerText.split("\t");
      for (let j = 0; j < features.length; j++) {
        features[j] = toCamelCase(features[j]);
      }

      // Extract table data
      // For each rows
      for (let j = 1; j < tableTags[i].children.length; j++) {
        let tempObj = {};

        // For each columns
        for (let k = 0; k < features.length; k++) {
          // table -> tr -> td.innerText
          tempObj[features[k]] = tableTags[i].children[j].children[k].innerText
            .replace(/\+/g, "")
            .replace(/\n/g, " ")
            .trim();
        }

        // Store each table data
        tempTableData.push(tempObj);
      }

      // Store all tables data
      savingsRateData.push(tempTableData);
    }

    return savingsRateData;
  });

  // console.log(grabTables);
  await browser.close();

  return grabTables;
}

async function saveCurrentData() {
  const currData = await scrapeWebsite();

  if (currData) {
    currSavingsRateData = currData;
  } else {
    console.log("There is an error saving current data.");
  }
  // console.log(currSavingsRateData);
}

async function readJSONFile() {
  try {
    const data = await fs.readFile("data.json", "utf8");
    const parsedData = await JSON.parse(data);
    return parsedData;
  } catch (err) {
    console.error("Error reading or parsing file: ", error);
    throw error;
  }
}

function compareRows(newRow, oldRow, i, j) {
  // Get keys for row objects
  const newKeys = Object.keys(newRow);
  const oldKeys = Object.keys(oldRow);

  if (newKeys.length !== oldKeys.length) {
    console.log(`There has been changes in ${tableNames[i]}`);
    return false;
  }

  // Compare keys and values
  for (let key of newKeys) {
    if (!oldRow.hasOwnProperty(key)) {
      console.log(`There has been changes in ${tableNames[i]}`);
      return false;
    }

    if (newRow[key] !== oldRow[key]) {
      console.log(`There has been changes in ${tableNames[i]}`);
      return false;
    }
  }

  return true;
}

async function compareData() {
  try {
    await saveCurrentData();
    const oldData = await readJSONFile();

    // TODO: Make sure tables order in current data is the same

    if (currSavingsRateData.length != oldData.length) {
      console.log("Number of tables has changed.");
      return;
    }

    // For each table
    for (let i = 0; i < currSavingsRateData.length; i++) {
      if (currSavingsRateData[i].length !== oldData[i].length) {
        console.log(`There has been changes in ${tableNames[i]}`);
      }

      // For each row
      for (let j = 0; j < currSavingsRateData[i].length; j++) {
        // Compare current and new rows
        if (!compareRows(currSavingsRateData[i][j], oldData[i][j], i, j)) {
          return;
        }
      }
    }

    console.log("There have been no changes in the data.");
  } catch (err) {
    console.error("Error: ", err);
  }
}

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

function main() {
  compareData();
}

main();
