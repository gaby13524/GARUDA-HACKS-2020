let axios = require("axios"),
	bodyParser = require("body-parser"),
	express = require("express"),
	mongoose = require("mongoose"),
	expressSanitizer = require("express-sanitizer"),
	app = express();

mongoose.connect("mongodb://localhost/ghacks",{
	useNewUrlParser: true, //bcs the old url parser is deprecated
	useUnifiedTopology: true
})
	.then(()=>{
		console.log("Connected to DB!");
	})
	.catch((err)=>{
		console.log(err.message);
	});

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());//this has to be after body parser
app.use(express.static("public"));
//app.use(methodOverride("_method"))
app.set("view engine","ejs");


app.listen("3000",()=>{
		console.log("SERVER IS LISTENING!");
});


app.get("/", (req,res)=>{
	res.render("landing");
});

app.get("/regis", (req,res)=>{
	res.render("registration");
});

app.get("/main",(req,res)=>{
	res.render('index');
});

app.get("/journal/new",(req,res)=>{
	res.render('Journal');
});

// let deetSchema= new mongoose.Schema({
// 	problem: String,
// 	severity: Number
// });

let journalSchema = new mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	body: String
});
let Journal = new mongoose.model("Journal", journalSchema);

let userSchema= new mongoose.Schema({
	name: String,
	email: String,
	details: [String],
	journal: [journalSchema],
	tasks: [String]
});
let User = new mongoose.model("User", userSchema); 

app.post("/regis", (req,res)=>{
	let newEmail = req.body.Email;
	User.findOne({email: newEmail},(err, user)=>{
		if (err){
			console.log(err);
		}else if (user == null){
			User.create({
				name: req.body.Name,
				email: newEmail
			}, (err, use)=>{
				if (err){
					console.log(err);
				} else{
					console.log(use);
					res.render("today");
				}
			});
		}else{
			res.redirect("/main");
		}
	});
});

// app.post("/regis", (req,res)=>{
// 	let newEmail = req.body.Email;
// 	if(User.find({email: newEmail}).length===0){
// 		User.create({
// 				name: req.query.Name,
// 				email: newEmail
// 			}, (err, user)=>{
// 				if (err){
// 					console.log(err);
// 				} else{
// 					console.log(user);
// 				}
// 			});
// 	}else{
// 		console.log(User.find({email: newEmail}));
// 		//res.redirect("/today");
// 	}
// });

