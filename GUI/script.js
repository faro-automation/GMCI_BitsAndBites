document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    fetch('meals.json')
        .then(response => response.json())
        .then(data => updateFields(data[0])) // Access the first meal in the array
        .catch(error => console.error('Error fetching data:', error));
}

function updateFields(data) {
        // Replace content for the element with ID 'uniqueElement'
    var uniqueElement = document.querySelector('#1a');
    if (uniqueElement) {
        uniqueElement.innerText = 'New Content for Unique Element';
    }
    
        // Replace content for all elements with class 'commonElement'
    var commonElements = document.querySelectorAll('.meal-title');
    commonElements.forEach(function (element, index) {
        element.innerText = 'New Content for Common Element ' + (index + 1);
    });
}
