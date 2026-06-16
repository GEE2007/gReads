const book = JSON.parse(localStorage.getItem("selectedBook"));

if (!book) {
  window.location.href = "index.html";
}

const img = document.querySelector(".book-img");
const title = document.querySelector(".book-title");
const desc = document.querySelector(".book-desc");
const genres = document.querySelector(".tags");

img.src = book.image;
title.textContent = book.title;
desc.textContent = book.desc;
book.genre.forEach(g => {
  const span = document.createElement("span");
  span.textContent = g;
  span.classList.add("genre-tag");
  genres.appendChild(span);
});

const author = document.querySelector(".author");
author.textContent = "by " + book.author;
const tropesBox = document.querySelector(".tropes");

if(book.tropes){
  book.tropes.forEach(trope => {
    const span = document.createElement("span");
    span.textContent = trope;
    span.classList.add("trope-tag");
    tropesBox.appendChild(span);
  });
}
document.querySelector(".playlist-link").href = book.playlist;

// Button logic
const tbrBtn = document.querySelector(".tbr-btn");
const readBtn = document.querySelector(".read-btn");
const dnfBtn = document.querySelector(".dnf-btn");

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

function isInShelf(shelfKey, book) {
  return getShelfBooks(shelfKey).some(b => b.title === book.title);
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

// Initialize button states on page load
function initializeButtons() {
  const isInTBR = window.shelfManager.isInTBR(book);
  const isRead = isInShelf('readBooks', book);
  const isDNF = isInShelf('dnf', book);

  if (isInTBR) {
    tbrBtn.textContent = "Added ✓";
    tbrBtn.classList.add('active');
  } else {
    tbrBtn.textContent = "Add to TBR";
    tbrBtn.classList.remove('active');
  }

  if (isRead) {
    readBtn.textContent = "Read ✓";
    readBtn.classList.add('active');
  } else {
    readBtn.textContent = "Mark as Read";
    readBtn.classList.remove('active');
  }

  if (isDNF) {
    dnfBtn.textContent = "DNF ✓";
    dnfBtn.classList.add('active');
  } else {
    dnfBtn.textContent = "Mark as DNF";
    dnfBtn.classList.remove('active');
  }
}

// TBR Button Toggle
tbrBtn.addEventListener("click", () => {
  if (window.shelfManager.isInTBR(book)) {
    window.shelfManager.removeFromTBR(book);
    tbrBtn.textContent = "Add to TBR";
    tbrBtn.classList.remove('active');
    addActivity('removed_from_tbr', `Removed "${book.title}" from TBR`);
  } else {
    window.shelfManager.addToTBR(book);
    tbrBtn.textContent = "Added ✓";
    tbrBtn.classList.add('active');
    addActivity('added_to_tbr', `Added "${book.title}" to TBR`);
  }
});

// Read Button Toggle
readBtn.addEventListener("click", () => {
  if (isInShelf('readBooks', book)) {
    // Remove from Read
    removeFromShelf('readBooks', book);
    readBtn.textContent = "Mark as Read";
    readBtn.classList.remove('active');
    addActivity('removed_from_read', `Removed "${book.title}" from Read`);
  } else {
    // Add to Read
    addToShelf('readBooks', book);
    readBtn.textContent = "Read ✓";
    readBtn.classList.add('active');
    // Remove from TBR and DNF if present
    window.shelfManager.removeFromTBR(book);
    removeFromShelf('dnf', book);
    tbrBtn.textContent = "Add to TBR";
    tbrBtn.classList.remove('active');
    dnfBtn.textContent = "Mark as DNF";
    dnfBtn.classList.remove('active');
    addActivity('marked_as_read', `Marked "${book.title}" as read`);
  }
});

// DNF Button Toggle
dnfBtn.addEventListener("click", () => {
  if (isInShelf('dnf', book)) {
    // Remove from DNF
    removeFromShelf('dnf', book);
    dnfBtn.textContent = "Mark as DNF";
    dnfBtn.classList.remove('active');
    addActivity('removed_from_dnf', `Removed "${book.title}" from DNF`);
  } else {
    // Add to DNF
    addToShelf('dnf', book);
    dnfBtn.textContent = "DNF ✓";
    dnfBtn.classList.add('active');
    // Remove from TBR and Read if present
    window.shelfManager.removeFromTBR(book);
    removeFromShelf('readBooks', book);
    tbrBtn.textContent = "Add to TBR";
    tbrBtn.classList.remove('active');
    readBtn.textContent = "Mark as Read";
    readBtn.classList.remove('active');
    addActivity('marked_as_dnf', `Marked "${book.title}" as DNF`);
  }
});

// Initialize on load
initializeButtons();

// Sample reviews with usernames and ratings
const sampleReviews = [
  {
    username: "Sarah Mitchell",
    rating: 5,
    text: "Couldn't put this down! The character development was absolutely incredible and kept me hooked until the very last page."
  },
  {
    username: "James Chen",
    rating: 5,
    text: "One more chapter became five... then ten. I finished this in one sitting. Absolutely loved every moment of it."
  },
  {
    username: "Emma Rodriguez",
    rating: 4,
    text: "Such an engaging story! I'm now emotionally attached to these characters. Highly recommend to anyone looking for a great read."
  },
  {
    username: "David Park",
    rating: 5,
    text: "A masterpiece! The writing is so compelling and the plot twists had me totally surprised. Already recommended to all my friends."
  },
  {
    username: "Lisa Anderson",
    rating: 4,
    text: "Really enjoyed this book. The pacing was perfect and the world-building was phenomenal. Would definitely read more from this author."
  }
];

// Function to generate star rating HTML
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '⭐' : '☆';
  }
  return stars;
}

// Function to generate avatar initials
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatReviewDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const reviewStorageKey = `geeReads-reviews-${book.title}`;
let userReviews = JSON.parse(localStorage.getItem(reviewStorageKey)) || [];

const reviewsContainer = document.querySelector(".reviews-container");
const starButtons = document.querySelectorAll(".review-star");
const reviewTextarea = document.getElementById("review-textarea");
const submitReviewBtn = document.querySelector(".submit-review-btn");
let selectedRating = 0;

function updateStarDisplay(rating) {
  starButtons.forEach(star => {
    const value = Number(star.dataset.value);
    const isActive = value <= rating;
    star.classList.toggle('selected', isActive);
    star.textContent = isActive ? '★' : '☆';
  });
}

function renderReviews() {
  reviewsContainer.innerHTML = '';
  const allReviews = [...userReviews, ...sampleReviews];

  allReviews.forEach(review => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review-item");

    const initials = getInitials(review.username);
    const dateHtml = review.date ? `<span class="review-date">${formatReviewDate(review.date)}</span>` : '';

    reviewDiv.innerHTML = `
      <div class="review-header">
        <div class="review-user-meta">
          <div class="review-avatar">${initials}</div>
          <div class="review-user-text">
            <strong class="review-username">${review.username}</strong>
            ${dateHtml}
          </div>
        </div>
        <span class="review-rating">${generateStars(review.rating)}</span>
      </div>
      <p class="review-text">${review.text}</p>
    `;

    reviewsContainer.appendChild(reviewDiv);
  });
}

starButtons.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = Number(star.dataset.value);
    updateStarDisplay(selectedRating);
  });

  star.addEventListener('mouseover', () => {
    updateStarDisplay(Number(star.dataset.value));
  });

  star.addEventListener('mouseout', () => {
    updateStarDisplay(selectedRating);
  });
});

submitReviewBtn.addEventListener('click', () => {
  const reviewText = reviewTextarea.value.trim();
  if (!selectedRating || !reviewText) {
    alert('Please select a star rating and write a review before submitting.');
    return;
  }

  const newReview = {
    username: 'You',
    rating: selectedRating,
    text: reviewText,
    date: new Date().toISOString()
  };

  userReviews.unshift(newReview);
  localStorage.setItem(reviewStorageKey, JSON.stringify(userReviews));

  // Add to reviewed shelf
  addToShelf('reviewed', book);
  addActivity('reviewed_book', `Reviewed "${book.title}"`);

  renderReviews();

  reviewTextarea.value = '';
  selectedRating = 0;
  updateStarDisplay(selectedRating);
});

renderReviews();