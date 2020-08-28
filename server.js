require("dotenv").config();

const express = require("express");

const mongo = require("mongodb");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
	extended: true
});

const multer = require("multer");

const app = express();

const session = require("express-session");

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.get("/", renderHome);
app.get("/login", renderLogin)
app.get("/register", renderRegister);
app.get("/profile", renderProfile);
app.post("/postLogin", postLogin);
app.post("/postRegister", createUser);
app.post("/signout", signOut);

let db = null;

const url = process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, (err, client) => {
	if (err) {
		console.log("Error, database connection failed");
	} else {
		console.log("database connection succeeded");
	}
	db = client.db(process.env.DB_NAME);
});

function renderHome(req, res) {
	if (!req.session.user) {
		res.redirect("/login");
	} else {
		res.render("home.ejs", {
			data: req.session.user
		});
	}
}

function renderLogin(req, res) {
	if (!req.session.user) {
		res.render("login.ejs");
	} else {
		res.redirect("/");
	}
};

function postLogin(req, res) {
	let users = db.collection("FitScheme").findOne({email: req.body.email}, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			if (data == null) {
				res.setHeader("Content-Type", "application/json");
				res.send({userFound: false});
			} else if (data.password === req.body.password) {
				req.session.user = data;
				res.setHeader("Content-Type", "application/json");
				res.send({password: true});
			} else {
				res.setHeader("Content-Type", "application/json");
				res.send({password: false});
			}
		}
	})
}

function renderRegister(req, res) {
	res.render("register.ejs");
};

function createUser(req, res) {
	console.log(req.body);
	let users = db.collection("FitScheme").findOne({email: req.body.email}, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			if (data == null) {
					db.collection("FitScheme").insertOne(req.body, (err) => {
						if (err) {
							console.log(err);
						} else {
							req.session.user = req.body;
							res.setHeader('Content-Type', 'application/json');
							res.send(JSON.stringify({responseText: "Gelukt, inloggeeeh"}))
						}
					});
			} else {
				res.send(JSON.stringify({responseText: "email bestaat al", exists: true}))
			}
		}
	})
};

function renderProfile(req, res) {
	if (!req.session.user) {
		res.redirect("/login");
	} else {
		db.collection("FitScheme").findOne({email: req.session.user.email}, (err, data) => {
			err ? console.log(err) : res.render("profile.ejs", {userData: data});
		});
	}
}

function signOut(req, res) {
	req.session.destroy((err) => {
		err ? console.log(err) : res.redirect("/");
	});
}

app.listen(process.env.PORT || 8000, () => console.log("server is running on port 8000"));