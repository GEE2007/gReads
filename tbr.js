// TBR Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  renderTbr();

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
});

function loadTbr() {
  const stored = JSON.parse(localStorage.getItem('tbr')) || [];
  return Array.isArray(stored) ? stored : [];
}

function saveTbr(books) {
  localStorage.setItem('tbr', JSON.stringify(books));
}

function renderTbr() {
  const books = loadTbr();
  const content = document.getElementById('tbrContent');

  if (books.length === 0) {
    renderEmptyState();
    return;
  }

  let html = '<div class="tbr-grid">';

  books.forEach((book, index) => {
    const isRead = book.read || false;
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
  const action = e.target.dataset.action;
  const index = parseInt(e.target.dataset.index);
  const books = loadTbr();
  const book = books[index];

  if (!book) return;

  if (action === 'open') {
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = 'book.html';
    return;
  }

  if (action === 'remove') {
    books.splice(index, 1);
    saveTbr(books);
    renderTbr();
    return;
  }

  if (action === 'read') {
    book.read = !book.read;
    saveTbr(books);
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