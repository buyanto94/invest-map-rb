import { ref, computed, watch } from 'vue'
import _ from 'lodash'
import { useObjectsStore } from '@/stores/objects'
import { filterObjects, searchObjects } from '@/utils/filter-objects'


const filter = ref(null) 

export function useObjectFilter() {
    const objectsStore = useObjectsStore()
    
    const searchResults = ref([])
    const searchResultsText = ref('')


    const inputSearch = computed(() => filter.value ? filter.value.inputSearch : '')

    // 1. Подсчет количества (игнорируя категории)
    const filteredByMainParams = computed(() => {
        if (!filter.value) return objectsStore.items
        const countFilter = { ...filter.value, childCategories: [], categoriesGroups: [] }
        return filterObjects(objectsStore.items, countFilter)
    })

    // 2. Полная фильтрация
    const filterResults = computed(() => {
        return filterObjects(objectsStore.items, filter.value)
    })

    // 3. Итоговый список (Поиск или Фильтр)
    const findObjects = computed(() => {
        if (inputSearch.value) {
            return searchResults.value
        } else {
            return filterResults.value
        }
    })

    // Логика поиска
    const performSearch = () => {
        searchResults.value = []
        const searchText = inputSearch.value

        if (searchText) {
            searchResults.value = searchObjects(objectsStore.items, searchText)
            searchResultsText.value = `Найдено ${searchResults.value.length} объектов`
        }
    }

    const debouncedSearch = _.debounce(performSearch, 500)

    watch(inputSearch, () => {
        searchResultsText.value = 'Поиск...'
        debouncedSearch()
    })

    return {
        filter,
        findObjects,
        filteredByMainParams,
        searchResultsText
    }
}