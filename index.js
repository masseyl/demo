const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
var sslRedirect = require("heroku-ssl-redirect");
const stripe = require("stripe")(process.env.SRTIPE);

const PORT = process.env.PORT || 5000;

var app = express();
app.use(sslRedirect());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "100mb" }));

// Makes sure async functions will throw errors
process.on("unhandledRejection", function(reason) {
	throw reason;
});

// Set routes
require("./stuff/routes")(app);
app.get("/service-worker.js", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./public/", "service-worker.js"));
});

app.get("*", function(request, response) {
	response.sendFile(path.resolve(__dirname, "./public/", "index.html"));
});
var server = app.listen(PORT, () => {
	console.log(
		`	console.log(path.resolve(__dirname, "..", "service-worker.js  __"`
	);
	console.log(path.resolve(__dirname, "./public/", "service-worker.js"));
	console.log(`DAWG: Really Listening on ${PORT}`);
});
