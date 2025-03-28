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
    const selectedTypeArea = ref(null) // Greenfield / Brownfield
    const selectedOwnership = ref(null)
    
    const areaRange = ref([0, 0])
    const distanceRange = ref([0, 0]) 
    
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
    }

    function setRanges(maxArea, maxDistance) {
        if (areaRange.value[1] === 0) areaRange.value = [0, maxArea]
        if (distanceRange.value[1] === 0) distanceRange.value = [0, maxDistance]
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
        
        filteredObjects,
        statsObjects,
        searchResultsText,
        
        resetFilters,
        setRanges
    }
})