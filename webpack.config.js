let path = require("path")

module.exports = {
    entry: [
        "./src/enums",
        "./src/utils",
        "./src/renderable",
        "./src/layer",
        "./src/links",
        "./src/cortical-column",
        "./src/htm-network",
        "./src/highbrow"
    ],
    module: {
        loaders: [
            { test: path.join(__dirname, "src"),
              loader: "babel-loader" }
        ]
    },
    output: {
        path: __dirname + "/bin",
        filename: "highbrow.bundle.js"
    }
};
