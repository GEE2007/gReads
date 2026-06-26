const defaultProfileData = {
  username: 'geetika.books',
  name: 'Geetika B.',
  bio: 'Romance-first, cozy-obsessed, and always one chapter away from a new obsession.',
  followers: 182,
  following: 94,
  stats: {
    booksRead: 37,
    reviewsWritten: 21,
    avgRating: '4.6/5'
  },
  highlights: []
};

const profileImageKey = 'gReads-profile-image';

let profileData = {
  ...defaultProfileData,
  ...JSON.parse(localStorage.getItem('gReads-profile') || 'null')
};

const header = document.getElementById('profileHeader');
const highlightsGrid = document.getElementById('highlightsGrid');
const activityFeed = document.getElementById('activityFeed');
const reviewsFeed = document.getElementById('reviewsFeed');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const socialModal = document.getElementById('socialModal');
const closeModal = document.getElementById('closeModal');
const editProfileModal = document.getElementById('editProfileModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEditProfile = document.getElementById('cancelEditProfile');
const editProfileForm = document.getElementById('editProfileForm');
const editName = document.getElementById('editName');
const editUsername = document.getElementById('editUsername');
const editBio = document.getElementById('editBio');

const bookCoverMap = {
  'fourth wing': 'images/fourthwing.png',
  'the right move': 'images/rightmove.jpg',
  'the housemaid': 'images/theHousemaid.png',
  'people we meet on vacation': 'images/peopleWeMeetOnVacation.png',
  'atomic habits': 'images/atomichabits.jpg',
  'harry potter': 'images/harry potter.png',
  'iron flame': 'images/ironFlame.png',
  'a good girl\'s guide to murder': 'images/girl\'sGuideToMurder.png',
  'the emperor': 'images/emperor.webp',
  'better than the movies': 'images/betterThanMovies.png',
  'the summer i turned pretty': 'images/summerITurnedpretty.png',
  'powerless': 'images/powerless.png',
  'the 48 laws of power': 'images/power.png',
  'no excuses': 'images/noExcuses.png',
  'we\'ll always have summer': 'images/alwaysHaveSummer.png'
};

const bookAuthorMap = {
  'fourth wing': 'Rebecca Yarros',
  'the right move': 'Liz Tomforde',
  'the housemaid': 'Freida McFadden',
  'people we meet on vacation': 'Emily Henry',
  'atomic habits': 'James Clear',
  'harry potter': 'J.K. Rowling',
  'iron flame': 'Rebecca Yarros',
  'a good girl\'s guide to murder': 'Holly Jackson',
  'the emperor': 'Runyx',
  'better than the movies': 'Lynn Painter',
  'the summer i turned pretty': 'Jenny Han',
  'powerless': 'Emily Henry',
  'the 48 laws of power': 'Robert Greene',
  'no excuses': 'Ryan Holiday',
  'we\'ll always have summer': 'Jenny Han'
};

function saveProfileData() {
  localStorage.setItem('gReads-profile', JSON.stringify(profileData));
}

function getStoredProfileImage() {
  const storedImage = localStorage.getItem(profileImageKey);
  return storedImage || 'images/user.svg';
}

function showAvatarMessage(message) {
  const alertBox = document.querySelector('.avatar-alert');
  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.classList.add('visible');
  window.clearTimeout(showAvatarMessage.timeoutId);
  showAvatarMessage.timeoutId = window.setTimeout(() => {
    alertBox.classList.remove('visible');
  }, 1800);
}

function applyAvatarImage(source, { animate = true, persist = true } = {}) {
  const avatarImage = document.querySelector('.profile-avatar');
  if (!avatarImage) return;

  const resolvedSource = source || 'images/user.svg';
  if (persist) {
    localStorage.setItem(profileImageKey, resolvedSource);
  }

  avatarImage.classList.add('is-changing');
  avatarImage.src = resolvedSource;

  window.setTimeout(() => {
    avatarImage.classList.remove('is-changing');
  }, 220);
}

function getDerivedStats() {
  const readBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
  const reviewEntries = getStoredReviews();
  const ratings = reviewEntries.map((entry) => Number(entry.rating)).filter((value) => !Number.isNaN(value));
  const avgRating = ratings.length ? (ratings.reduce((sum, score) => sum + score, 0) / ratings.length).toFixed(1) : '4.6';

  return {
    booksRead: readBooks.length || profileData.stats.booksRead,
    reviewsWritten: reviewEntries.length || profileData.stats.reviewsWritten,
    avgRating: `${avgRating}/5`
  };
}

function formatRelativeTime(value) {
  if (!value) return 'just now';
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function getBookCover(title) {
  if (!title) return 'images/user.svg';
  const normalized = title.toLowerCase();
  return bookCoverMap[normalized] || 'images/user.svg';
}

function getBookAuthor(title) {
  if (!title) return 'gReads';
  const normalized = title.toLowerCase();
  return bookAuthorMap[normalized] || 'gReads';
}

function extractBookTitle(text) {
  const match = text.match(/"([^"]+)"/);
  if (match) return match[1];
  const fallback = text.split(' ').slice(-2).join(' ');
  return fallback || 'Your latest read';
}

function getStoredReviews() {
  const reviewEntries = [];
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith('gReads-reviews-')) return;
    try {
      const bookTitle = key.replace('gReads-reviews-', '');
      const storedReviews = JSON.parse(localStorage.getItem(key) || '[]');
      storedReviews.forEach((review) => {
        reviewEntries.push({
          title: bookTitle,
          rating: review.rating,
          review: review.text,
          username: review.username || 'You',
          date: review.date,
          author: getBookAuthor(bookTitle),
          image: getBookCover(bookTitle)
        });
      });
    } catch (error) {
      console.warn('Could not parse review data', error);
    }
  });
  return reviewEntries;
}

function getReadBooks() {
  const readBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
  return Array.isArray(readBooks) ? readBooks.filter((book) => book && typeof book === 'object') : [];
}

function getDerivedHighlights() {
  const readBooks = getReadBooks();
  const reviewEntries = getStoredReviews();
  const activityEntries = JSON.parse(localStorage.getItem('activities') || '[]');

  const genreCounts = {};
  const authorCounts = {};
  const ratings = reviewEntries.map((entry) => Number(entry.rating)).filter((value) => !Number.isNaN(value));

  readBooks.forEach((book) => {
    const genres = Array.isArray(book.genre)
      ? book.genre
      : typeof book.genre === 'string' && book.genre.trim()
        ? [book.genre]
        : [];

    genres.forEach((genre) => {
      const normalized = genre.trim();
      if (!normalized) return;
      genreCounts[normalized] = (genreCounts[normalized] || 0) + 1;
    });

    if (book.author) {
      const normalizedAuthor = book.author.trim();
      authorCounts[normalizedAuthor] = (authorCounts[normalizedAuthor] || 0) + 1;
    }
  });

  const favoriteGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([genre]) => genre);

  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([author]) => author);

  const averageRating = ratings.length
    ? ratings.reduce((sum, score) => sum + score, 0) / ratings.length
    : null;

  let styleLabel = 'Balanced';
  if (averageRating === null) {
    styleLabel = 'Start reading to build your profile';
  } else if (averageRating >= 4.3) {
    styleLabel = 'Generous rater';
  } else if (averageRating <= 3.4) {
    styleLabel = 'Strict rater';
  }

  const timestampEntries = [
    ...readBooks.map((book) => book.timestamp || book.date || book.addedAt).filter(Boolean),
    ...activityEntries.map((entry) => entry.timestamp).filter(Boolean),
    ...reviewEntries.map((entry) => entry.date).filter(Boolean)
  ];

  let activePeriod = '';
  if (timestampEntries.length) {
    const monthCounts = {};
    timestampEntries.forEach((value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return;
      const monthKey = date.toLocaleString('en', { month: 'long' });
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const topMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
    if (topMonth) {
      activePeriod = `${topMonth[0]} was your busiest reading month`;
    }
  }

  const cards = [];
  cards.push({
    title: 'Favorite genres',
    items: favoriteGenres.length ? favoriteGenres : ['Start reading to build your profile']
  });

  cards.push({
    title: 'Top authors',
    items: topAuthors.length ? topAuthors : ['No favorite authors yet']
  });

  cards.push({
    title: 'Reading style',
    items: averageRating === null
      ? ['Add a rating to reveal your taste']
      : [`${styleLabel} · ${averageRating.toFixed(1)}/5`, activePeriod].filter(Boolean)
  });

  return cards;
}

function getFeedItems() {
  const activityEntries = JSON.parse(localStorage.getItem('activities') || '[]');
  const reviewEntries = getStoredReviews();

  const mappedActivities = activityEntries.map((entry) => {
    const title = extractBookTitle(entry.description || entry.action || '');
    let actionLabel = 'updated their shelves';
    if (entry.action === 'reviewed_book') actionLabel = 'reviewed this book';
    else if (entry.action === 'marked_as_read') actionLabel = 'marked as read';
    else if (entry.action === 'marked_as_dnf') actionLabel = 'marked as DNF';
    else if (entry.action === 'added_to_tbr') actionLabel = 'added to TBR';
    else if (entry.action === 'recommended') actionLabel = 'recommended this book';
    else if (entry.description) actionLabel = entry.description;

    return {
      title,
      author: getBookAuthor(title),
      image: getBookCover(title),
      actionLabel,
      rating: null,
      text: entry.description || '',
      time: formatRelativeTime(entry.timestamp)
    };
  });

  const mappedReviews = reviewEntries.map((review) => ({
    title: review.title,
    author: review.author,
    image: review.image,
    actionLabel: review.username === 'You' ? 'shared a review' : 'reviewed this book',
    rating: review.rating,
    text: review.review,
    time: formatRelativeTime(review.date)
  }));

  return [...mappedReviews, ...mappedActivities]
    .sort((a, b) => new Date(b.sortTime || b.time) - new Date(a.sortTime || a.time))
    .slice(0, 8);
}

function handleAvatarSelection(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    showAvatarMessage('Please choose a JPG or PNG image.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const imageDataUrl = reader.result;
    if (typeof imageDataUrl === 'string') {
      localStorage.setItem(profileImageKey, imageDataUrl);
      applyAvatarImage(imageDataUrl, { animate: true, persist: false });
      showAvatarMessage('Photo updated');
    }
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function handleAvatarReset() {
  localStorage.removeItem(profileImageKey);
  applyAvatarImage('images/user.svg', { animate: true, persist: false });
  showAvatarMessage('Photo removed');
  renderHeader();
}

function bindHeaderActions() {
  const followBtn = document.getElementById('followBtn');
  if (followBtn) {
    followBtn.addEventListener('click', () => {
      const isFollowing = followBtn.classList.toggle('following');
      followBtn.textContent = isFollowing ? 'Following' : 'Follow';
    });
  }

  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', openEditModal);
  }
}

function bindAvatarInteractions() {
  document.addEventListener('click', (event) => {
    const avatarEditButton = event.target.closest('.avatar-edit');
    if (!avatarEditButton) return;

    event.preventDefault();
    const avatarWrap = avatarEditButton.closest('.avatar-wrap');
    const avatarInput = avatarWrap?.querySelector('.avatar-input');
    if (avatarInput) {
      avatarInput.click();
    }
  });

  document.addEventListener('click', (event) => {
    const resetButton = event.target.closest('.avatar-reset');
    if (!resetButton) return;

    event.preventDefault();
    handleAvatarReset();
  });

  document.addEventListener('change', (event) => {
    if (event.target.classList.contains('avatar-input')) {
      handleAvatarSelection(event);
    }
  });
}

function renderHeader() {
  profileData.stats = getDerivedStats();
  saveProfileData();
  const profileImage = getStoredProfileImage();

  header.innerHTML = `
    <div class="profile-top">
      <div class="avatar-wrap">
        <img src="${profileImage}" alt="Profile avatar" class="profile-avatar" />
        <input type="file" id="avatarInput" class="avatar-input" accept="image/jpeg,image/png,image/jpg" />
        <button class="avatar-reset" type="button" aria-label="Remove profile picture">Remove photo</button>
        <button class="avatar-edit" type="button" aria-label="Edit profile picture">✎</button>
        <div class="avatar-alert" role="alert" aria-live="polite"></div>
      </div>
      <div class="profile-meta">
        <div class="profile-name-row">
          <div>
            <h1>${profileData.name}</h1>
            <p class="profile-handle">@${profileData.username}</p>
          </div>
          <div class="profile-actions">
            <button class="edit-profile-btn" id="editProfileBtn" type="button">Edit profile</button>
            <button class="follow-btn" id="followBtn" type="button">Follow</button>
          </div>
        </div>
        <p class="profile-bio">${profileData.bio}</p>
        <div class="social-row">
          <button class="social-pill" type="button"><strong>${profileData.followers}</strong> followers</button>
          <button class="social-pill" type="button"><strong>${profileData.following}</strong> following</button>
        </div>
        <div class="stats-row">
          <span><strong>${profileData.stats.booksRead}</strong> books read</span>
          <span><strong>${profileData.stats.reviewsWritten}</strong> reviews written</span>
          <span><strong>${profileData.stats.avgRating}</strong> avg rating</span>
        </div>
      </div>
    </div>
  `;

  bindHeaderActions();
}

function renderHighlights() {
  const highlights = getDerivedHighlights();
  highlightsGrid.innerHTML = highlights.map((item) => `
    <article class="highlight-card">
      <h3>${item.title}</h3>
      <div class="chip-row">
        ${item.items.map((chip) => `<span class="chip">${chip}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderActivities() {
  const feedItems = getFeedItems();
  activityFeed.innerHTML = feedItems.map((activity) => `
    <article class="activity-card">
      <div class="activity-cover">
        <img src="${activity.image}" alt="${activity.title} cover" />
      </div>
      <div class="activity-content">
        <div class="activity-meta">
          <p><strong>${activity.title}</strong> · ${activity.author}</p>
          <span>${activity.time}</span>
        </div>
        <p class="activity-action">${activity.actionLabel}</p>
        ${activity.rating ? `<p class="activity-rating">${'★'.repeat(Math.round(activity.rating))} ${activity.rating.toFixed(1)}</p>` : ''}
        ${activity.text ? `<p class="activity-text">“${activity.text}”</p>` : ''}
        <div class="activity-actions">
          <button type="button"><i class="far fa-heart"></i> Like</button>
          <button type="button"><i class="far fa-comment"></i> Comment</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderReviews() {
  const reviewEntries = getStoredReviews();
  reviewsFeed.innerHTML = reviewEntries.map((review) => `
    <article class="review-card">
      <div class="review-card-top">
        <div>
          <h3>${review.title}</h3>
          <p class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
        </div>
        <div class="review-actions">
          <button type="button">Edit</button>
          <button type="button">Delete</button>
        </div>
      </div>
      <p class="review-body">${review.review}</p>
    </article>
  `).join('');
}

function switchView(view) {
  const normalizedView = view === 'activity' ? 'activity' : 'reviews';

  toggleButtons.forEach((button) => {
    const isActive = button.dataset.view === normalizedView;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  const showReviews = normalizedView === 'reviews';
  activityFeed.classList.toggle('hidden', showReviews);
  reviewsFeed.classList.toggle('hidden', !showReviews);
}

function openModal() {
  socialModal.classList.add('open');
  socialModal.setAttribute('aria-hidden', 'false');
}

function closeSocialModal() {
  socialModal.classList.remove('open');
  socialModal.setAttribute('aria-hidden', 'true');
}

function openEditModal() {
  editName.value = profileData.name;
  editUsername.value = profileData.username;
  editBio.value = profileData.bio;
  editProfileModal.classList.add('open');
  editProfileModal.setAttribute('aria-hidden', 'false');
}

function closeEditProfileModal() {
  editProfileModal.classList.remove('open');
  editProfileModal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
  bindAvatarInteractions();
  renderHeader();
  renderHighlights();
  renderActivities();
  renderReviews();
  switchView('reviews');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => switchView(button.dataset.view));
  });

  document.querySelectorAll('.social-pill').forEach((pill) => {
    pill.addEventListener('click', openModal);
  });

  closeModal.addEventListener('click', closeSocialModal);
  socialModal.addEventListener('click', (event) => {
    if (event.target === socialModal) {
      closeSocialModal();
    }
  });

  closeEditModal.addEventListener('click', closeEditProfileModal);
  cancelEditProfile.addEventListener('click', closeEditProfileModal);
  editProfileModal.addEventListener('click', (event) => {
    if (event.target === editProfileModal) {
      closeEditProfileModal();
    }
  });

  editProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    profileData.name = editName.value.trim() || profileData.name;
    profileData.username = editUsername.value.trim().replace(/\s+/g, '.') || profileData.username;
    profileData.bio = editBio.value.trim() || profileData.bio;
    saveProfileData();
    renderHeader();
    closeEditProfileModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSocialModal();
      closeEditProfileModal();
    }
  });
});
