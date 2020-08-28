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

const bcrypt = require("bcrypt");
const saltRounds = 10;

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
app.post("/updateRequirements", updateRequirements);
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
	let users = db.collection("FitScheme").findOne({email: req.body.email}, async (err, data) => {
		if (err) {
			console.log(err);
		} else {
			/*async function comparePass(plainPass, hashedPass) {

			}*/
			if (data == null) {
				res.setHeader("Content-Type", "application/json");
				res.send({userFound: false});
			} else {
				await bcrypt.compare(req.body.password, data.password, (err, result) => {
					if (result) {
						console.log(result);
						req.session.user = data;
						res.setHeader("Content-Type", "application/json");
						res.send({password: true});
					} else {
						res.setHeader("Content-Type", "application/json");
						res.send({password: false});
					}
				})
			}
		}
	})
}

function renderRegister(req, res) {
	res.render("register.ejs");
};

async function createUser(req, res) {
	let hashedPass = "";
	await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
		if (err) {
			console.log(err);
		} else {
			console.log(hash);
			hashedPass = hash;
		}
	});
	console.log(hashedPass);
	let userData = {
		email: req.body.email,
		name: req.body.name,
		length: req.body.length,
		age: req.body.age,
		weight: req.body.weight,
		password: hashedPass,
		requirements: {
			calories: 0,
			protein: 0,
			fats: 0,
			carbohydrates: 0
		},
		dailyData: []
	};
	let users = db.collection("FitScheme").findOne({email: req.body.email}, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			if (data == null) {
					db.collection("FitScheme").insertOne(userData, (err) => {
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
};

function updateRequirements(req, res) {
	db.collection("FitScheme").updateOne({email: req.session.user.email}, {$set: {requirements: req.body}}, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify({succeeded: true}));
		}
	})
};

function signOut(req, res) {
	req.session.destroy((err) => {
		err ? console.log(err) : res.redirect("/");
	});
}

app.listen(process.env.PORT || 8000, () => console.log("server is running on port 8000"));