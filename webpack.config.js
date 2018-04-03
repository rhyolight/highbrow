"use strict";
let path = require("path")
let fs = require("fs")

let pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
)
let version = pkg.version

module.exports = {
    entry: [
        "./src/enums",
        "./src/utils",
        "./src/renderable",
        "./src/layer",
        "./src/links",
        "./src/cortical-column",
        "./src/htm-network",
        "./src/lowbrow"
    ],
    module: {
        rules: [
            { test: path.join(__dirname, "src"),
              loader: "babel-loader" }
        ]
    },
    output: {
        path: __dirname + "/out",
        filename: `lowbrow-${version}.min.js`
    }
};
