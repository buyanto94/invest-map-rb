import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export const useDistrictsStore = defineStore('districts', () => {
    const items = ref([])
    const showDistricts = ref(true)

    const fetchDistricts = async () => {
        try {
            const data = await api.getDistricts()
            items.value = data.features || []
        } catch (e) {
            console.error('Error districts:', e)
        }
    }

    const setShowDistricts = (value) => {
        showDistricts.value = value
    }

    return {
        items,
        showDistricts,
        fetchDistricts,
        setShowDistricts
    }
})