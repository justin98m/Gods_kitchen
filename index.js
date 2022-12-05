//holds the secrets
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
//reads form data
const bodyParser = require('body-parser');
//cleans formdata
const SqlString = require('sqlstring');
//session management
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const user = require('./scripts/user.js');
const start = require('./scripts/connect.js');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
//view engine configurations
const nunjucks = require('nunjucks');
app.use(express.static(__dirname + '/public'));
nunjucks.configure('./public/views', {
	autoescape: true,
	express: app
});
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
var session = false;
app.use(sessions({
	secret: process.env.SECRET,
	saveUninitialized: true,
	cookie: {maxAge: 1000 * 60 * 60 * 24},
	resave: false
}))


app.get('/login', (req, res) => {
	res.render('login.html');
});
app.post('/signin',(req,res) => {
	let username = req.body.username;
	let password = req.body.password;
	let credentials =  [username,password];
	user.validate(credentials,(valid,memberID) =>{
		if(valid){
			req.session.userID = memberID;
			res.redirect('/');
		} else{
			res.redirect('login');
		}
	})
})
app.get('/logout',(req,res)=>{
	res.redirect('login')
})
app.get('/',(req,res) => {
	console.log(req.session.userID);
	res.render('home.html');
})
app.get('/dash',(req,res)=>{
	let userID = req.session.userID;
	user.username(userID,(username)=>{
		if(!username)res.redirect('/');
		user.getRecipes(userID,(recipes)=>{
			let data = {
				username: username,
				recipeInfo : recipes
			}
			console.log(data);
			res.render('dashboard.html', data);
		})
	})
})
app.post('/signup',(req,res) => {
	let username = req.body.username;
	let password = req.body.password;
	let values = [username,password]

	let sql = SqlString.format("insert into Members (user_name,password)" +
	" values(?,?)",values);

	start.query(sql,(err,result) =>{
		if(err){
			res.send(err)
		} else {
			req.session.userID  = result.insertId;
			res.redirect('/');
		}
	})

})
app.delete('/recipe',(req,res)=>{
	let recipe = req.body;
	user.deleteRecipe(recipe,()=>{
		if(result){
			res.send('Recipe Deleted')
		} else {
			res.send('Error Deleting Recipe');
		}
	})
})
app.post('/recipe',(req,res) =>{
	let recipe = req.body;
	if(recipe)console.log('Yes');
	/*if(!req.session.userID){
		res.send('not signed in');
		return;
	};*/
	user.saveRecipe(recipe,req.session.userID,(result)=>{
		if(result){
			res.send('Recipe Saved')
		} else {
			res.send('Error Saving Recipe');
		}
	})
})

const port = 8000;
app.listen(port,() => {
})
