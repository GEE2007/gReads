// Utility functions for shelf management
function getShelfBooks(shelfKey) {
  const stored = localStorage.getItem(shelfKey);
  return stored ? JSON.parse(stored) : [];
}

function saveShelfBooks(shelfKey, books) {
  localStorage.setItem(shelfKey, JSON.stringify(books));
}

function addToShelf(shelfKey, book) {
  const books = getShelfBooks(shelfKey);
  if (!books.some(b => b.title === book.title)) {
    books.push(book);
    saveShelfBooks(shelfKey, books);
  }
}

function removeFromShelf(shelfKey, book) {
  const books = getShelfBooks(shelfKey);
  const index = books.findIndex(b => b.title === book.title);
  if (index !== -1) {
    books.splice(index, 1);
    saveShelfBooks(shelfKey, books);
  }
}

function addActivity(action, description) {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.unshift({
    action,
    description,
    timestamp: new Date().toISOString()
  });
  // Keep only last 50 activities
  if (activities.length > 50) activities.splice(50);
  localStorage.setItem('activities', JSON.stringify(activities));
}

function checkShelfManager() {
  if (!window.shelfManager) {
    console.error('shelfManager is required for TBR rendering.');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  // Profile dropdown
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

  if (checkShelfManager()) {
    renderTbr();
  }
});

function renderTbr() {
  if (!checkShelfManager()) return;

  const books = window.shelfManager.getTBR();
  const content = document.getElementById('tbrContent');

  if (books.length === 0) {
    renderEmptyState();
    return;
  }

  let html = '<div class="tbr-grid">';

  books.forEach((book, index) => {
    const isRead = getShelfBooks('readBooks').some(b => b.title === book.title);
    html += `
      <div class="tbr-card">
        <div class="tbr-cover-container">
          <img src="${book.image || 'images/placeholder.jpg'}" alt="${book.title}" class="tbr-cover">
          <div class="tbr-menu" data-index="${index}">
            <i class="fas fa-ellipsis-v"></i>
            <div class="tbr-menu-dropdown">
              <a href="#" data-action="remove" data-index="${index}">Remove from TBR</a>
              <a href="#" data-action="review" data-index="${index}">Write a Review</a>
              <a href="#" data-action="rate" data-index="${index}">Rate Book</a>
              <a href="#" data-action="author" data-index="${index}">View Author</a>
              <a href="#" data-action="playlist" data-index="${index}">View Playlist</a>
            </div>
          </div>
        </div>
        <h3 class="tbr-title">${book.title || 'Untitled'}</h3>
        <div class="tbr-actions">
          <button class="tbr-btn tbr-btn-secondary" data-action="read" data-index="${index}">${isRead ? 'Read ✓' : 'Mark as Read'}</button>
          <button class="tbr-btn tbr-btn-primary" data-action="open" data-index="${index}">Open Book</button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  content.innerHTML = html;

  // Attach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  // Menu toggle
  document.querySelectorAll('.tbr-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = menu.querySelector('.tbr-menu-dropdown');
      const isOpen = menu.classList.toggle('open');
      // Close other menus
      document.querySelectorAll('.tbr-menu.open').forEach(other => {
        if (other !== menu) {
          other.classList.remove('open');
        }
      });
    });
  });

  // Close menus on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.tbr-menu.open').forEach(menu => {
      menu.classList.remove('open');
    });
  });

  // Action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleAction);
  });
}

function handleAction(e) {
  e.preventDefault();
  if (!checkShelfManager()) return;

  const action = e.target.dataset.action;
  const index = parseInt(e.target.dataset.index);
  const books = window.shelfManager.getTBR();
  const book = books[index];

  if (!book) return;

  if (action === 'open') {
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = 'book.html';
    return;
  }

  if (action === 'remove') {
    window.shelfManager.removeFromTBR(book);
    renderTbr();
    return;
  }

  if (action === 'read') {
    // Toggle read status
    if (getShelfBooks('readBooks').some(b => b.title === book.title)) {
      // Remove from read
      removeFromShelf('readBooks', book);
      addActivity('removed_from_read', `Removed "${book.title}" from Read`);
    } else {
      // Add to read
      addToShelf('readBooks', book);
      // Remove from TBR and DNF
      window.shelfManager.removeFromTBR(book);
      removeFromShelf('dnf', book);
      addActivity('marked_as_read', `Marked "${book.title}" as read`);
    }
    renderTbr();
    return;
  }

  if (action === 'review' || action === 'rate') {
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = 'book.html';
    // Could scroll to review section, but for now just navigate
    return;
  }

  if (action === 'author') {
    alert(`Author: ${book.author || 'Unknown'}`);
    return;
  }

  if (action === 'playlist') {
    if (book.playlist) {
      window.open(book.playlist, '_blank');
    } else {
      alert('No playlist available for this book.');
    }
    return;
  }
}

function renderEmptyState() {
  const content = document.getElementById('tbrContent');
  content.innerHTML = `
    <div class="tbr-empty">
      <h2>Your TBR is empty</h2>
      <p>Start adding books to your TBR from the Explore page or book detail pages.</p>
      <a href="explore.html" class="tbr-empty-btn">Explore Books</a>
    </div>
  `;
}