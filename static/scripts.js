let selectedTemplate = '';

const BASE_URL = 'http://127.0.0.1:5001';

//функция для валидации
function validateFormData(formData) {
    // Проверка, что все поля заполнены
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== "");
    if (!allFieldsFilled) {
        alert("Пожалуйста, заполните все поля формы.");
        return false;
    }

    // Проверка корректности ФИО (если такие поля есть)
    const fioFields = ['FIO', 'FIO_boss', 'FIO_dir', 'name_of_seller', 'name_of_buyer'];
    for (const field of fioFields) {
        if (formData[field] && !/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(formData[field])) {
            alert(`Пожалуйста, введите корректное ФИО в формате 'Фамилия Имя Отчество'.`);
            return false;
        }
    }

    // Если все проверки пройдены
    return true;
}

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
    'Договор купли-продажи': [
        { label: 'Дата заявления', type: 'date', id: 'date' },
        { label: 'Город', type: 'text', id: 'city' },
        { label: 'ФИО продавца', type: 'text', id: 'name_of_seller' },
        { label: 'ФИО покупателя', type: 'text', id: 'name_of_buyer' },
        { label: 'Название вещи', type: 'text', id: 'name_of_things' },
        { label: 'Стоимость вещи', type: 'text', id: 'cost' },
        { label: 'Количество дней для передачи товара', type: 'text', id: 'count_day' },
    ],
    'Трудовой договор': [
        { label: 'Дата заявления', type: 'date', id: 'date-statement' },
        { label: 'ФИО заявителя', type: 'text', id: 'applicant-name' },
        { label: 'Наименование организации', type: 'text', id: 'organization-name' },
        { label: 'Город', type: 'text', id: 'city' },
    ],
    'Приказ о приеме на работу': [
        { label: 'Дата заключения', type: 'date', id: 'date-contract' },
        { label: 'ФИО арендодателя', type: 'text', id: 'landlord-name' },
        { label: 'ФИО арендатора', type: 'text', id: 'tenant-name' },
        { label: 'Адрес недвижимости', type: 'text', id: 'property-address' },
    ],
    'Приказ о начале разработки' : [
        {label: 'Номер приказа', type: 'text', id: 'number_of_order' },
        {label: 'Название организации', type: 'text', id: 'name_of_organization' },
        { label: 'ОГРН', type: 'text', id: 'OGRN' },
        { label: 'ИНН', type: 'text', id: 'INN' },
        { label: 'Адрес', type: 'text', id: 'address' },
        { label: 'Город', type: 'text', id: 'city' },
        { label: 'Дата приказа', type: 'date', id: 'date' },
        { label: 'Раздел трудового договора', type: 'text', id: 'chapter' },
        { label: 'Номер трудового договора', type: 'text', id: 'number_of_TD' },
        { label: 'Дата трудового договора', type: 'date', id: 'date_of_TD' },
        { label: 'Предмет разработки', type: 'text', id: 'subject_of_dev' },
        { label: 'Срок исполнения', type: 'date', id: 'term_date' },
        { label: 'Должность исполнителя', type: 'text', id: 'post' },
        { label: 'ФИО исполнителя', type: 'text', id: 'FIO' },
        { label: 'Количество дней на выплату вознаграждения', type: 'text', id: 'count_of_day' },
        { label: 'Должность руководителя разработки', type: 'text', id: 'post_dir' },
        { label: 'ФИО руководителя разработки', type: 'text', id: 'FIO_dir' },
        { label: 'Дата служебного задания', type: 'date', id: 'date_task' },
        { label: 'Требования к ПО', type: 'text', id: 'requirements' },
        { label: 'Номер служебного задания', type: 'text', id: 'num_of_task' },
        { label: 'Должность руководителя организации', type: 'text', id: 'post_boss' },
        { label: 'ФИО руководителя организации', type: 'text', id: 'FIO_boss' },
        { label: 'Документ, на основании которого действует руководитель', type: 'text', id: 'document' },
    ],
    'Распоряжение': [
        { label: 'Название организации', type: 'text', id: 'name_of_organization' },
        {label: 'Номер распоряжения', type: 'text', id: 'number_of_order' },
        { label: 'Номер рекламной стратегии', type: 'text', id: 'num_of_task' },
        { label: 'Дата рекламной стратегии', type: 'date', id: 'date_start' },
        { label: 'Дата распоряжения', type: 'date', id: 'date' },
        { label: 'Город', type: 'text', id: 'city' },
        { label: 'ФИО маркетолога', type: 'text', id: 'FIO' },
        { label: 'Дата завершения', type: 'date', id: 'date_task' },
        { label: 'Должность отдавшего распоряжение', type: 'text', id: 'post_boss' },
        { label: 'ФИО отдавшего распоряжение', type: 'text', id: 'FIO_boss' },
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
            docxButton.classList.add('btn', 'save-button'); // Класс для кнопки
            docxButton.textContent = 'Скачать документ .docx';

            const PDFButton = document.createElement('button');
            PDFButton.setAttribute('type', 'submit');
            PDFButton.classList.add('btn', 'save-button'); // Класс для кнопки
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
            contentDiv.innerHTML = `<p class="create-text h4 mb-4" style="text-align:center; margin-top:5%;">Для выбранного типа документа нет данных для отображения.</p>`;
        }
    }
}

searchInputs.forEach(menu => {
    menu.addEventListener('click', handleDocumentSelection);
});

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        selectedTemplate = event.target.textContent.trim();
        console.log('Выбран шаблон:', selectedTemplate);
    });
});


//СКАЧАТЬ ДОК
document.addEventListener('click', async (event) => {
    // Проверяем, что нажата кнопка "Сохранить данные"
    if (event.target && event.target.textContent.trim() === 'Скачать документ .docx') {
        event.preventDefault(); // Отключаем стандартное поведение кнопки

        // Собираем данные из формы
        const form = event.target.closest("form"); // Находим текущую форму
        const formData = {};

        // Проходимся по всем элементам формы и собираем данные
        form.querySelectorAll("input").forEach(input => {
            formData[input.id] = input.value.trim(); // Используем id как ключи для данных
        });

        // Валидация данных формы
        if (!validateFormData(formData)) {
            return;
        }

        if (selectedTemplate == 'Договор купли-продажи') {
            // Сохраняем полное имя продавца
            const fullName = formData.name_of_seller;

            // Преобразуем имя продавца в формат "Фамилия И. О."
            if (fullName) {
                const sellerNameParts = fullName.split(' ');
                if (sellerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}. ${sellerNameParts[2][0]}.`;
                } else if (sellerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}.`;
                }
            }

            // Здесь сохраняем полное имя отдельно, если нужно использовать позже
            formData.full_name_of_seller = fullName;

            // Сохраняем полное имя продавца
            const fullName_b = formData.name_of_buyer;

            // Преобразуем имя продавца в формат "Фамилия И. О."
            if (fullName_b) {
                const buyerNameParts = fullName_b.split(' ');
                if (buyerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}. ${buyerNameParts[2][0]}.`;
                } else if (buyerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}.`;
                }
            }

            // Здесь сохраняем полное имя отдельно, если нужно использовать позже
            formData.full_name_of_buyer = fullName_b;


            if (formData.date) {
                const [year, month, day] = formData.date.split("-");
                formData.day = day;
                formData.month = month;
                formData.year = year;
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }

            try {
                // Отправляем POST-запрос
                const response = await fetch(`${BASE_URL}/generated/purchase%26sale_agreement.docx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                // Проверяем ответ сервера
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
                }

                // Получаем сгенерированный файл
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated_document.docx'; // Название сохраняемого файла
                a.click();

                // Очищаем временный URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } catch (error) {
                console.error("Ошибка генерации документа:", error.message);
                alert("Произошла ошибка при генерации документа. Проверьте консоль для деталей.");
            }
        } else if(selectedTemplate == 'Приказ о начале разработки'){
            if (formData.date) {
                const [year, month, day] = formData.date.split("-");
                formData.day = day;
                formData.month = month;
                formData.year = year.slice(-1);
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            if (formData.date_of_TD) {
                const [year, month, day] = formData.date_of_TD.split("-");
                formData.day_of_TD = day;
                formData.month_of_TD = month;
                formData.year_of_TD = year.slice(-1);
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            if (formData.term_date) {
                const [year, month, day] = formData.term_date.split("-");
                formData.term_day = day;
                formData.term_month = month;
                formData.term_year = year;
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            if (formData.date_task) {
                const [year, month, day] = formData.date_task.split("-");
                formData.day_task = day;
                formData.month_task = month;
                formData.year_task = year;
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            formData.FIO = fullName_b;
            const fullName_a = formData.FIO_dir;
            if (fullName_b) {
                const buyerNameParts = fullName_b.split(' ');
                if (buyerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.FIO_dir_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}. ${buyerNameParts[2][0]}.`;
                } else if (buyerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.FIO_dir_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}.`;
                }
            }
            formData.FIO_dir = fullName_a;
            try {
                // Отправляем POST-запрос
                const response = await fetch(`${BASE_URL}/generate_p/order.docx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                // Проверяем ответ сервера
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
                }
    
                // Получаем сгенерированный файл
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated_document.pdf'; // Название сохраняемого файла
                a.click();
    
                // Очищаем временный URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } catch (error) {
                console.error("Ошибка генерации документа:", error.message);
                alert("Произошла ошибка при генерации документа. Проверьте консоль для деталей.");
            }
        } else if(selectedTemplate == 'Распоряжение'){
            if (formData.date_task) {
                const [year, month, day] = formData.date_task.split("-");
                formData.day_task = day;
                formData.month_task = month;
                formData.year_task = year.slice(-1);
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
        if (formData.date_start) {
                const [year, month, day] = formData.date_start.split("-");
                formData.day_strat = day;
                formData.month_strat = month;
                formData.year_strat = year.slice(-1);
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
        if (formData.date) {
                const [year, month, day] = formData.date.split("-");
                formData.day = day;
                formData.month = month;
                formData.year = year.slice(-1);
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            try {
                // Отправляем POST-запрос
                const response = await fetch(`${BASE_URL}/generate_d/rasporyajenie.docx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                 // Проверяем ответ сервера
                 if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
                }
                // Получаем сгенерированный файл
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated_document.docx'; // Название сохраняемого файла
                a.click();

                // Очищаем временный URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
               

            }catch (error) {
                console.error("Ошибка генерации документа:", error.message);
                alert("Произошла ошибка при генерации документа. Проверьте консоль для деталей.");
            }
        

        }
    }
});


document.addEventListener("click", async (event) => {
    // Проверяем, что нажата кнопка "Сохранить данные"
    if (event.target && event.target.textContent.trim() === 'Скачать документ .pdf') {
        event.preventDefault(); // Отключаем стандартное поведение кнопки

        // Собираем данные из формы
        const form = event.target.closest("form"); // Находим текущую форму
        const formData = {};

        // Валидация данных формы
        if (!validateFormData(formData)) {
            return;
        }
        if (selectedTemplate == 'Договор купли-продажи') {
            // Сохраняем полное имя продавца
            const fullName = formData.name_of_seller;

            // Преобразуем имя продавца в формат "Фамилия И. О."
            if (fullName) {
                const sellerNameParts = fullName.split(' ');
                if (sellerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}. ${sellerNameParts[2][0]}.`;
                } else if (sellerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}.`;
                }
            }

            // Здесь сохраняем полное имя отдельно, если нужно использовать позже
            formData.full_name_of_seller = fullName;

            // Сохраняем полное имя продавца
            const fullName_b = formData.name_of_buyer;

            // Преобразуем имя продавца в формат "Фамилия И. О."
            if (fullName_b) {
                const buyerNameParts = fullName_b.split(' ');
                if (buyerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}. ${buyerNameParts[2][0]}.`;
                } else if (buyerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}.`;
                }
            }

            // Здесь сохраняем полное имя отдельно, если нужно использовать позже
            formData.full_name_of_buyer = fullName_b;


            if (formData.date) {
                const [year, month, day] = formData.date.split("-");
                formData.day = day;
                formData.month = month;
                formData.year = year;
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }
            try {
                // Отправляем POST-запрос
                const response = await fetch(`${BASE_URL}/generate_p/purchase%26sale_agreement.docx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                // Проверяем ответ сервера
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
                }
    
                // Получаем сгенерированный файл
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated_document.pdf'; // Название сохраняемого файла
                a.click();
    
                // Очищаем временный URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } catch (error) {
                console.error("Ошибка генерации документа:", error.message);
                alert("Произошла ошибка при генерации документа. Проверьте консоль для деталей.");
            }
        }
    }
});

// Добавляем обработчик для кнопки "Создать документ"
document.addEventListener("click", async (event) => {
    if (event.target && event.target.textContent.trim() === 'Создать документ') {
        event.preventDefault();

        // Собираем данные из формы
        const form = event.target.closest("form");
        const formData = {};

        form.querySelectorAll("input").forEach(input => {
            formData[input.id] = input.value.trim();
        });

        // Валидация данных формы
        if (!validateFormData(formData)) {
            return;
        }

        if (selectedTemplate == 'Договор купли-продажи') {
            // Сохраняем полное имя продавца
            const fullName = formData.name_of_seller;

            // Преобразуем имя продавца в формат "Фамилия И. О."
            if (fullName) {
                const sellerNameParts = fullName.split(' ');
                if (sellerNameParts.length === 3) {
                    // Если имя состоит из Фамилия Имя Отчество
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}. ${sellerNameParts[2][0]}.`;
                } else if (sellerNameParts.length === 2) {
                    // Если имя состоит из Фамилия Имя
                    formData.name_of_seller_short = `${sellerNameParts[0]} ${sellerNameParts[1][0]}.`;
                }
            }

            // Здесь сохраняем полное имя отдельно, если нужно использовать позже
            formData.full_name_of_seller = fullName;

            // Сохраняем полное имя продавца
            const fullName_b = formData.name_of_buyer;

                        // Преобразуем имя продавца в формат "Фамилия И. О."
                        if (fullName_b) {
                            const buyerNameParts = fullName_b.split(' ');
                            if (buyerNameParts.length === 3) {
                                // Если имя состоит из Фамилия Имя Отчество
                                formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}. ${buyerNameParts[2][0]}.`;
                            } else if (buyerNameParts.length === 2) {
                                // Если имя состоит из Фамилия Имя
                                formData.name_of_buyer_short = `${buyerNameParts[0]} ${buyerNameParts[1][0]}.`;
                            }
                        }
            
                        // Здесь сохраняем полное имя отдельно, если нужно использовать позже
                        formData.full_name_of_buyer = fullName_b;
            
            if (formData.date) {
                const [year, month, day] = formData.date.split("-");
                formData.day = day;
                formData.month = month;
                formData.year = year;
            } else {
                alert("Пожалуйста, заполните поле даты.");
                return;
            }  
            try {
                // Отправляем POST-запрос на сервер для генерации PDF
                const response = await fetch(`${BASE_URL}/generate_p/purchase%26sale_agreement.docx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
                }
    
                // Получаем PDF как Blob
                const blob = await response.blob();
    
                // Создаём объект URL для отображения PDF
                const pdfUrl = URL.createObjectURL(blob);
    
                // Отображаем PDF в контейнере для предпросмотра
                const previewSector = document.getElementById('preview-container');
                previewSector.innerHTML = ''; // Очищаем контейнер
    
                const pdfIframe = document.createElement('iframe');
                pdfIframe.src = pdfUrl;
                pdfIframe.width = '100%';
                pdfIframe.height = '500px';
                pdfIframe.style.border = 'none';
    
                previewSector.appendChild(pdfIframe);
    
            } catch (error) {
                console.error("Ошибка генерации документа:", error.message);
                alert("Произошла ошибка при генерации документа.");
            }
        } 
    }
})