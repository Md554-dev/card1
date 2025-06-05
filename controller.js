let words = [];
let currentIndex = 0;
let direction = localStorage.getItem('direction') || 'es-ru';

const card = document.getElementById('card');
const front = document.getElementById('front');
const back = document.getElementById('back');
const btnEsRu = document.getElementById('btn-es-ru');
const btnRuEs = document.getElementById('btn-ru-es');

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
  if (index < 0 || index >= words.length) return;
  const word = words[index];
  if (direction === 'es-ru') {
    front.textContent = word.foreign;
    back.textContent = word.russian;
  } else {
    front.textContent = word.russian;
    back.textContent = word.foreign;
  }
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
      currentIndex = (currentIndex - 1 + words.length) % words.length;
    } else {
      currentIndex = (currentIndex + 1) % words.length;
    }
    showWord(currentIndex);
  }
  startX = null;
}, false);

// Клавиши ← и →
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    showWord(currentIndex);
  }
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % words.length;
    showWord(currentIndex);
  }
});

loadCSV('words.csv')
  .then(data => {
    words = data;
    updateButtons();
    showWord(currentIndex);
  })
  .catch(error => {
    front.textContent = 'Ошибка загрузки';
    console.error('Ошибка при загрузке слов:', error);
  });
