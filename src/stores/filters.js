import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useObjectsStore } from '@/stores/objects'
import { filterObjects, searchObjects } from '@/utils/filter-objects'

export const useFiltersStore = defineStore('filters', () => {
    const objectsStore = useObjectsStore()

    const inputSearch = ref('')
    
    // Значения фильтров
    const selectedDistrict = ref(null)
    const selectedLandCategory = ref(null)
    const selectedTypeArea = ref(null)
    const selectedOwnership = ref(null)
    

    const areaRange = ref([0, 0])
    const distanceRange = ref([0, 0]) 
    
    const limits = ref({
        area: [0, 100],
        distance: [0, 100]
    })
    
    const checkedChildCategories = ref([])
    const checkedCategoryGroups = ref([])

    const filteredObjects = computed(() => {
        const items = objectsStore.items
        
        if (inputSearch.value) {
            return searchObjects(items, inputSearch.value)
        }

        const filterParams = {
            district: selectedDistrict.value,
            landCategory: selectedLandCategory.value,
            typeArea: selectedTypeArea.value,
            typeOfOwnership: selectedOwnership.value,
            area: areaRange.value,
            distanceToUU: distanceRange.value,
            childCategories: checkedChildCategories.value,
            categoriesGroups: checkedCategoryGroups.value
        }

        return filterObjects(items, filterParams)
    })

    const statsObjects = computed(() => {
        const filterParams = {
            district: selectedDistrict.value,
            landCategory: selectedLandCategory.value,
            typeArea: selectedTypeArea.value,
            typeOfOwnership: selectedOwnership.value,
            area: areaRange.value,
            distanceToUU: distanceRange.value,
            childCategories: [],
            categoriesGroups: []
        }
        return filterObjects(objectsStore.items, filterParams)
    })

    const searchResultsText = computed(() => {
        if (!inputSearch.value) return ''
        return `Найдено ${filteredObjects.value.length} объектов`
    })
    
    function resetFilters() {
        selectedDistrict.value = null
        selectedLandCategory.value = null
        selectedTypeArea.value = null
        selectedOwnership.value = null
        checkedChildCategories.value = []
        checkedCategoryGroups.value = []
        
        areaRange.value = [limits.value.area[0], limits.value.area[1]]
        distanceRange.value = [limits.value.distance[0], limits.value.distance[1]]
    }

    function initFiltersFromData() {
        const items = objectsStore.items
        if (!items || items.length === 0) return

        let areaMax = 0
        let distanceMax = 0
        const categories = new Set()
        const groups = new Set()

        items.forEach(item => {
            const dist = Number(item.distanceToUU)
            if (dist > distanceMax) distanceMax = dist
            
            const itemArea = parseFloat(String(item.area).replace(',', '.'))
            if (itemArea > areaMax) areaMax = itemArea

            if (item.category?.id) categories.add(item.category.id)
            if (item.category?.parentId) groups.add(item.category.parentId)
        })

        areaMax = Math.ceil(areaMax)
        distanceMax = Math.ceil(distanceMax)

        limits.value.area = [0, areaMax]
        limits.value.distance = [0, distanceMax]

        if (areaRange.value[1] === 0) areaRange.value = [0, areaMax]
        if (distanceRange.value[1] === 0) distanceRange.value = [0, distanceMax]

        if (checkedChildCategories.value.length === 0) {
            checkedChildCategories.value = Array.from(categories)
        }
        if (checkedCategoryGroups.value.length === 0) {
            checkedCategoryGroups.value = Array.from(groups)
        }
    }

    return {
        inputSearch,
        selectedDistrict,
        selectedLandCategory,
        selectedTypeArea,
        selectedOwnership,
        areaRange,
        distanceRange,
        checkedChildCategories,
        checkedCategoryGroups,
        limits,
        
        filteredObjects,
        statsObjects,
        searchResultsText,
        
        resetFilters,
        initFiltersFromData
    }
})