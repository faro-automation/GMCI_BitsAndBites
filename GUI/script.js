var pricesCategory = "all";
var language = "de";
var filterString = [];
var rawValues = ["pork", "milk", "gluten"];
var displayValues = ["ohne Schweinfleisch", "ohne Milch", "ohne Gluten"];
var RDI = {
    calories: 2000,
    proteins: 50,
    fats: 72,
    satfat: 20,
    salt: 5,
    carbs: 275,
    sugar: 50
  };

  var colorCodes = {
    calories: "#2ea12a",
    proteins: "#1fa39f",
    fats: "#d65933",
    satfat: "#a61b1b",
    salt: "#1f44a3",
    carbs: "#cf9136",
    sugar: "#cf3699"
  };

  var splitactive = true;
  

  function getBusinessDays(startDate, locale) {
    const businessDays = [];
    let currentDate = new Date(startDate);

    while (businessDays.length < 5) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            const dayOfWeek = currentDate.toLocaleDateString(locale, { weekday: 'short' });
            const formattedDate = currentDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
			
            businessDays.push(`${dayOfWeek}, ${formattedDate}`);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(businessDays.join('\n'));

    return businessDays;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    fetch('meals.json', {
        method: 'POST',
        mode: 'cors',
    } )
        .then(response => response.json())
        .then(data => updateFields(data, 1))
        .catch(error => console.error('Error fetching data:', error));
}

function updateFields(data, init) {
    var formattedPrices;
    let colors = ["rgb(123, 22, 22)", "rgb(22, 123, 69)", "rgb(19, 99, 175)", "rgb(221, 146, 40)", "rgb(223, 69, 169)"];
    
    // Set time
    const today = new Date();
    if (language == "en") {
        var locale = 'en-GB';
    }
    else {
        var locale = 'de-DE';
    }
    const nextBusinessDays = getBusinessDays(today, locale);
    for (let i = 0; i < 5; i++) {
        const elementId = 'day' + (i + 1);
        document.getElementById(elementId).innerHTML = `${nextBusinessDays[i]}`;
    }

    // Update fields
    for (let i = 0; i < data.length; i++) {
        targetDiv_title = document.getElementsByClassName(`meal-title ${data[i].position}`);
        if (language == "en") {
            targetDiv_title[0].innerHTML = data[i].title_en;
        }
        else {
            targetDiv_title[0].innerHTML = data[i].title;
        }
        
        if (data[i].position[0] == '1') {
            targetDiv_photo = document.getElementsByClassName(`meal-photo ${data[i].position}`);
            targetDiv_photo[0].src = data[i].photo;
        }

        targetDiv_prices = document.getElementsByClassName(`meal-prices ${data[i].position}`);

        switch(pricesCategory) {
            case "students":
                formattedPrices = data[i].prices[0].toFixed(2) + '€';
                targetDiv_prices[0].style.setProperty("font-size", "16px");
                document.getElementById("price-students-container").style.setProperty("opacity", 1);
                document.getElementById("price-staff-container").style.setProperty("opacity", 0.2);
                document.getElementById("price-guests-container").style.setProperty("opacity", 0.2);
                break;
            case "staff":
                formattedPrices = data[i].prices[1].toFixed(2) + '€';
                targetDiv_prices[0].style.setProperty("font-size", "16px");
                document.getElementById("price-students-container").style.setProperty("opacity", 0.2);
                document.getElementById("price-staff-container").style.setProperty("opacity", 1);
                document.getElementById("price-guests-container").style.setProperty("opacity", 0.2);
                break;
            case "guests":
                formattedPrices = data[i].prices[2].toFixed(2) + '€';
                targetDiv_prices[0].style.setProperty("font-size", "16px");
                document.getElementById("price-students-container").style.setProperty("opacity", 0.2);
                document.getElementById("price-staff-container").style.setProperty("opacity", 0.2);
                document.getElementById("price-guests-container").style.setProperty("opacity", 1);
                break;
            default :
                formattedPrices = data[i].prices.map(price => price.toFixed(2) + '€').join(' / ');
                targetDiv_prices[0].style.setProperty("font-size", "14px");
                document.getElementById("price-students-container").style.setProperty("opacity", 1);
                document.getElementById("price-staff-container").style.setProperty("opacity", 1);
                document.getElementById("price-guests-container").style.setProperty("opacity", 1);
        }

        targetDiv_prices[0].innerHTML = formattedPrices;

        if (data[i].sold_out) {
            if(data[i].position[0] == 1) {
                soldOutDiv = document.getElementsByClassName(`meal-container ${data[i].position}`);
            }
            else {
                soldOutDiv = document.getElementsByClassName(`meal-container-reduced ${data[i].position}`);
            }
            soldOutDiv[0].style.setProperty("opacity", 0.3);

            if (language == "en") {
                targetDiv_prices[0].innerText = "Sold out!";
            }
            else {
                targetDiv_prices[0].innerText = "Ausverkauft!";
            }
        }

        if (init) {
            targetDiv_ingredients = document.getElementsByClassName(`meal-ingredients ${data[i].position}`)[0];
            data[i].ingredients.forEach(function (ingredient) {
                // Create an img element for each ingredient
                var imgElement = document.createElement('img');
        
                // Set the src attribute to the corresponding SVG file
                imgElement.src = './icons/' + ingredient + '.png';
        
                // Set any additional attributes or styles if needed
                imgElement.alt = ingredient;
                imgElement.width = 20; // Set the width of the icon
                imgElement.title = ingredient;
        
                // Append the img element to the container
                targetDiv_ingredients.appendChild(imgElement);
            });
        }

        targetDiv_circle = document.getElementsByClassName(`circle ${data[i].position}`)[0];
        var percentage = data[i].nutritional_value.caloric_content * 100 / RDI.calories;
        j = letterToNumber(data[i].position[1]);
        if (targetDiv_circle) {
            targetDiv_circle.style.setProperty('--primary-color', `${colors[j]} ${percentage}%`);
          }

          targetDiv_kcal = document.getElementsByClassName(`number ${data[i].position}`)[0];
          targetDiv_kcal.innerHTML = data[i].nutritional_value.caloric_content;
        }

}

/* SIDEBAR BEGIN */

function openNav(posSearch) {
    document.getElementById("sidePanel").style.width = "50%";

    fetch('meals.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
        let colors = ["rgb(123, 22, 22)", "rgb(22, 123, 69)", "rgb(19, 99, 175)", "rgb(221, 146, 40)", "rgb(223, 69, 169)"];
        const foundEntry = data.find(entry => entry.position === posSearch);

        setOpacity(0.2)
        document.getElementById("expanded-photo").src = "img/placeholder.png";
        document.getElementById("expanded-title").innerHTML = "Title";
        document.getElementById("expanded-category").innerHTML = "Category";
        document.getElementById("expanded-ingredients-string").innerHTML = "null";
        document.getElementById("expanded-allergens-string").innerHTML = "null";
        document.getElementById("price-students").innerHTML = "-.-- €";
        document.getElementById("price-staff").innerHTML =  "-.-- €";
        document.getElementById("price-guests").innerHTML =  "-.-- €";
        document.getElementById("expanded-entry-letter").innerText = "-";
        document.getElementById("expanded-entry").style.setProperty('background-color', `#C3C3C3`);
        document.getElementsByClassName("expanded-nutrition")[0].style.setProperty("display", "none");

        if (foundEntry) {
            j = letterToNumber(foundEntry.position[1]);

            if(foundEntry.position[0] == 1) {
                targetDiv = document.getElementsByClassName(`meal-container ${foundEntry.position}`);
            }
            else {
                targetDiv = document.getElementsByClassName(`meal-container-reduced ${foundEntry.position}`);
            }
            targetDiv[0].style.setProperty("opacity", 1);

            if(foundEntry.position[0] == 1) {
                document.getElementById("expanded-photo").src = foundEntry.photo;
            }

            document.getElementById("expanded-title").innerHTML = foundEntry.title;
            document.getElementById("expanded-category").innerHTML = foundEntry.category;
            document.getElementById("expanded-category").style.setProperty('color', colors[j]);

            document.getElementById("expanded-ingredients-string").innerHTML = foundEntry.ingredients_string;
            document.getElementById("expanded-allergens-string").innerHTML = foundEntry.allergens;

            formattedPrices = foundEntry.prices.map(price => price.toFixed(2) + '€');
            document.getElementById("price-students").innerHTML = formattedPrices[0];
            document.getElementById("price-staff").innerHTML = formattedPrices[1];
            document.getElementById("price-guests").innerHTML = formattedPrices[2];
            document.getElementById("expanded-entry-letter").innerText = foundEntry.position[1].toUpperCase();
            document.getElementById("expanded-entry").style.setProperty('background-color', `${colors[j]}`);
        
            targetDiv_kcal = document.getElementsByClassName(`circle-large-kcal`)[0];
            var percentage = foundEntry.nutritional_value.caloric_content * 100 / RDI.calories;
            
            document.getElementsByClassName("expanded-nutrition")[0].style.setProperty("display", "grid")
            if (targetDiv_kcal) {
                targetDiv_kcal.style.setProperty('--kcal-color', `${colorCodes.calories} ${percentage}%`);
            }
    
              targetDiv_kcal_number = document.getElementsByClassName(`num-label-large-kcal`)[0];
              targetDiv_kcal_number.innerHTML = foundEntry.nutritional_value.caloric_content;

              targetDiv_proteins = document.getElementsByClassName(`circle-large proteins`)[0];
              proteinsPercentage = foundEntry.nutritional_value.proteins * 100 / RDI.proteins;
              if (proteinsPercentage > 100) {
                proteinsPercentage = 100;
              }
              
              if (targetDiv_proteins) {
                targetDiv_proteins.style.setProperty('--var-color', `${colorCodes.proteins} ${proteinsPercentage}%`);
            }
      
                targetDiv_protein_number = document.getElementsByClassName(`num-label-large proteins`)[0];
                targetDiv_protein_number.innerHTML = foundEntry.nutritional_value.proteins + "g";

                targetDiv_fats = document.getElementsByClassName(`circle-large fats`)[0];
                fatsPercentage = foundEntry.nutritional_value.fats * 100 / RDI.fats;
                if (fatsPercentage > 100) {
                  fatsPercentage = 100;
                }
                
                if (targetDiv_fats) {
                  targetDiv_fats.style.setProperty('--var-color', `${colorCodes.fats} ${fatsPercentage}%`);
              }
        
                  targetDiv_fat_number = document.getElementsByClassName(`num-label-large fats`)[0];
                  targetDiv_fat_number.innerHTML = foundEntry.nutritional_value.fats + "g";
              
                  targetDiv_satfats = document.getElementsByClassName(`circle-large saturated-fats`)[0];
                  satfatsPercentage = foundEntry.nutritional_value.saturated_fatty_acids * 100 / RDI.satfat;
                  if (satfatsPercentage > 100) {
                    satfatsPercentage = 100;
                  }
                  
                  if (targetDiv_satfats) {
                    targetDiv_satfats.style.setProperty('--var-color', `${colorCodes.satfat} ${satfatsPercentage}%`);
                }
          
                    targetDiv_fat_number = document.getElementsByClassName(`num-label-large saturated-fats`)[0];
                    targetDiv_fat_number.innerHTML = foundEntry.nutritional_value.saturated_fatty_acids + "g";
                
                    /* carbs */

                    targetDiv_carbs = document.getElementsByClassName(`circle-large carbs`)[0];
                    carbsPercentage = foundEntry.nutritional_value.carbohydrates * 100 / RDI.carbs;
                    if (carbsPercentage > 100) {
                      carbsPercentage = 100;
                    }
                    
                    if (targetDiv_carbs) {
                      targetDiv_carbs.style.setProperty('--var-color', `${colorCodes.carbs} ${carbsPercentage}%`);
                  }
            
                      targetDiv_fat_number = document.getElementsByClassName(`num-label-large carbs`)[0];
                      targetDiv_fat_number.innerHTML = foundEntry.nutritional_value.carbohydrates + "g";

                /* salt */
                targetDiv_salt = document.getElementsByClassName(`circle-large salt`)[0];
                saltPercentage = foundEntry.nutritional_value.salt * 100 / RDI.salt;
                if (saltPercentage > 100) {
                  saltPercentage = 100;
                }
                
                if (targetDiv_salt) {
                  targetDiv_salt.style.setProperty('--var-color', `${colorCodes.salt} ${saltPercentage}%`);
              }
        
                  targetDiv_fat_number = document.getElementsByClassName(`num-label-large salt`)[0];
                  targetDiv_fat_number.innerHTML = foundEntry.nutritional_value.salt + "g";

                /* sugar */
                targetDiv_sugar = document.getElementsByClassName(`circle-large sugar`)[0];
                sugarPercentage = foundEntry.nutritional_value.sugars * 100 / RDI.sugar;
                if (sugarPercentage > 100) {
                  sugarPercentage = 100;
                }
                
                if (targetDiv_sugar) {
                  targetDiv_sugar.style.setProperty('--var-color', `${colorCodes.sugar} ${sugarPercentage}%`);
              }
        
                  targetDiv_fat_number = document.getElementsByClassName(`num-label-large sugar`)[0];
                  targetDiv_fat_number.innerHTML = foundEntry.nutritional_value.sugars + "g";

        } else {
          console.log("Entry not found for position:", posSearch);
        }
    })
    .catch(error => {
      console.error('Error fetching JSON:', error);
    });
  }

  function closeNav() {
    document.getElementById("sidePanel").style.width = "0";
    setOpacity(1)
  }

/* SIDEBAR END */

/* LANGUAGE SELECTION BEGIN */

function toggleDropdown(id) {
    var dropdownContent = document.getElementById(id);
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    }
    else {
        dropdownContent.style.display = "block";
    }
}

function changeLanguage(lang) {
    target_flag = document.getElementById("flag-main");
    target_language = document.getElementById("lang-main");
    if (lang == "de") {
        target_flag.src = "interface/de.png";
        target_language.innerText = "Deutsch";
        language = "de";

        fetch('meals.json')
            .then(response => response.json())
            .then(data => updateFields(data, 0))
            .catch(error => console.error('Error fetching data:', error));

            document.getElementById("visitors-label").innerText = "Besucher: ";
    }
    else if (lang == "en") {
        target_flag.src = "interface/en.png";
        target_language.innerText = "English";
        language = "en";

        fetch('meals.json')
            .then(response => response.json())
            .then(data => updateFields(data, 0))
            .catch(error => console.error('Error fetching data:', error));
            
            document.getElementById("visitors-label").innerText = "Visitors: ";

    }
    else {
        target_flag.src = "interface/multilang.png";
        target_language.innerText = "Multi";
    }
    toggleDropdown("languageDropdown");

    console.log("Selected language: " + lang);
    // You can replace the console.log with your actual language change logic
}

function changePrices(category) {
    target_prices = document.getElementById("prices-main");
    if (category == "students") {
        target_prices.innerText = "Studierende";
        pricesCategory = "students";
    }
    else if (category == "staff") {
        target_prices.innerText = "Bedienstete";
        pricesCategory = "staff";
    }
    else if (category == "guests") {
        target_prices.innerText = "Gäste";
        pricesCategory = "guests";
    }
    else {
        target_prices.innerText = "Alle";
        pricesCategory = "all";
    }
    toggleDropdown("pricesDropdown");

    fetch('meals.json')
            .then(response => response.json())
            .then(data => updateFields(data, 0))
            .catch(error => console.error('Error fetching data:', error));

    console.log("Selected prices: " + category);
    // You can replace the console.log with your actual prices change logic
}

/* LANGUAGE SELECTION END */



function letterToNumber(letter) {
    const alphabet = 'abcde';
    
    if (alphabet.includes(letter)) {
      return alphabet.indexOf(letter);
    } else {
      console.error('Invalid input');
      return null; // or handle the error accordingly
    }
  }

/* FILTERING BEGIN */
function showFilterPopup() {
    document.getElementById("filterPopup").style.display = "block";
}

function closeWindow(reference) {
    document.getElementById(reference).style.display = "none";
}

function applyFilters() {
    filterString = [];
    var selectedFilters = document.querySelectorAll('#filterPopup input:checked');
    var selectedFiltersContainer = document.getElementById("selectedFilters");
    selectedFiltersContainer.innerHTML = "";

    selectedFilters.forEach(function (filter) {
        var filterItem = document.createElement("div");
        filterItem.classList.add("filter-item");
        filterItem.innerHTML = mapValues(filter.value) + " ×";
        filterItem.onclick = function () {
            removeFilter(filterItem, filter.value);
        };
        selectedFiltersContainer.appendChild(filterItem);
        filterString.push(filter.value);
    });

    document.getElementById("filterPopup").style.display = "none";

    fetch('meals.json')
        .then(response => response.json())
        .then(data => filterData(data))
        .catch(error => console.error('Error fetching data:', error));
}

function removeFilter(filterItem) {
    filterItem.remove();
    removedItem = filterItem.innerText;
    var rawVal = reverseMapValues(removedItem);
    var index = filterString.indexOf(rawVal);
    if (index !== -1) {
        filterString.splice(index, 1);
    }

    var activeFilters = document.querySelectorAll(`#filterPopup input[value=${rawVal}]:checked`);
    activeFilters.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    setOpacity(1);

    fetch('meals.json')
        .then(response => response.json())
        .then(data => filterData(data))
        .catch(error => console.error('Error fetching data:', error));
}

function clearAllFilters() {
    document.getElementById("selectedFilters").innerHTML = "";
    
    var activeFilters = document.querySelectorAll('#filterPopup input:checked');
    activeFilters.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    setOpacity(1);
}

function filterData(data) {
    setOpacity(1);
    for (let i = 0; i < filterString.length; i++) {
        for (let j = 0; j < data.length; j++) {
            ingArray = data[j].ingredients;
            for (let k = 0; k < ingArray.length; k++) {
                if (ingArray[k] == filterString[i]) {
                    if (data[j].position[0] == 1) {
                        targetDiv = document.getElementsByClassName(`meal-container ${data[j].position}`);
                        targetDiv[0].style.setProperty("opacity", 0.2);
                    }
                    else {
                        targetDiv = document.getElementsByClassName(`meal-container-reduced ${data[j].position}`);
                        targetDiv[0].style.setProperty("opacity", 0.5);
                    }
                }
            }
        }
    }
}

function setOpacity(value) {
    fullContainers = document.getElementsByClassName(`meal-container`);
    reducedContainers = document.getElementsByClassName(`meal-container-reduced`);
    for (let j = 0; j < fullContainers.length; j++) {
        fullContainers[j].style.setProperty("opacity", value);
    }
    for (let i = 0; i < reducedContainers.length; i++) {
        reducedContainers[i].style.setProperty("opacity", value);
    }

    fetch('meals.json')
    .then(response => response.json())
    .then(data => updateFields(data, 0))
    .catch(error => console.error('Error fetching data:', error));
}

function mapValues(value) {
    var index = rawValues.indexOf(value);
    if (index !== -1) {
        return displayValues[index];
    } else {
        // Handle the case when the value is not found
        return "error";
    }
}

function reverseMapValues(value) {
    croppedString = value.substring(0, value.length - 2);
    var index = displayValues.indexOf(croppedString);
    if (index !== -1) {
        return rawValues[index];
    } else {
        // Handle the case when the value is not found
        return "error";
    }
}

// this function scales the grid container to a multiple of screenwidth
function scaleDisplay(widthfactor) {
    var toFullWidth = true;
    widthfactor = parseFloat(widthfactor);
    if (widthfactor > 0.0 && window.innerWidth > (screen.width/2)) {
        var screenWidth = window.innerWidth * widthfactor;
    } else {
        var screenWidth = window.innerWidth;
    }
    var screenHeight = window.innerHeight;
    var containerWidth = 1150;
    var containerHeight = 1040;
    if (toFullWidth) {
        var scale = ((screenWidth) / containerWidth);
    } else {
        var scale = Math.min((screenWidth / containerWidth), (screenHeight / containerHeight));
    }
    document.getElementById("grid-container").style.transform = "scale(" + scale + ")"; 
    var widthCorrection = ((containerWidth * scale  - containerWidth) /2) +20;
    var heightCorrection = ((containerHeight * scale - containerHeight) /2) +20;
    document.getElementById("grid-container").style.position = "absolute";
    document.getElementById("grid-container").style.top = heightCorrection + "px"; // Set the top position relative to the window
    document.getElementById("grid-container").style.left = widthCorrection + "px"; // Set the left position relative to the window
    console.log("sw " + screenWidth + " sh " + screenHeight +  " s " + scale +  " w " + widthfactor + " ifr " + document.getElementById("iframe").style.width);
}  

window.addEventListener("resize", function(event) { 
    if (event.target === window) {
        console.log("resize")
        if (splitactive) {
            scaleDisplay(0.5);
        } else {
            scaleDisplay(1.0); 
        } 
    }
});     

 window.addEventListener("load", function() { 
        console.log("load");
        if (splitactive) {
            document.getElementById("iframe").style.visibility = 'visible';
            scaleDisplay(0.5);
        } else {
            document.getElementById("iframe").style.visibility = 'hidden';
            scaleDisplay(1.0);
        } 
}, false); 



