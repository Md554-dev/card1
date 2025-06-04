let words = [];
let currentIndex = 0;
const card = document.getElementById('card');
const front = document.getElementById('front');
const back = document.getElementById('back');

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
  front.textContent = words[index].foreign;
  back.textContent = words[index].russian;
  card.classList.remove('flipped');
}

card.addEventListener('click', () => {
  card.classList.toggle('flipped');
});

// Обработка свайпов
let startX = null;

card.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].clientX;
}, false);

card.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX !== null && Math.abs(endX - startX) > 50) {
    if (endX < startX) {
      // Свайп влево — предыдущая карточка
      currentIndex = (currentIndex - 1 + words.length) % words.length;
    } else {
      // Свайп вправо — следующая карточка
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
    showWord(currentIndex);
  })
  .catch(error => {
    front.textContent = 'Ошибка загрузки';
    console.error('Ошибка при загрузке слов:', error);
  });
