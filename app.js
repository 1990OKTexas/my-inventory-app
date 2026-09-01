let catalog = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const itemImageInput = document.getElementById('itemImage');
const itemNameInput = document.getElementById('itemName');
const itemDetailsInput = document.getElementById('itemDetails');
const addItemBtn = document.getElementById('addItemBtn');
const inventoryList = document.getElementById('inventoryList');

// Modal Elements
const modal = document.getElementById('itemModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close-btn');

// Load saved items from localStorage on startup
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('localInventoryApp');
    if (savedData) {
        catalog = JSON.parse(savedData);
        renderCatalog(catalog);
    }
});

// Add Item Button Event
addItemBtn.addEventListener('click', () => {
    const file = itemImageInput.files[0];
    const name = itemNameInput.value.trim();
    const details = itemDetailsInput.value.trim();

    if (!name || !details) {
        alert("Please provide both a name and details for the item.");
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        name: name,
        details: details,
        image: null
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            newItem.image = e.target.result;
            saveAndRender(newItem);
        };
        reader.readAsDataURL(file);
    } else {
        saveAndRender(newItem);
    }
});

// Save to localStorage & refresh display
function saveAndRender(item) {
    catalog.push(item);
    localStorage.setItem('localInventoryApp', JSON.stringify(catalog));

    itemImageInput.value = '';
    itemNameInput.value = '';
    itemDetailsInput.value = '';

    renderCatalog(catalog);
}

// Render cards (Only Name and Details)
function renderCatalog(itemsToRender) {
    inventoryList.innerHTML = '';

    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.details}</p>
        `;

        card.addEventListener('click', () => openModal(item));
        inventoryList.appendChild(card);
    });
}

// Open modal (Shows Image, Name, and Details)
function openModal(item) {
    modalImage.style.display = item.image ? 'block' : 'none';
    modalImage.src = item.image || '';
    modalName.textContent = item.name;
    modalDetails.textContent = item.details;
    modal.style.display = 'flex';
}

// Close modal handlers
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Search filter
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCatalog = catalog.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    );
    renderCatalog(filteredCatalog);
});
