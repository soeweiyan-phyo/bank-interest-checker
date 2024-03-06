const notifier = require("node-notifier");
const fs = require("fs").promises;

// Table names
const tableNames = [
  "highest promotional savings account rates",
  "highest base savings account rates",
  "highest bonus saving account rates",
];

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

const compareData = (currData, oldData) => {
  // TODO: Make sure tables order in current data is the same

  if (currData.length != oldData.length) {
    console.log("Number of tables has changed.");
    return;
  }

  // For each table
  for (let i = 0; i < currData.length; i++) {
    if (currData[i].length !== oldData[i].length) {
      console.log(`There has been changes in ${tableNames[i]}`);
    }

    // For each row
    for (let j = 0; j < currData[i].length; j++) {
      // Compare current and new rows
      if (!compareRows(currData[i][j], oldData[i][j], i, j)) {
        return;
      }
    }
  }

  console.log("There have been no changes in the data.");
  notifier.notify({
    title: "Bank Interest Rate Checker",
    message: "There have been no changes in the interest rate.",
    sound: true,
  });
};

module.exports = compareData;
