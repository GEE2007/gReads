// Genre Page - Dynamic Row Generation

document.addEventListener('DOMContentLoaded', function() {
  renderGenreRows();
});

function renderGenreRows() {
  const container = document.getElementById('genreRows');
  container.innerHTML = '';

  // Get all unique genres
  const genres = new Set();
  books.forEach(book => {
    if (book.genre && Array.isArray(book.genre)) {
      book.genre.forEach(g => genres.add(g));
    }
  });

  // Sort genres alphabetically
  const sortedGenres = Array.from(genres).sort();

  // Create a row for each genre
  sortedGenres.forEach(genreName => {
    // Get books for this genre
    const booksInGenre = books.filter(book => 
      book.genre && book.genre.includes(genreName)
    );

    // Skip if no books in genre
    if (booksInGenre.length === 0) return;

    // Create section
    const section = document.createElement('div');
    section.className = 'genre-section';

    // Add title
    const title = document.createElement('h2');
    title.textContent = genreName;
    section.appendChild(title);

    // Create scroll container
    const scrollRow = document.createElement('div');
    scrollRow.className = 'genre-row-scroll';

    // Add book covers with metadata
    booksInGenre.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.className = 'genre-book-item';

      // Cover image
      const coverDiv = document.createElement('div');
      coverDiv.className = 'genre-book-cover';
      coverDiv.title = book.title;

      const img = document.createElement('img');
      img.src = book.image || 'images/placeholder.jpg';
      img.alt = book.title;

      coverDiv.appendChild(img);

      // Add click handler to cover
      coverDiv.addEventListener('click', () => {
        localStorage.setItem('selectedBook', JSON.stringify(book));
        window.location.href = 'book.html';
      });

      // Book metadata
      const metadata = document.createElement('div');
      metadata.className = 'genre-book-metadata';

      const titleEl = document.createElement('div');
      titleEl.className = 'genre-book-title';
      titleEl.textContent = book.title;

      const authorEl = document.createElement('div');
      authorEl.className = 'genre-book-author';
      authorEl.textContent = book.author || 'Unknown Author';

      const ratingEl = document.createElement('div');
      ratingEl.className = 'genre-book-rating';
      ratingEl.textContent = '⭐ 4.6';

      metadata.appendChild(titleEl);
      metadata.appendChild(authorEl);
      metadata.appendChild(ratingEl);

      // Assemble item
      bookItem.appendChild(coverDiv);
      bookItem.appendChild(metadata);

      scrollRow.appendChild(bookItem);
    });

    section.appendChild(scrollRow);
    container.appendChild(section);
  });
}