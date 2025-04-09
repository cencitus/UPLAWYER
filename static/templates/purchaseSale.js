export function prepareData(formData) {
    const fullName = formData.name_of_seller;
    if (fullName) {
        const parts = fullName.split(' ');
        formData.name_of_seller_short = `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
        formData.full_name_of_seller = fullName;
    }

    const fullName_b = formData.name_of_buyer;
    if (fullName_b) {
        const parts = fullName_b.split(' ');
        formData.name_of_buyer_short = `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
        formData.full_name_of_buyer = fullName_b;
    }

    if (formData.date) {
        const [year, month, day] = formData.date.split("-");
        formData.day = day;
        formData.month = month;
        formData.year = year;
    }

    return formData;
}