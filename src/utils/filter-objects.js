export function filterObjects(objects, filter) {
    if (!filter) return objects

    return objects.filter((item) => {
        // Район
        if (filter.district && String(item.municipalArea) !== String(filter.district)) return false

        // Категория земель
        if (filter.landCategory && String(item.landCategory) !== String(filter.landCategory)) return false

        // Тип площадки
        if (filter.typeArea && item.typeArea?.toLowerCase() !== filter.typeArea) return false

        // Форма собственности
        if (filter.typeOfOwnership && item.typeOfOwnership?.id !== filter.typeOfOwnership) return false

        // Площадь
        const itemArea = parseFloat(String(item.area).replace(',', '.'))
        const [minArea, maxArea] = filter.area || [0, 999999]
        if (itemArea < minArea || itemArea > maxArea) return false

        // Дистанция
        const [minDist, maxDist] = filter.distanceToUU || [0, 999999]
        if (item.distanceToUU < minDist || item.distanceToUU > maxDist) return false

        // Дочерние категории
        if (filter.childCategories?.length > 0) {
            if (!filter.childCategories.includes(item.category?.id)) return false
        }

        // Родительские группы
        if (filter.categoriesGroups?.length > 0) {
            if (!filter.categoriesGroups.includes(item.category?.parentId)) return false
        }

        return true
    })
}

export function searchObjects(objects, searchText) {
    if (!searchText) return []
    
    const lowerText = searchText.toLowerCase()
    
    return objects.filter((item) => {
        // Поиск по конкретным полям
        const fields = [
            item.title,
            item.address,
            item.typeObject,
            item.category?.name
        ].filter(Boolean).join(' ').toLowerCase()
        
        return fields.includes(lowerText)
    })
}