let words = [];
let currentIndex = 0;
let direction = localStorage.getItem('cardDirection') || 'foreign-first';

const card = document.getElementById('card');
const front = document.getElementById('front');
const back = document.getElementById('back');

function loadCSV(path) {
  return fetch(path)
    .then(response => response.text())
    .then(text => {
      return text.trim().split('\n').map(line => {
        const [foreign, russian] = line.split(',');
        return { foreign: foreign.trim(), russian: russian.trim() };
      });
    });
}

function showWord(index) {
  if (index < 0 || index >= words.length) return;

  if (direction === 'foreign-first') {
    front.textContent = words[index].foreign;
    back.textContent = words[index].russian;
  } else {
    front.textContent = words[index].russian;
    back.textContent = words[index].foreign;
  }

  card.classList.remove('flipped');
}

function setDirection(newDirection) {
  direction = newDirection;
  localStorage.setItem('cardDirection', direction); // 💾 сохраняем выбор
  updateActiveButton();
  showWord(currentIndex);
}

function updateActiveButton() {
  document.getElementById('btn-foreign-first').classList.remove('active');
  document.getElementById('btn-russian-first').classList.remove('active');

  if (direction === 'foreign-first') {
    document.getElementById('btn-foreign-first').classList.add('active');
  } else {
    document.getElementById('btn-russian-first').classList.add('active');
  }
}

card.addEventListener('click', () => {
  card.classList.toggle('flipped');
});

// Swipe обработка
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

loadCSV('words.csv').then(data => {
  words = data;
  updateActiveButton();
  showWord(currentIndex);
});
