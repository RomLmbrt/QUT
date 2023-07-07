const fs = require('fs');

const blockData = fs.readFileSync("./file.md");
console.log("" + blockData);
moreWork();


fs.readFile("./file.md", (err,clearData) => {
    if (err) {
        throw (err);
    }
    console.log("" + clearData);
});
moreWork();

function moreWork(){
    console.log("Sometimes it comes first, sometimes not");
}