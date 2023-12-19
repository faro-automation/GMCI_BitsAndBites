document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    fetch('meals.json', {
        method: 'POST',
        mode: 'cors',
    } )
        .then(response => response.json())
        .then(data => updateFields(data))
        .catch(error => console.error('Error fetching data:', error));
}

function inputHandler() {
    updateFields(data);
}

function updateFields(data) {
    var language = "DE";

    // Iterate over all meal titles and change them accordingly
    var titles = document.querySelectorAll('.meal-title');
    titles.forEach(function (element, index) {
        if(language == "EN") {
            element.innerText = data[index].title_en;
        }
        else {
            element.innerText = data[index].title;
        }
    });

    // Represent ingredients as icons
    var ingredients = document.querySelectorAll('.meal-ingredients');
    ingredients.forEach(function (element, index) {
        //element.innerText = data.ingredients;
        data[index].ingredients.forEach(function (ingredient) {
            // Create an img element for each ingredient
            var imgElement = document.createElement('img');
    
            // Set the src attribute to the corresponding SVG file
            imgElement.src = '/icons/' + ingredient + '.png';
    
            // Set any additional attributes or styles if needed
            imgElement.alt = ingredient;
            imgElement.width = 20; // Set the width of the icon
    
            // Append the img element to the container
            element.appendChild(imgElement);
        });
    });


    // Iterate over meal photos (1st column only)
    var photos = document.querySelectorAll('.meal-photo');
    photos.forEach(function (element, index) {
        element.src = data[index].photo;
    });

    // Iterate over prices
    var prices = document.querySelectorAll('.meal-prices');
    prices.forEach(function (element, index) {
        var formattedPrices = data[index].prices.map(price => price.toFixed(2) + '€').join(' / ');
        element.innerText = formattedPrices;
    });

}
