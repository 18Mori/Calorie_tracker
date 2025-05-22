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