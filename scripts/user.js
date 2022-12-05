const start = require('./connect.js')
const SqlString = require('sqlstring')

function validate(credentials, cb){
  let sql = SqlString.format("select memberid from Members where user_name=? and"+
	" password =? ",credentials);

	start.query(sql,(err,result) =>{
		if(err){
			cb(false)
		}
		if(result.length == 0){
      cb(false);
    }
    cb(true,result[0].memberid);
	})
}
function deleteRecipe(recipeID,cb){
  let sql = SqlString.format('delete * from Recipe where recipeid=?',recipeID);
  start.query(sql,(err,result)=>{
    if(err){
      cb(false)
    } else {
      cb(true)
    }
  })
}
function getRecipes(userID,cb){
  let sql = SqlString.format('select * from Recipe where memberid =? ',userID);
  start.query(sql,(err,result)=>{
    if(err){
      cb(false)
    } else {
      cb(result);
    }
  })
}
function saveRecipe(recipe,userID,cb){
  console.log(recipe,userID);
  let values = [
    recipe.recipeID,
    userID,recipe.name,
    recipe.imageUrl,
    recipe.linkURL,
    recipe.fat,
    recipe.sodium,
    recipe.calories,
    recipe.protein
  ]
  let sql = SqlString.format('insert into Recipe (recipeid,memberid,recipe_name'+
', image_link,url_link, fat,sodium,calories,protien) values(?,?,?,?,?,?,?,?,?)',
values);
start.query(sql,(err,result)=>{
  if(err){
    console.log(err);
    cb(false)
  }else {
    cb(true);
  }
})
}
function username(userID,cb){
  let sql = SqlString.format('select user_name from Members where memberid=?',
userID);
console.log(sql);
  start.query(sql,(err,result)=>{
    if(err){
      console.log(err);
      cb(false)
    } else {
      console.log(result);
      cb(result[0].user_name)
    }
  })
}

//function getrecipes(recipeInfo,cb)
module.exports = {
  validate,
  getRecipes,
  deleteRecipe,
  saveRecipe,
  username,


};
