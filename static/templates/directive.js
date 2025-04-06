export const prepareData = (formData) => {
    // Пример подготовки данных для "Распоряжения"
    
    // Форматируем дату в нужном формате, например:
    if (formData.date) {
        const [year, month, day] = formData.date.split("-");
        formData.day = day;
        formData.month = month;
        formData.year = year;
    }

    // Преобразуем ФИО в короткий формат
    if (formData.FIO) {
        const fioParts = formData.FIO.split(' ');
        if (fioParts.length === 3) {
            formData.FIO_short = `${fioParts[0]} ${fioParts[1][0]}. ${fioParts[2][0]}.`;
        } else if (fioParts.length === 2) {
            formData.FIO_short = `${fioParts[0]} ${fioParts[1][0]}.`;
        }
    }

    // Добавь здесь дополнительные преобразования данных для этого шаблона
    return formData;
};