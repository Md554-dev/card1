// library.js
document.addEventListener("DOMContentLoaded", () => {
  const screenCards = document.getElementById('screen-cards');
  const screenLibrary = document.getElementById('screen-library');
  const fileSelect = document.getElementById('file-select');
  const currentFileLabel = document.getElementById('current-file');

  const availableFiles = [
  'casador_de_pitones_1.csv',
  'casador_de_pitones_2.csv',
  'casador_de_pitones_3.csv',
  'casador_de_pitones_4.csv'
];

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
