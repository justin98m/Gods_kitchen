import {injectCards} from './displayRecipes.js';
let storedRecipes = [];
async function findRecipes(input) {
    return await fetch(`https://api.edamam.com/api/recipes/v2?app_key=4f8910884a3a88118bc227c15398248e&app_id=d2a8ee49&q=` + input + `&type=public`)
        .then((response) => response.json())
        .then((data) => data);
}
function consolidateNutrition(data){
  console.log(data);
  let recipe = [];
  for(let i=0;i< 5; i++){
    recipe[i] = {}
    recipe[i].name = data.hits[i].recipe.label;
    recipe[i].imageUrl = data.hits[i].recipe.image;
    recipe[i].protein = data.hits[i].recipe.digest[2].total;
    recipe[i].fat = data.hits[i].recipe.digest[0].total;
    recipe[i].sodium = data.hits[i].recipe.digest[4].total;
    recipe[i].calories = data.hits[i].recipe.calories;
    recipe[i].linkURL = data.hits[i].recipe.url;
  }
  storedRecipes = recipe;
  injectCards(recipe);
  saveRecipe(recipe[0]);
  saveRecipe(recipe[1]);
}
let searchForm = document.querySelector('.example');
let searchBtn = document.querySelector('.searchBtn');
searchBtn.addEventListener('click',searchItem);

function searchItem(event){
  event.preventDefault();
  let ingredients = document.querySelector('.userInput').value;
  findRecipes(ingredients).then((response) => consolidateNutrition(response));
}

async function saveRecipe(recipe){
  recipe = JSON.stringify(recipe);
  return await fetch('http://localhost:8000/recipe',{
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: recipe
  }).then(response => response);
}
