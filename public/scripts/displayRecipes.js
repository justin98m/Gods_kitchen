let recipeCard = document.querySelector('.recipe-card');
let con = document.querySelector('.recipe-container');
function injectCards(recipes){
  recipes.forEach(recipe =>{
    let thisNode = recipeCard.cloneNode(true);
    thisNode.classList.remove('template');
    console.log(thisNode);
    thisNode.querySelector('.recipe-card__heading').innerHTML = recipe.name;
    thisNode.querySelector('.fat').innerHTML = 'Fat: ' + recipe.fat;
    thisNode.querySelector('.cal').innerHTML = 'Calories' + recipe.calories;
    thisNode.querySelector('.bro').innerHTML = 'Brotein ' + recipe.protein;
    thisNode.querySelector('.sodium').innerHTML ='Sodium' + recipe.sodium;
    thisNode.querySelector('.url').style.backgroundImage =
    "url(" + recipe.imageUrl+ ") " ;

    con.appendChild(thisNode);
  })
}
export {injectCards};
