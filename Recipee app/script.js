const searchbox = document.querySelector('.searchbox');
const searchbtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipes-container');
const recipedetailscontent = document.querySelector('.recipe-details-content');
const closebtn = document.querySelector('.close');

const fetchrecipies = async (query) => {
    recipeContainer.innerHTML = 'Fetching recipes...';
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    console.log(response);

    recipeContainer.innerHTML = '';
    if (response.meals) {
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
            `;

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
};

const openRecipePopup = (meal) => {
    // Extract and group ingredients and measurements
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    // Group ingredients into rows of three
    const ingredientRows = [];
    for (let i = 0; i < ingredients.length; i += 3) {
        ingredientRows.push(ingredients.slice(i, i + 3));
    }

    // Create HTML for the recipe popup
    recipedetailscontent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strInstructions}</p>
        <div class="ingredients">
            ${ingredientRows.map(row => `
                <div class="ingredient-row">
                    ${row.map(ingredient => `<span class="ingredient">${ingredient}</span>`).join('')}
                </div>
            `).join('')}
        </div>
    `;
    recipedetailscontent.parentElement.style.display = "block";
};

// Event listener for search button
searchbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchbox.value;
    if (query) {
        fetchrecipies(query);
    }
});

// Event listener for close button
closebtn.addEventListener('click', () => {
    recipedetailscontent.parentElement.style.display = 'none';
});
