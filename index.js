const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
var sslRedirect = require("heroku-ssl-redirect");
var fetch = require("node-fetch");

const PORT = process.env.PORT || 5000;

var app = express();
app.use(sslRedirect());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
// Makes sure async functions will throw errors
process.on("unhandledRejection", function(reason) {
	throw reason;
});

// Set routes
app.get("/service-worker.js", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./public/", "service-worker.js"));
});

app.get("/messages", (req, res) => {
	fetch(
		" http://message-list.appspot.com/messages?limit=" +
			req.query.limit +
			"&pageToken=" +
			req.query.pageToken
	)
		.then(res => res.json())
		.then(json => res.send(json));
});

app.get("*", function(request, response) {
	response.sendFile(path.resolve(__dirname, "./public/", "index.html"));
});
var server = app.listen(PORT, () => {
	console.log(
		`	console.log(path.resolve(__dirname, "..", "service-worker.js  __"`
	);
	console.log(path.resolve(__dirname, "./public/", "service-worker.js"));
	console.log(`Really Listening on ${PORT}`);
});
