const path = require("path");
const sourceBase = "./src";
const outputBase = "./build";

const rules = [
	{
		test: /\.ts?/,
		exclude: /node_modules/,
		loader: "babel-loader",
	},
];

module.exports = {
	entry: `./src/index.ts`,
	output: {
		path: path.join(__dirname, `${outputBase}/js`),
		filename: "index.js",
    },
    module: {
        rules: rules
    },
    resolve: { extensions: ['.ts', '.tsx', '.js'] }
};
