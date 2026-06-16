const SHELF_STORAGE_KEY = 'tbrBooks';

function getBookIdentifier(bookOrId) {
  if (bookOrId == null) return null;
  if (typeof bookOrId === 'object') {
    return bookOrId.id || bookOrId.title || null;
  }
  return bookOrId;
}

function readTBRFromStorage() {
  const stored = JSON.parse(localStorage.getItem(SHELF_STORAGE_KEY));
  return Array.isArray(stored) ? stored : [];
}

function migrateLegacyTbrKeys() {
  const legacyKeys = ['tbr', 'TBR', 'savedBooks'];
  const combined = readTBRFromStorage();

  legacyKeys.forEach(key => {
    const legacy = JSON.parse(localStorage.getItem(key)) || [];
    if (Array.isArray(legacy)) {
      legacy.forEach(oldBook => {
        const oldId = getBookIdentifier(oldBook);
        if (oldBook && oldId && !combined.some(item => getBookIdentifier(item) === oldId)) {
          combined.push(oldBook);
        }
      });
    }
    localStorage.removeItem(key);
  });

  localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(combined));
}

function loadTBR() {
  migrateLegacyTbrKeys();
  return readTBRFromStorage();
}

function saveTBR(books) {
  localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(books));
}

function getTBR() {
  return loadTBR();
}

function addToTBR(book) {
  const id = getBookIdentifier(book);
  if (!id) return false;

  const books = loadTBR();
  if (books.some(item => getBookIdentifier(item) === id)) {
    return false;
  }

  books.push(book);
  saveTBR(books);
  return true;
}

function removeFromTBR(bookOrId) {
  const id = getBookIdentifier(bookOrId);
  if (!id) return false;

  const books = loadTBR().filter(item => getBookIdentifier(item) !== id);
  saveTBR(books);
  return true;
}

function isInTBR(bookOrId) {
  const id = getBookIdentifier(bookOrId);
  if (!id) return false;
  return loadTBR().some(item => getBookIdentifier(item) === id);
}

window.shelfManager = {
  getTBR,
  addToTBR,
  removeFromTBR,
  isInTBR
};
