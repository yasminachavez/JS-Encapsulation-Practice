const cart = {
    // The array of sandwiches the user is ordering. 
    //  This will be updated after we fetch.
    items: [],
    
    // The sandwich selected in the cart (defaults to the first sandwich)
    selectedSandwich: null,
    
    // Updates the DOM to display a list of sandwiches from the cart
    render: function() {
        const sandwichUl = document.querySelector('.sandwich-list');
    
        // Empty the sandwichUl before adding any content to it.
        sandwichUl.innerHTML = '';
    
        items.forEach((sandwich) => {
            const sandwichDiv = this.createSandwichCard(sandwich);
            sandwichUl.append(sandwichDiv)
        })
    },
    
    // Creates a DIV to display a single sandwich
    createSandwichCard: function (sandwich) {
        const sandwichCard = document.createElement('div');
        sandwichCard.className = selectedSandwich.id === sandwich.id ? 'm-3 card border-primary' : 'm-3 card'
        sandwichCard.style.cursor = 'pointer';
        sandwichCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${sandwich.id}. ${sandwich.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${sandwich.bread}</h6>
                <p class="card-text">${sandwich.ingredients.join(', ')}</p>
                <button class="btn btn-secondary duplicate-button">Duplicate</button>
                <button class="btn btn-danger delete-button">Delete</button>
            </div>
        `
    
        // When a sandwich card is clicked, select it.
        sandwichCard.addEventListener('click', () => {
            selectSandwich(sandwich)
        })
    
        // Add a button to copy a sandwich
        const duplicateButton = sandwichCard.querySelector('.duplicate-button')
        duplicateButton.addEventListener('click', () => {
            duplicateSandwich(sandwich)
        })
    
        // Add a button to delete a sandwich
        const deleteButton = sandwichCard.querySelector('.delete-button')
        deleteButton.addEventListener('click', (e) => {
            deleteSandwich(sandwich)
        })
    
        return sandwichCard
    },
    
    // We'll use this function anytime we need to change the selected sandwich
    selectSandwich: function (sandwich) {
        selectedSandwich = sandwich
    
        const breadRadio = document.querySelector(`[value="${sandwich.bread}"]`)
        breadRadio.checked = true
    
        const nameInput = document.querySelector(`.name-input`)
        nameInput.value = sandwich.name
    
        this.render()
        ingredientList.render()
    },
    
    // We'll use this function to save the sandwich, either
    //  when we've added/removed ingredients, or changed the type of bread.
    saveSelectedSandwich: async function () {
    
        // Save the sandwich on the server
        fetch(`http://localhost:3001/cart/${selectedSandwich.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedSandwich)
        })
    },
    
    // Runs when the user clicks 'Duplicate' on a sandwich card
    duplicateSandwich: async function (sandwich) {
        let newSandwich = {
            name: sandwich.name,
            bread: sandwich.bread,
            ingredients: sandwich.ingredients
        }
    
        // Save the sandwich on the server
        let response = await fetch(`http://localhost:3001/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSandwich)
        })
    
        newSandwich = await response.json()
    
        items.push(newSandwich)
        selectSandwich(newSandwich)
    },
    
    // Runs when the user clicks 'Delete' on a sandwich card
    deleteSandwich: async function(sandwich) {
        // Can't delete the last sandwich in the cart
        if (items.length === 1) {
            return
        }
    
        // Remove the sandwich from the server
        await fetch(`http://localhost:3001/cart/${sandwich.id}`, {
            method: 'DELETE',
        })
    
        // Remove the sandwich locally
        items = items.filter(x => x !== sandwich)
        if (selectedSandwich.id === sandwich.id) {
            selectSandwich(items[0])
        } else {
            renderCart()
        }
    },
    
    // Runs when the user clicks 'Add Sandwich'
    addSandwich: async function() {
        let newSandwich = {
            name: 'Unnamed',
            bread: 'White',
            ingredients: []
        }
    
        // Save the sandwich on the server
        const response = await fetch(`http://localhost:3001/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSandwich)
        })
    
        // Update the sandwich to match what the server responds with
        //  (this will include the id)
        newSandwich = await response.json()
    
        items.push(newSandwich)
        selectSandwich(newSandwich)
    },
    
    changeSelectedSandwichName: function (value) {
        selectedSandwich.name = value
        saveSelectedSandwich()
        this.renderCart()
    },
    
    changeSelectedSandwichBread: function (value) {
        selectedSandwich.bread = value
        saveSelectedSandwich()
        this.renderCart()
    },
}