const clearDataBtn = document.getElementById('clearDataBtn');
const backBtn = document.getElementById('backBtn');

function clearAppData() {
  const keysToRemove = [
    'readBooks',
    'tbrBooks',
    'dnf',
    'recommendedBooks',
    'activities',
    'selectedBook'
  ];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('gReads-') || keysToRemove.includes(key)) {
      localStorage.removeItem(key);
    }
  });
}

function confirmAndClear() {
  const confirmed = window.confirm('Clear all gReads app data from localStorage? This cannot be undone.');
  if (!confirmed) return;
  clearAppData();
  window.alert('gReads local data cleared.');
}

clearDataBtn.addEventListener('click', (event) => {
  event.preventDefault();
  confirmAndClear();
});

backBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});
