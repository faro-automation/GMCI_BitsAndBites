document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    fetch('meals.json')
        .then(response => response.json())
        .then(data => updateFields(data[4])) // Access the first meal in the array
        .catch(error => console.error('Error fetching data:', error));
}

function updateFields(data) {
    // Iterate over all meal titles and change them accordingly
    var titles = document.querySelectorAll('.meal-title');
    titles.forEach(function (element, index) {
        element.innerText = data.title;
    });

    // Iterate over meal photos (1st column only)
    var photos = document.querySelectorAll('.meal-photo');
    photos.forEach(function (element, index) {
        element.src = data.photo;
    });
}
