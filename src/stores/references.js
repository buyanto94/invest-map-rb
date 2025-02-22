import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export const useReferencesStore = defineStore('references', () => {
    const landCategories = ref([])
    const ownershipTypes = ref([])
    const categoryGroups = ref([])

    const fetchLandCategories = async () => {
        try {
            landCategories.value = await api.getLandCategories()
        } catch (e) {
            console.error('Error land-categories:', e)
        }
    }

    const fetchOwnershipTypes = async () => {
        try {
            ownershipTypes.value = await api.getTypeOfOwnership()
        } catch (e) {
            console.error('Error ownership-types:', e)
        }
    }

    const fetchCategoryGroups = async () => {
        try {
            categoryGroups.value = await api.getCategoryGroups()
        } catch (e) {
            console.error('Error category-groups:', e)
        }
    }

    const fetchAll = async () => {
        await Promise.all([
            fetchLandCategories(),
            fetchOwnershipTypes(),
            fetchCategoryGroups()
        ])
    }

    return {
        landCategories,
        ownershipTypes,
        categoryGroups,
        fetchAll
    }
})