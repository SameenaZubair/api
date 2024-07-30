const searchBox = document.querySelector('#searchBox');
const searchBtn = document.querySelector('#searchBtn');
const recipesContainer = document.querySelector('.recipes-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-Btn');
const introText = document.querySelector('#introText');
const recipesSection = document.querySelector('#recipesSection');

// Function to get recipes
const fetchRecipes = async (query) => {
    introText.classList.add('hide'); // Hide intro text
    recipesContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    recipesContainer.innerHTML = "";

    if (response.meals) {
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span></p>
                <button>View Recipe</button>
            `;

            // Adding EventListener to recipe button
            recipeDiv.querySelector('button').addEventListener('click', () => {
                openRecipePopup(meal);
            });

            recipesContainer.appendChild(recipeDiv);
        });
    } else {
        recipesContainer.innerHTML = "<h2>No recipes found. Please try a different search.</h2>";
    }
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>${getIngredientsList(meal)}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

const getIngredientsList = (meal) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    return ingredients;
};

const closeRecipePopup = () => {
    document.querySelector('.recipe-details').style.display = "none";
};

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipesContainer.innerHTML = "<h2>Please enter a search query.</h2>";
    }
});

recipeCloseBtn.addEventListener('click', closeRecipePopup);