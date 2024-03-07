const notifier = require("node-notifier");
const fs = require("fs").promises;

// Table names
const tableNames = [
  "highest promotional savings account rates",
  "highest base savings account rates",
  "highest bonus saving account rates",
];

// Best banks' interests comparison website
const url =
  "https://www.canstar.com.au/savings-accounts/best-savings-account-interest-rates/";

var changedTable = [];

function notifyUser(isSame, message) {
  let finalMsg = "";

  if (!isSame && message === "") {
    finalMsg += "There had been changes in the table(s): [";
    for (let table of changedTable) {
      finalMsg += `${tableNames[table]}, `;
    }
    finalMsg += `]. Go to the website to see the changes: ${url}`;
  } else {
    finalMsg = message;
  }

  console.log(finalMsg);
  notifier.notify({
    title: "Bank Interest Rate Checker",
    message: finalMsg,
    sound: true,
    wait: true,
  });
}

function compareRows(newRow, oldRow, i, j) {
  // Get keys for row objects
  const newKeys = Object.keys(newRow);
  const oldKeys = Object.keys(oldRow);

  if (newKeys.length !== oldKeys.length) {
    changedTable.push(i);
    return false;
  }

  // Compare keys and values
  for (let key of newKeys) {
    if (!oldRow.hasOwnProperty(key)) {
      changedTable.push(i);
      return false;
    }

    if (newRow[key] !== oldRow[key]) {
      changedTable.push(i);
      return false;
    }
  }

  return true;
}

const compareData = (currData, oldData) => {
  // TODO: Make sure tables order in current data is the same
  let isSame = true;

  if (currData.length != oldData.length) {
    notifyUser(false, "The number of tables had changed.");
    return;
  }

  // For each table
  for (let i = 0; i < currData.length; i++) {
    if (currData[i].length !== oldData[i].length) {
      isSame = false;
      changedTable.push(i);
      break;
    }

    // For each row
    for (let j = 0; j < currData[i].length; j++) {
      // Compare current and new rows
      if (!compareRows(currData[i][j], oldData[i][j], i, j)) {
        isSame = false;
        break;
      }
    }
  }

  const msg = isSame ? "There are no changes in the interest rates." : "";
  notifyUser(isSame, msg);

  return isSame;
};

module.exports = compareData;
