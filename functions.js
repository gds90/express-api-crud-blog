const fs = require('fs');
const path = require('path');

const readJSON = (fileName) => {
    const filePath = path.join(__dirname, fileName + '.json');
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
}

const writeJSON = (fileName, data) => {
    const filePath = path.join(__dirname, fileName + '.json');
    const fileData = JSON.stringify(data);
    fs.writeFileSync(filePath, fileData);
}

module.exports = {
    writeJSON,
    readJSON
}