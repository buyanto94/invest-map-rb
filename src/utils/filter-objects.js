export function filterObjects(objects, filter) {
    if (!filter) return objects;

    let result = objects;

    // 1. Фильтрация по основным параметрам
    result = result.filter((item) => {
        // Район (строгое сравнение, если выбран)
        if (filter.district && item.municipalArea != filter.district) return false;

        // Категория земель
        if (filter.landCategory && item.landCategory != filter.landCategory) return false;

        // Тип площадки (Greenfield/Brownfield)
        if (filter.typeArea && item.typeArea.toLowerCase() !== filter.typeArea) return false;

        // Форма собственности
        if (filter.typeOfOwnership && item.typeOfOwnership.id !== filter.typeOfOwnership) return false;

        // Площадь (с конвертацией запятой в точку)
        const itemArea = parseFloat(item.area.replace(',', '.'));
        if (itemArea < filter.area[0] || itemArea > filter.area[1]) return false;

        // Дистанция до Улан-Удэ
        if (item.distanceToUU < filter.distanceToUU[0] || item.distanceToUU > filter.distanceToUU[1]) return false;

        return true;
    });

    // 2. Фильтр по выбранным дочерним категориям
    if (filter.childCategories && filter.childCategories.length > 0) {
        result = result.filter(item => filter.childCategories.includes(item.category.id));
    }

    // 3. Фильтр по родительским группам
    if (filter.categoriesGroups && filter.categoriesGroups.length > 0) {
        result = result.filter(item => filter.categoriesGroups.includes(item.category.parentId));
    }

    return result;
}

export function searchObjects(objects, searchText) {
    if (!searchText) return [];
    
    const lowerText = searchText.toLowerCase();
    
    return objects.filter((item) => {
        // TODO: В будущем лучше искать только по title/address/description
        return JSON.stringify(item).toLowerCase().includes(lowerText);
    });
}