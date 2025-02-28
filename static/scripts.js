let selectedTemplate = '';

// Получаем все поля ввода в выпадающих списках
const searchInputs = document.querySelectorAll('.dropdown-menu');

// Получаем элементы
const searchInput = document.getElementById('general-search');
const searchResults = document.getElementById('search-results');
const allItems = document.querySelectorAll('.dropdown-item');

// Функция поиска
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase(); // Получаем текст из поля поиска
    searchResults.innerHTML = ''; // Очищаем предыдущие результаты

    // Если текст пустой, ничего не показываем
    if (!searchTerm) {
        searchResults.classList.remove('show');
        return;
    }

    searchResults.classList.add('show'); // Показываем список результатов

    // Фильтруем элементы и добавляем подходящие в результаты
    allItems.forEach(function (item) {
        const text = item.textContent.toLowerCase(); // Текст элемента
        if (text.includes(searchTerm)) {
            const resultItem = document.createElement('button'); // Создаём кнопку
            resultItem.type = 'button'; // Устанавливаем тип кнопки
            resultItem.className = 'dropdown-item'; // Используем стили выпадающих списков
            resultItem.textContent = item.textContent; // Текст кнопки
            resultItem.onclick = () => window.location.href = item.href; // Добавляем поведение при клике
            searchResults.appendChild(resultItem); // Добавляем элемент в контейнер результатов
        }
    });

    // Если ничего не найдено
    if (!searchResults.innerHTML) {
        const noResult = document.createElement('div');
        noResult.className = 'dropdown-item text-muted';
        noResult.textContent = 'Ничего не найдено';
        searchResults.appendChild(noResult);
    }
});

// Скрываем результаты, если поиск пуст
searchInput.addEventListener('blur', function () {
    setTimeout(() => searchResults.classList.remove('show'), 200); // Скроем через задержку, чтобы успел сработать клик
});

// Показываем результаты при фокусе
searchInput.addEventListener('focus', function () {
    if (searchInput.value) {
        searchResults.classList.add('show'); // Показываем результаты при повторном фокусе
    }
});

// --------------------------------------------------------------------- Выбор документа

// Блок для отображения содержимого
const contentDiv = document.getElementById('qwerty');

// Шаблоны документов
const documentFields = {
    'Трудовой договор': [
        { label: 'Дата заявления', type: 'date', id: 'date-statement' },
        { label: 'ФИО заявителя', type: 'text', id: 'applicant-name' },
        { label: 'Наименование организации', type: 'text', id: 'organization-name' },
        { label: 'Город', type: 'text', id: 'city' },
    ]
};

function handleDocumentSelection(event) {
    // Проверяем, был ли клик по элементу .dropdown-item
    if (event.target.classList.contains('dropdown-item')) {
        event.preventDefault(); // Останавливаем стандартное действие (переход по ссылке)

        // Получаем значение атрибута data-type (если оно есть) или определяем тип по тексту
        const type = event.target.getAttribute('data-type') || event.target.textContent.trim();

        const contentDiv = document.getElementById('qwerty'); // Контейнер для отображения содержимого
        contentDiv.innerHTML = ''; // Очищаем содержимое

        // Проверяем, есть ли данные для выбранного типа документа
        if (documentFields[type]) {
            const fields = documentFields[type];
            
            // Создаем форму
            const form = document.createElement('form');
            //form.classList.add('document-form', 'p-4', 'bg-light', 'rounded', 'shadow-sm'); // Добавляем стили
            form.classList.add('container', 'my-6', 'bg-light', 'rounded', 'shadow-sm'); // Добавляем стили
          

          
            contentDiv.appendChild(form); // Добавляем форму в контейнер
          } else {
            // Если данных для типа документа нет
            contentDiv.innerHTML = `<p>Для выбранного типа документа нет данных для отображения.</p>`;
        }
    }
}

searchInputs.forEach(menu => {
    menu.addEventListener('click', handleDocumentSelection);
});

