$(document).ready(function() {
    //localStorage to store food items
    const FOOD_STORAGE_KEY = 'dailyCalorieLog';
    // Array to hold all food items currently in the log
    let foodItems = [];

    // --- Helper Functions ---

    /**
     * Loads food items from localStorage.
     * If no items are found, returns an empty array.
     * @returns {Array} An array of food objects.
     */
    function loadFoodItems() {
        const storedItems = localStorage.getItem(FOOD_STORAGE_KEY);
        try {
            return storedItems ? JSON.parse(storedItems) : [];
        } catch (e) {
            console.error("Error parsing stored food items from localStorage:", e);
            return []; // Return empty array on parse error
        }
    }
  });

  /**
     * Saves the current array of food items to localStorage.
     * @param {Array} items - The array of food objects to save.
     */
    function saveFoodItems(items) {
        localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(items));
    }

    /**
     * Calculates the total calorie count from the `foodItems` array.
     * @returns {number} The sum of calories of all food items.
     */
    function calculateTotalCalories() {
        return foodItems.reduce((total, item) => total + item.calories, 0);
    }

    /**
     * Renders all food items to the UI and updates the total calorie display.
     * This function is called whenever `foodItems` array changes.
     */
    function renderFoodItems() {
        const $foodList = $('#food-list');
        $foodList.empty(); // Clear existing list items to prevent duplicates

        if (foodItems.length === 0) {
            // Show message when no items are present
            $('#no-items-message').removeClass('hidden');
        } else {
            // Hide message and render items
            $('#no-items-message').addClass('hidden');
            foodItems.forEach(item => {
                // Create a list item HTML string for each food item
                const listItemHtml = `
                    <li class="flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded-md transition duration-150 ease-in-out">
                        <span class="text-lg text-gray-800 font-medium">${item.name}</span>
                        <span class="text-lg font-semibold text-gray-600">${item.calories} kcal</span>
                        <button class="remove-item-btn bg-red-400 hover:bg-red-500 text-white text-sm font-bold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition duration-200 ease-in-out transform hover:scale-105" data-id="${item.id}">
                            Remove
                        </button>
                    </li>
                `;
                $foodList.append(listItemHtml); // Append the new list item to the food list
            });
        }
        // Update the total calories displayed
        $('#total-calories').text(calculateTotalCalories());
    }

    /**
     * Adds a new food item to the `foodItems` array, saves it, and re-renders the UI.
     * @param {string} name - The name of the food item.
     * @param {number} calories - The calorie count of the food item.
     */
    function addFoodItem(name, calories) {
        const newItem = {
            id: Date.now(), // Use timestamp as a simple unique ID
            name: name,
            calories: calories
        };
        foodItems.push(newItem); // Add new item to the array
        saveFoodItems(foodItems); // Persist the updated array
        renderFoodItems(); // Update the UI
    }

    /**
     * Removes a food item from the `foodItems` array by its unique ID.
     * Saves the updated array and re-renders the UI.
     * @param {number} idToRemove - The ID of the food item to remove.
     */
    function removeFoodItem(idToRemove) {
        // Filter out the item with the matching ID
        foodItems = foodItems.filter(item => item.id !== idToRemove);
        saveFoodItems(foodItems); // Persist the updated array
        renderFoodItems(); // Update the UI
    }

    /**
     * Resets the calorie counter by clearing all food items.
     * Clears the `foodItems` array, localStorage, and updates the UI.
     */
    function resetCalorieCounter() {
        // Implement a custom modal/dialog instead of alert/confirm for better UX if needed.
        // For this example, we'll use a simple confirmation.
        if (confirm('Are you sure you want to reset the calorie counter for a new day? This action cannot be undone.')) {
            foodItems = []; // Clear the array
            saveFoodItems(foodItems); // Clear localStorage
            renderFoodItems(); // Update the UI
            // Optionally, show a confirmation message to the user
            alert('Calorie counter has been successfully reset!');
        }
    }

    // --- Event Handlers ---

    // Handle the submission of the food input form
    $('#food-form').on('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission (page reload)

        const $foodNameInput = $('#food-name');
        const $calorieCountInput = $('#calorie-count');

        const foodName = $foodNameInput.val().trim();
        const calorieCount = parseInt($calorieCountInput.val());

        // Basic input validation
        if (foodName === '' || isNaN(calorieCount) || calorieCount <= 0) {
            alert('Please enter a valid food name and a positive calorie count.');
            return; // Stop function execution if validation fails
        }

        addFoodItem(foodName, calorieCount); // Add the new food item

        // Clear the form fields after successful addition
        $foodNameInput.val('');
        $calorieCountInput.val('');
        $foodNameInput.focus(); // Set focus back to food name input
    });

    // Handle clicks on the "Remove" buttons using event delegation.
    // This is crucial because list items are added dynamically.
    $('#food-list').on('click', '.remove-item-btn', function() {
        // Get the food item ID from the data-id attribute of the clicked button
        const itemId = parseInt($(this).data('id'));
        removeFoodItem(itemId); // Remove the item
    });

