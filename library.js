// library.js
document.addEventListener("DOMContentLoaded", () => {
  const screenCards = document.getElementById('screen-cards');
  const screenLibrary = document.getElementById('screen-library');
  const fileSelect = document.getElementById('file-select');
  const currentFileLabel = document.getElementById('current-file');

  const availableFiles = ['words1.csv', 'travel.csv', 'verbs.csv'];
  const selectedFile = localStorage.getItem('selectedFile') || availableFiles[0];

  availableFiles.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file;
    if (file === selectedFile) option.selected = true;
    fileSelect.appendChild(option);
  });

  currentFileLabel.textContent = selectedFile;

  document.getElementById('to-library').addEventListener('click', () => {
    screenCards.style.display = 'none';
    screenLibrary.style.display = 'flex';
  });

  document.getElementById('to-cards').addEventListener('click', () => {
    const selected = fileSelect.value;
    localStorage.setItem('selectedFile', selected);
    location.reload(); // перезагрузка с новым файлом
  });
});
