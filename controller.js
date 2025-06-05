let words = [];
let currentIndex = 0;
let direction = localStorage.getItem('direction') || 'es-ru';

const card = document.getElementById('card');
const front = document.getElementById('front');
const back = document.getElementById('back');
const counterFront = document.getElementById('counter-front');
const counterBack = document.getElementById('counter-back');
const btnEsRu = document.getElementById('btn-es-ru');
const btnRuEs = document.getElementById('btn-ru-es');

let hiddenIndices = JSON.parse(localStorage.getItem('hidden') || '[]');

function isHidden(index) {
  return hiddenIndices.includes(index);
}

function saveHidden() {
  localStorage.setItem('hidden', JSON.stringify(hiddenIndices));
}

function getNextVisibleIndex(start) {
  let i = start;
  let attempts = 0;
  do {
    i = (i + 1) % words.length;
    attempts++;
  } while (isHidden(i) && attempts < words.length);
  return i;
}

function getPrevVisibleIndex(start) {
  let i = start;
  let attempts = 0;
  do {
    i = (i - 1 + words.length) % words.length;
    attempts++;
  } while (isHidden(i) && attempts < words.length);
  return i;
}


function loadCSV(path) {
  return fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(text => {
      return text
        .trim()
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const [foreign, russian] = line.split(';');
          return {
            foreign: foreign?.trim() || '',
            russian: russian?.trim() || ''
          };
        });
    });
}

function showWord(index) {
  if (words.length === 0) return;

  // Найдём следующий видимый индекс
  let attempts = 0;
  while (isHidden(index) && attempts < words.length) {
    index = (index + 1) % words.length;
    attempts++;
  }
  currentIndex = index;

  const word = words[currentIndex];
  const frontText = document.getElementById('text-front');
  const backText = document.getElementById('text-back');
  const counterFront = document.getElementById('counter-front');
  const counterBack = document.getElementById('counter-back');

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

function updateButtons() {
  if (direction === 'es-ru') {
    btnEsRu.classList.add('active');
    btnRuEs.classList.remove('active');
  } else {
    btnRuEs.classList.add('active');
    btnEsRu.classList.remove('active');
  }
}

btnEsRu.addEventListener('click', () => {
  direction = 'es-ru';
  localStorage.setItem('direction', direction);
  updateButtons();
  showWord(currentIndex);
});

btnRuEs.addEventListener('click', () => {
  direction = 'ru-es';
  localStorage.setItem('direction', direction);
  updateButtons();
  showWord(currentIndex);
});

card.addEventListener('click', () => {
  card.classList.toggle('flipped');
});

// Свайпы
let startX = null;

card.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].clientX;
}, false);

card.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX !== null && Math.abs(endX - startX) > 50) {
    if (endX < startX) {
  currentIndex = getPrevVisibleIndex(currentIndex);
} else {
  currentIndex = getNextVisibleIndex(currentIndex);
}

    showWord(currentIndex);
  }
  startX = null;
}, false);

// Клавиши ←, →, ↑, ↓
document.getElementById('btn-hide').addEventListener('click', () => {
  if (!hiddenIndices.includes(currentIndex)) {
    hiddenIndices.push(currentIndex);
    saveHidden();
  }
  currentIndex = (currentIndex + 1) % words.length;
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


document.getElementById('btn-reset').addEventListener('click', () => {
  hiddenIndices = [];
  saveHidden();
  showWord(currentIndex);
});

loadCSV('words.csv')
  .then(data => {
    words = data;
    updateButtons();
    showWord(currentIndex);
  })
  .catch(error => {
    front.firstChild.textContent = 'Ошибка загрузки';
    console.error('Ошибка при загрузке слов:', error);
  });
