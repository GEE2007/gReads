// myBooks.js - Dashboard for user's book library

document.addEventListener('DOMContentLoaded', function() {
    loadMyBooksDashboard();
});

function loadMyBooksDashboard() {
    const shelves = [
        { key: 'readBooks', title: 'Read Books', icon: 'fas fa-check-circle' },
        { key: 'recommendedBooks', title: 'Recommended', icon: 'fas fa-bullhorn' },
        { key: 'favorites', title: 'Favorites', icon: 'fas fa-heart' },
        { key: 'reviewed', title: 'Reviewed', icon: 'fas fa-star' },
        { key: 'dnf', title: 'Did Not Finish', icon: 'fas fa-times-circle' }
    ];

    const content = document.getElementById('myBooksContent');

    shelves.forEach(shelf => {
        const books = getShelfBooks(shelf.key);
        const section = createShelfSection(shelf, books);
        content.appendChild(section);
    });

    loadActivityTimeline();
}

function getShelfBooks(shelfKey) {
    const stored = localStorage.getItem(shelfKey);
    return stored ? JSON.parse(stored) : [];
}

function createShelfSection(shelf, books) {
    const section = document.createElement('div');
    section.className = 'genre-section';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '20px';

    const icon = document.createElement('i');
    icon.className = shelf.icon;
    icon.style.color = '#8b5cf6';

    const title = document.createElement('h2');
    title.textContent = `${shelf.title} (${books.length})`;

    header.appendChild(icon);
    header.appendChild(title);
    section.appendChild(header);

    if (books.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = `No books in ${shelf.title.toLowerCase()} yet.`;
        emptyMsg.style.color = '#9a9a9a';
        emptyMsg.style.fontStyle = 'italic';
        section.appendChild(emptyMsg);
        return section;
    }

    const rowScroll = document.createElement('div');
    rowScroll.className = 'genre-row-scroll';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'genre-book-item';
        bookItem.onclick = () => {
            localStorage.setItem("selectedBook", JSON.stringify(book));
            window.location.href = "book.html";
        };

        bookItem.innerHTML = `
            <div class="genre-book-cover">
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="genre-book-metadata">
                <div class="genre-book-title">${book.title}</div>
                <div class="genre-book-author">by ${book.author}</div>
            </div>
        `;

        rowScroll.appendChild(bookItem);
    });

    section.appendChild(rowScroll);
    return section;
}

function loadActivityTimeline() {
    const activities = getActivities();
    const activityList = document.getElementById('activityList');

    if (activities.length === 0) {
        activityList.innerHTML = '<p style="color: #9a9a9a; font-style: italic;">No recent activity.</p>';
        return;
    }

    activities.slice(0, 10).forEach(activity => { // Show last 10 activities
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.style.padding = '12px 0';
        item.style.borderBottom = '1px solid #f3f4f6';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '12px';

        const icon = document.createElement('i');
        icon.className = getActivityIcon(activity.action);
        icon.style.color = '#8b5cf6';
        icon.style.width = '20px';

        const text = document.createElement('span');
        text.textContent = activity.description;
        text.style.flex = '1';

        const time = document.createElement('span');
        time.textContent = formatTimeAgo(new Date(activity.timestamp));
        time.style.color = '#9a9a9a';
        time.style.fontSize = '0.9rem';

        item.appendChild(icon);
        item.appendChild(text);
        item.appendChild(time);
        activityList.appendChild(item);
    });
}

function getActivities() {
    const stored = localStorage.getItem('activities');
    return stored ? JSON.parse(stored) : [];
}

function getActivityIcon(action) {
    const icons = {
        'added_to_read': 'fas fa-check-circle',
        'recommended': 'fas fa-bullhorn',
        'removed_recommendation': 'fas fa-bullhorn',
        'added_to_favorites': 'fas fa-heart',
        'reviewed': 'fas fa-star',
        'added_to_dnf': 'fas fa-times-circle',
        'added_to_tbr': 'fas fa-bookmark'
    };
    return icons[action] || 'fas fa-book';
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Utility functions to add books to shelves (can be called from other pages)
function addToShelf(shelfKey, book) {
    const books = getShelfBooks(shelfKey);
    if (!books.find(b => b.title === book.title)) {
        books.push(book);
        localStorage.setItem(shelfKey, JSON.stringify(books));
        addActivity(`added_to_${shelfKey.replace('Books', '').toLowerCase()}`, `Added "${book.title}" to ${shelfKey.replace('Books', '')}`);
    }
}

function addActivity(action, description) {
    const activities = getActivities();
    activities.unshift({
        action,
        description,
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 activities
    if (activities.length > 50) activities.splice(50);
    localStorage.setItem('activities', JSON.stringify(activities));
}
 const profileToggle = document.getElementById('profileToggle');
        const profileMenu = document.querySelector('.profile-menu');

        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = profileMenu.classList.toggle('open');
            profileToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target)) {
                profileMenu.classList.remove('open');
                profileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                profileMenu.classList.remove('open');
                profileToggle.setAttribute('aria-expanded', 'false');
            }
        });