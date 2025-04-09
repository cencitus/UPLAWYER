export const prepareData = (formData) => {
    // Обработка даты распоряжения
    if (formData.date) {
        const [year, month, day] = formData.date.split("-");
        formData.day = day;
        formData.month = month;
        formData.year = year;
    }

    // Обработка даты начала рекламной стратегии
    if (formData.date_start) {
        const [year_strat, month_strat, day_strat] = formData.date_start.split("-");
        formData.day_strat = day_strat;
        formData.month_strat = month_strat;
        formData.year_strat = year_strat;  // Можно получить последний символ года для записи в шаблон
    }

    // Обработка даты завершения (для задания)
    if (formData.date_task) {
        const [year_task, month_task, day_task] = formData.date_task.split("-");
        formData.day_task = day_task;
        formData.month_task = month_task;
        formData.year_task = year_task;
    }

    // Обработка ФИО маркетолога
    if (formData.FIO) {
        const fioParts = formData.FIO.split(' ');
        if (fioParts.length === 3) {
            formData.FIO_short = `${fioParts[0]} ${fioParts[1][0]}. ${fioParts[2][0]}.`;
        } else if (fioParts.length === 2) {
            formData.FIO_short = `${fioParts[0]} ${fioParts[1][0]}.`;
        }
    }

    // Обработка ФИО отдавшего распоряжение (директора)
    if (formData.FIO_boss) {
        const fioParts = formData.FIO_boss.split(' ');
        if (fioParts.length === 3) {
            formData.FIO_boss_short = `${fioParts[0]} ${fioParts[1][0]}. ${fioParts[2][0]}.`;
        } else if (fioParts.length === 2) {
            formData.FIO_boss_short = `${fioParts[0]} ${fioParts[1][0]}.`;
        }
    }

    // Передаем все нужные данные в шаблон
    formData.name_of_organization = formData.name_of_organization || '';
    formData.number_of_order = formData.number_of_order || '';
    formData.num_of_task = formData.num_of_task || '';
    formData.city = formData.city || '';
    formData.post_boss = formData.post_boss || '';

    return formData;
};