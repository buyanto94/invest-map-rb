import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export const useObjectsStore = defineStore('objects', () => {
    const items = ref([])

    const fetchObjects = async () => {
        try {
            const data = await api.getObjects()
            items.value = data.items || []
        } catch (e) {
            console.error('Error objects:', e)
        }
    }

    return {
        items,
        fetchObjects
    }
})