// controller.js
let words = [];
let currentIndex = 0;
let selectedFile = localStorage.getItem('selectedFile') || 'words1.csv';
let direction = localStorage.getItem('direction_' + selectedFile) || 'es-ru';
let hiddenIndices = JSON.parse(localStorage.getItem('hidden_' + selectedFile) || '[]');

const card = document.getElementById('card');
const frontText = document.getElementById('text-front');
const backText = document.getElementById('text-back');
const counterFront = document.getElementById('counter-front');
const counterBack = document.getElementById('counter-back');

const btnEsRu = document.getElementById('btn-es-ru');
const btnRuEs = document.getElementById('btn-ru-es');

function isHidden(index) {
  return hiddenIndices.includes(index);
}
function saveHidden() {
  localStorage.setItem('hidden_' + selectedFile, JSON.stringify(hiddenIndices));
}
function saveDirection() {
  localStorage.setItem('direction_' + selectedFile, direction);
}
function getNextVisibleIndex(start) {
  let i = start, attempts = 0;
  do {
    i = (i + 1) % words.length;
    attempts++;
  } while (isHidden(i) && attempts < words.length);
  return i;
}
function getPrevVisibleIndex(start) {
  let i = start, attempts = 0;
  do {
    i = (i - 1 + words.length) % words.length;
    attempts++;
  } while (isHidden(i) && attempts < words.length);
  return i;
}
function updateButtons() {
  if (btnEsRu && btnRuEs) {
    btnEsRu.classList.toggle('active', direction === 'es-ru');
    btnRuEs.classList.toggle('active', direction === 'ru-es');
  }
}
function loadCSV(path) {
  return fetch(path).then(r => {
    if (!r.ok) throw new Error(`Ошибка загрузки: ${r.status}`);
    return r.text();
  }).then(text => {
    return text.trim().split('\n').filter(l => l.trim() !== '').map(line => {
      const [foreign, russian] = line.split(';');
      return { foreign: foreign?.trim(), russian: russian?.trim() };
    });
  });
}
function showWord(index) {
  if (!words.length) return;
  let attempts = 0;
  while (isHidden(index) && attempts < words.length) {
    index = getNextVisibleIndex(index);
    attempts++;
  }
  currentIndex = index;
  const word = words[currentIndex];
  if (direction === 'es-ru') {
    frontText.textContent = word.foreign;
    backText.textContent = word.russian;
  } else {
    frontText.textContent = word.russian;
    backText.textContent = word.foreign;
  }
  const counterText = `${currentIndex + 1} из ${words.length}`;
  counterFront.textContent = counterText;
  counterBack.textContent = counterText;
  card.classList.remove('flipped');
}

// События
if (btnEsRu && btnRuEs) {
  btnEsRu.addEventListener('click', () => {
    direction = 'es-ru';
    saveDirection();
    updateButtons();
    showWord(currentIndex);
  });

  btnRuEs.addEventListener('click', () => {
    direction = 'ru-es';
    saveDirection();
    updateButtons();
    showWord(currentIndex);
  });
}

document.getElementById('btn-hide').addEventListener('click', () => {
  if (!hiddenIndices.includes(currentIndex)) {
    hiddenIndices.push(currentIndex);
    saveHidden();
  }
  currentIndex = getNextVisibleIndex(currentIndex);
  showWord(currentIndex);
});
document.getElementById('btn-reset').addEventListener('click', () => {
  hiddenIndices = [];
  saveHidden();
  showWord(currentIndex);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    currentIndex = getPrevVisibleIndex(currentIndex);
    showWord(currentIndex);
  }
  if (e.key === 'ArrowRight') {
    currentIndex = getNextVisibleIndex(currentIndex);
    showWord(currentIndex);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    card.classList.toggle('flipped');
  }
});
card.addEventListener('click', () => {
  card.classList.toggle('flipped');
});

// Загрузка CSV и запуск
loadCSV(selectedFile).then(data => {
  words = data;
  updateButtons();
  showWord(currentIndex);
});
