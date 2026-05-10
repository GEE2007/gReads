// search.js - Shared search functionality for all pages

document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.querySelector('.search-container');
    const searchBar = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.search-icon');

    if (!searchBar || !searchContainer) return; // Exit if no search bar on page

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #f3d8e0;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(217, 169, 185, 0.15);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        margin-top: 4px;
    `;

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.style.cssText = `
        padding: 8px 0;
    `;
    dropdown.appendChild(resultsContainer);

    // Add dropdown to search container
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(dropdown);

    let searchTimeout;
    let currentQuery = '';

    // Function to show search results
    function showResults(query) {
        const lowerQuery = query.toLowerCase();
        const filteredBooks = books.filter(book =>
            (book.title && book.title.toLowerCase().includes(lowerQuery)) ||
            (book.author && book.author.toLowerCase().includes(lowerQuery)) ||
            (book.genre && book.genre.some(g => g.toLowerCase().includes(lowerQuery)))
        ).slice(0, 5); // Limit to 5 results

        resultsContainer.innerHTML = '';

        if (filteredBooks.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.cssText = `
                padding: 12px 16px;
                color: #9a9a9a;
                font-size: 14px;
                text-align: center;
            `;
            noResults.textContent = 'No books found';
            resultsContainer.appendChild(noResults);
        } else {
            filteredBooks.forEach(book => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.style.cssText = `
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid #f8f9fa;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                `;

                resultItem.innerHTML = `
                    <img src="${book.image}" alt="${book.title}" style="width: 32px; height: 48px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 500; color: #404040; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${book.title}</div>
                        <div style="color: #9a9a9a; font-size: 12px;">by ${book.author}</div>
                    </div>
                `;

                resultItem.addEventListener('mouseenter', () => {
                    resultItem.style.backgroundColor = '#f8f9fa';
                });

                resultItem.addEventListener('mouseleave', () => {
                    resultItem.style.backgroundColor = 'transparent';
                });

                resultItem.addEventListener('click', () => {
                    // Navigate to book page
                    localStorage.setItem("selectedBook", JSON.stringify(book));
                    window.location.href = "book.html";
                });

                resultsContainer.appendChild(resultItem);
            });
        }

        dropdown.style.display = 'block';
    }

    // Function to hide dropdown
    function hideResults() {
        dropdown.style.display = 'none';
    }

    // Handle input
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.trim();
        currentQuery = query;

        if (query.length >= 2) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (currentQuery === query) { // Ensure query hasn't changed
                    showResults(query);
                }
            }, 300);
        } else {
            hideResults();
        }
    });

    // Handle focus
    searchBar.addEventListener('focus', function() {
        if (searchBar.value.trim().length >= 2) {
            showResults(searchBar.value.trim());
        }
    });

    // Handle Enter key
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchBar.value.trim();
            if (query) {
                // Redirect to search results page with query
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Handle icon click
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const query = searchBar.value.trim();
            if (query) {
                showResults(query);
            }
        });
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideResults();
        }
    });

    // Hide dropdown on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideResults();
            searchBar.blur();
        }
    });
});