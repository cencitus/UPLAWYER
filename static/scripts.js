const BASE_URL = 'http://127.0.0.1:5500';

let selectedTemplate = '';

// Получаем все поля ввода в выпадающих списках
const searchInputs = document.querySelectorAll('.dropdown-menu');

// Получаем элементы
const searchInput = document.getElementById('general-search');
const searchResults = document.getElementById('search-results');
const allItems = document.querySelectorAll('.dropdown-item');

const documentTypeNames = {
    'purchase&sale_agreement.docx': 'Договор купли-продажи',
    'order.docx': 'Приказ о начале разработки',
    'rasporyajenie.docx': 'Распоряжение о начале разработки',
    // Добавьте другие соответствия по мере необходимости
};

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
          
            // Проходим по каждому полю и создаем элементы ввода
            fields.forEach(field => {
              const formGroup = document.createElement('div');
              formGroup.classList.add('mb-4');
          
              const label = document.createElement('label');
              label.setAttribute('for', field.id);
              label.textContent = field.label;
              label.classList.add('form-label'); // Стиль для метки
          
              const input = document.createElement('input');
              input.setAttribute('type', field.type);
              input.setAttribute('id', field.id);
              input.classList.add('form-control'); // Класс Bootstrap для поля ввода
          
              // Добавляем элементы в форму
              formGroup.appendChild(label);
              formGroup.appendChild(input);
              form.appendChild(formGroup);
            });
          
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.classList.add('btn', 'save-button'); // Класс для кнопки
            submitButton.textContent = 'Создать документ';

            // Кнопка отправки
            const docxButton = document.createElement('button');
            docxButton.setAttribute('type', 'submit');
            docxButton.classList.add('fileButton'); // Класс для кнопки
            docxButton.textContent = 'Скачать документ .docx';

            const PDFButton = document.createElement('button');
            PDFButton.setAttribute('type', 'submit');
            PDFButton.classList.add('fileButton'); // Класс для кнопки
            PDFButton.textContent = 'Скачать документ .pdf';

            const previewContainer = document.createElement('div');
            previewContainer.setAttribute('id', 'preview-container');
            previewContainer.classList.add('my-4');
          
            form.appendChild(submitButton); 
            form.appendChild(PDFButton); 
            form.appendChild(docxButton); // Добавляем кнопку в форму
            form.appendChild(previewContainer);
          
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
            resultItem.onclick = handleDocumentSelection; // Добавляем поведение при клике
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

// Импорт шаблонов из json
let documentFields = {}

fetch('fields.json')
  .then(response => response.json())
  .then(data => {
    documentFields = data
  })
  .catch(error => {
    console.error('Ошибка загрузки JSON:', error)
  })

function generateForm(documentType) {
    const form = document.getElementById('document-form');
    form.innerHTML = ''; // Очищаем форму

    const fields = documentFields[documentType];
    if (fields) {
        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'form-group mb-3';

            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.id);

            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.className = 'form-control';

            fieldDiv.appendChild(label);
            fieldDiv.appendChild(input);
            form.appendChild(fieldDiv);
        });
    } else {
        form.innerHTML = '<p>Тип документа не поддерживается.</p>';
    }
}

// Подключение файлов шаблонов
import { prepareData as preparePurchaseData } from './templates/purchaseSale.js';
import { prepareData as prepareOrderData } from './templates/developmentOrder.js';
import { prepareData as prepareDirectiveData } from './templates/directive.js';

const prepareFunctions = {
    'Договор купли-продажи': {
        prepare: preparePurchaseData,
        endpoint: 'purchase&sale_agreement.docx'
    },
    'Приказ о начале разработки': {
        prepare: prepareOrderData,
        endpoint: 'order.docx'
    },
    'Распоряжение': {
        prepare: prepareDirectiveData,
        endpoint: 'rasporyajenie.docx'
    }
};


document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        selectedTemplate = event.target.textContent.trim();
        console.log('Выбран шаблон:', selectedTemplate);
    });
});

// Кнопка "Скачать docx"
document.addEventListener("click", async (event) => {
    if (event.target && event.target.textContent.trim() === 'Скачать документ .docx') {
        event.preventDefault();

        const form = event.target.closest("form");

        const allFieldsFilled = Array.from(form.querySelectorAll("input")).every(input => input.value.trim() !== "");
        if (!allFieldsFilled) {
            alert("Пожалуйста, заполните все поля формы");
            return;
        }

        const formData = {};
        form.querySelectorAll("input").forEach(input => {
            formData[input.id] = input.value.trim();
        });

        // Валидация ФИО
        const fioFields = ['FIO', 'FIO_boss', 'FIO_dir', 'name_of_seller', 'name_of_buyer'];
        for (const field of fioFields) {
            if (formData[field] && !/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(formData[field])) {
                alert(`Пожалуйста, введите корректное ФИО в формате "Фамилия Имя Отчество" для поля ${field}`);
                return;
            }
        }

        const templateConfig = prepareFunctions[selectedTemplate];
        if (!templateConfig) {
            alert("Шаблон не поддерживается");
            return;
        }

        try {
            const preparedData = templateConfig.prepare(formData); // тут может быть синхрон или промис
            const dataToSend = preparedData instanceof Promise ? await preparedData : preparedData;

            const response = await fetch(`${BASE_URL}/generate_d/${templateConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated_document.docx';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error("Ошибка генерации документа:", error.message);
            alert("Произошла ошибка при генерации документа. Проверь консоль");
        }
    }
});

// Кнопка "Скачать pdf"
document.addEventListener("click", async (event) => {
    if (event.target && event.target.textContent.trim() === 'Скачать документ .pdf') {
        event.preventDefault();

        const form = event.target.closest("form");

        const allFieldsFilled = Array.from(form.querySelectorAll("input")).every(input => input.value.trim() !== "");
        if (!allFieldsFilled) {
            alert("Пожалуйста, заполните все поля формы");
            return;
        }

        const formData = {};
        form.querySelectorAll("input").forEach(input => {
            formData[input.id] = input.value.trim();
        });

        // Валидация ФИО
        const fioFields = ['FIO', 'FIO_boss', 'FIO_dir', 'name_of_seller', 'name_of_buyer'];
        for (const field of fioFields) {
            if (formData[field] && !/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(formData[field])) {
                alert(`Пожалуйста, введите корректное ФИО в формате "Фамилия Имя Отчество" для поля ${field}`);
                return;
            }
        }

        const templateConfig = prepareFunctions[selectedTemplate];
        if (!templateConfig) {
            alert("Шаблон не поддерживается");
            return;
        }

        try {
            const preparedData = templateConfig.prepare(formData); // тут может быть синхрон или промис
            const dataToSend = preparedData instanceof Promise ? await preparedData : preparedData;

            const response = await fetch(`${BASE_URL}/generate_p/${templateConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated_document.pdf';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error("Ошибка генерации документа:", error.message);
            alert("Произошла ошибка при генерации документа. Проверь консоль");
        }
    }
});

// Предпросмотр документа
document.addEventListener("click", async (event) => {
    if (event.target && event.target.textContent.trim() === 'Создать документ') {
        event.preventDefault();

        const form = event.target.closest("form");
        const button = event.target;

        // Показываем лоадер
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Генерация...';

        const allFieldsFilled = Array.from(form.querySelectorAll("input")).every(input => input.value.trim() !== "");
        if (!allFieldsFilled) {
            alert("Пожалуйста, заполните все поля формы");
            return;
        }

        const formData = {};
        form.querySelectorAll("input").forEach(input => {
            formData[input.id] = input.value.trim();
        });

        // Валидация ФИО
        const fioFields = ['FIO', 'FIO_boss', 'FIO_dir', 'name_of_seller', 'name_of_buyer'];
        for (const field of fioFields) {
            if (formData[field] && !/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(formData[field])) {
                alert(`Пожалуйста, введите корректное ФИО в формате "Фамилия Имя Отчество" для поля ${field}`);
                return;
            }
        }

        const templateConfig = prepareFunctions[selectedTemplate];
        if (!templateConfig) {
            alert("Шаблон не поддерживается");
            return;
        }

        try {
            const preparedData = templateConfig.prepare(formData); // тут может быть синхрон или промис
            const dataToSend = preparedData instanceof Promise ? await preparedData : preparedData;

            const response = await fetch(`${BASE_URL}/generate_p/${templateConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const pdfUrl = window.URL.createObjectURL(blob);

            // Отображаем PDF в контейнере для предпросмотра
            const previewSector = document.getElementById('preview-container');
            previewSector.innerHTML = ''; // Очищаем контейнер

            const pdfIframe = document.createElement('iframe');
            pdfIframe.src = pdfUrl;
            pdfIframe.width = '100%';
            pdfIframe.height = '600px';
            pdfIframe.style.border = 'none';

            previewSector.appendChild(pdfIframe);
    
        } catch (error) {
            console.error("Ошибка генерации документа:", error.message);
            alert("Произошла ошибка при генерации документа. Проверь консоль");
        }
        finally {
            // Восстанавливаем кнопку
            button.disabled = false;
            button.textContent = 'Создать документ';
        }
    }
});


// Добавим глобальные переменные
let currentUser = null;
const authButton = document.querySelector('.authorize');

// Функции для работы с аутентификацией
async function login(username, password) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateAuthUI();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        return response.ok;
    } catch (error) {
        console.error('Registration error:', error);
        return false;
    }
}



async function handleLogout(e) {
    e.preventDefault();
    
    try {
        const response = await fetch(`${BASE_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            localStorage.removeItem('currentUser');
            updateAuthUI(null);
            showToast('Вы успешно вышли из системы');
        } else {
            throw new Error('Ошибка при выходе');
        }
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showToast(error.message, 'error');
    }
}


// В функции updateAuthUI (которую вызываем после входа/выхода)
function updateAuthUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userBlock = document.getElementById('userBlock');
    const historyBtn = document.getElementById('historyBtn');
    const usernameDisplay = document.getElementById('usernameDisplay');
  
    if (user) {
      loginBtn.classList.add('d-none');
      userBlock.classList.remove('d-none');
      historyBtn.classList.remove('d-none');
      usernameDisplay.textContent = user.username;
    } else {
      loginBtn.classList.remove('d-none');
      userBlock.classList.add('d-none');
      historyBtn.classList.add('d-none');
    }
  }
  
  // Обработчик кнопки "История"
  document.getElementById('historyBtn')?.addEventListener('click', () => {
    const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    historyModal.show();
    loadHistory(); // Ваша существующая функция загрузки истории
  });

// Обработчик успешного входа
function handleSuccessfulLogin(userData) {
    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    modal.hide();
    
    // Обновляем интерфейс
    updateAuthUI(userData.user);
    
    // Сохраняем данные
    localStorage.setItem('currentUser', JSON.stringify(userData.user));
    
    
    // Дополнительные действия
    console.log('Пользователь вошел:', userData.user);
    updateDocumentHistoryBadge(); // Обновляем бейдж с количеством документов
}

// Функция для обновления бейджа истории
function updateDocumentHistoryBadge() {
    fetch(`${BASE_URL}/api/history/count`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const badge = document.createElement('span');
        badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
        badge.textContent = data.count;
        
        const historyBtn = document.getElementById('historyBtn');
        historyBtn.classList.add('position-relative');
        historyBtn.appendChild(badge);
    })
    .catch(console.error);
}
  // Проверка при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      updateAuthUI(JSON.parse(savedUser));
    }
  });
  
  // Обработчик выхода
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    updateAuthUI(null);
    alert('Вы вышли из системы');
  });
  
  // Модифицируем ваш обработчик входа:
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const form = e.target;
      const username = form.querySelector('[name="username"]').value;
      const password = form.querySelector('[name="password"]').value;
  
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      const data = await response.json();
      
      if (response.ok) {
        handleSuccessfulLogin(data);
      } else {
        alert(data.error || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка: ' + error.message);
    }
  });

// Обработчики форм
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const form = e.target;
        
        // Проверяем существование элементов
        const usernameInput = form.querySelector('input[name="username"]');
        const passwordInput = form.querySelector('input[name="password"]');
        
        if (!usernameInput || !passwordInput) {
            console.error('Не найдены поля ввода!');
            alert('Ошибка формы: отсутствуют необходимые поля');
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Заполните все поля');
            return;
        }

        console.log('Отправка данных:', { username, password });
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }

        const data = await response.json();
        $('#authModal').modal('hide');
        alert(`Добро пожаловать, ${data.user?.username || 'пользователь'}!`);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert(error.message || 'Произошла ошибка при входе');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    
    if (await register(username, email, password)) {
        alert('Регистрация успешна! Теперь войдите.');
        $('#authTabs a[href="#login"]').tab('show');
    } else {
        alert('Ошибка регистрации');
    }
});


// Загрузка истории
// Функция загрузки истории документов
async function loadHistory() {
    try {
        const response = await fetch(`${BASE_URL}/api/history`, {
            credentials: 'include' // Важно для кук авторизации
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const history = await response.json();
        
        if (!Array.isArray(history)) {
            throw new Error("Некорректный формат данных");
        }

        console.log("Получена история:", history); // Для отладки
        
        renderHistory(history);

    } catch (error) {
        console.error("Ошибка загрузки истории:", error);
        alert("Не удалось загрузить историю. Проверьте консоль для деталей.");
    }
}


function renderHistory(items) {
    const tbody = document.getElementById('historyTableBody');
    
    if (!items || items.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-4">Нет данных</td>
        </tr>
        `;
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.document_name || item.template_name || 'Документ'}</td>
            <td>${documentTypeNames[item.template_name] || item.template_name}</td>
            <td>${new Date(item.generated_at).toLocaleString()}</td>
            <td>${item.file_type || 'docx'}</td>
            <td>
                <div class="d-flex gap-2">
                    <a href="${item.download_link}" class="btn btn-sm btn-primary" download>
                        Скачать
                    </a>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${item.id}">
                        Редактировать
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">
                        Удалить
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.target.getAttribute('data-id');
            deleteHistoryItem(docId);
        });
    });
    
    // Добавляем обработчики для кнопок редактирования
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const docId = e.target.getAttribute('data-id');
            restoreDocumentForm(docId);
        });
    });
}

async function deleteHistoryItem(id) {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/api/history/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Ошибка удаления');
        
        // Обновляем список после удаления
        await loadHistory();
        showToast('Документ успешно удалён');
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('Не удалось удалить документ', 'error');
    }
}


// Функция для показа уведомлений
function showToast(message, type = 'success') {
    // Реализация toast-уведомлений (можно использовать библиотеку или создать свои)
    alert(message); // Временное решение - можно заменить на красивый toast
}


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем авторизацию
    fetch(`${BASE_URL}/api/check-auth`, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.authenticated) {
            updateAuthUI(data.user);
        }
    })
    .catch(console.error);
    
    // Обработчик выхода
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                updateAuthUI(null);
            }
        } catch (error) {
            console.error('Ошибка выхода:', error);
            showToast('Ошибка при выходе', 'error');
        }
    });
});


async function restoreDocumentForm(docId) {
    try {
        // Получаем данные документа
        const response = await fetch(`${BASE_URL}/api/history/${docId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки документа');
        
        const docData = await response.json();
        
        // Закрываем модальное окно истории
        const historyModal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
        if (historyModal) historyModal.hide();
        
        // Загружаем шаблон документа
        const templateName = docData.template_name;
        const templateConfig = Object.values(prepareFunctions).find(
            config => config.endpoint === templateName
        );
        
        if (!templateConfig) {
            throw new Error('Шаблон не найден');
        }
        
        // Ищем соответствующий тип документа в наших данных
        const docType = Object.keys(prepareFunctions).find(
            key => prepareFunctions[key].endpoint === templateName
        );
        
        if (!docType) {
            throw new Error('Тип документа не поддерживается');
        }
        
        // Устанавливаем выбранный шаблон
        selectedTemplate = docType;
        
        // Очищаем контейнер и создаем новую форму
        const contentDiv = document.getElementById('qwerty');
        contentDiv.innerHTML = '';
        
        // Создаем форму вручную (аналогично handleDocumentSelection)
        if (documentFields[docType]) {
            const fields = documentFields[docType];
          
            const form = document.createElement('form');
            form.classList.add('container', 'my-6', 'bg-light', 'rounded', 'shadow-sm');
          
            fields.forEach(field => {
              const formGroup = document.createElement('div');
              formGroup.classList.add('mb-4');
          
              const label = document.createElement('label');
              label.setAttribute('for', field.id);
              label.textContent = field.label;
              label.classList.add('form-label');
          
              const input = document.createElement('input');
              input.setAttribute('type', field.type);
              input.setAttribute('id', field.id);
              input.classList.add('form-control');
          
              formGroup.appendChild(label);
              formGroup.appendChild(input);
              form.appendChild(formGroup);
            });
          
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.classList.add('btn', 'save-button');
            submitButton.textContent = 'Создать документ';

            const docxButton = document.createElement('button');
            docxButton.setAttribute('type', 'submit');
            docxButton.classList.add('fileButton');
            docxButton.textContent = 'Скачать документ .docx';

            const PDFButton = document.createElement('button');
            PDFButton.setAttribute('type', 'submit');
            PDFButton.classList.add('fileButton');
            PDFButton.textContent = 'Скачать документ .pdf';

            const previewContainer = document.createElement('div');
            previewContainer.setAttribute('id', 'preview-container');
            previewContainer.classList.add('my-4');
          
            form.appendChild(submitButton); 
            form.appendChild(PDFButton); 
            form.appendChild(docxButton);
            form.appendChild(previewContainer);
          
            contentDiv.appendChild(form);
            
            // Заполняем форму данными
            if (docData.form_data) {
                Object.entries(docData.form_data).forEach(([fieldId, value]) => {
                    const input = form.querySelector(`#${fieldId}`);
                    if (input) {
                        input.value = value;
                    }
                });
            }
        } else {
            contentDiv.innerHTML = `<p>Для выбранного типа документа нет данных для отображения.</p>`;
        }
        
    } catch (error) {
        console.error('Ошибка восстановления формы:', error);
        alert('Не удалось восстановить форму: ' + error.message);
    }
}



// Инициализация
updateAuthUI();