const fs = require("fs");
const data = fs.readFileSync("./dist/routes.js", { encoding: "utf8" }).replace(".catch((error) => next(error));", ".catch((error) => {if(error && !error.code){error = {code:520, message:error.message};}; if(error && error.extraData){error.extraData = undefined;};response.status(error.code || 520).json(error) });")
fs.writeFileSync("./dist/routes.js", data, { encoding: "utf8" });
