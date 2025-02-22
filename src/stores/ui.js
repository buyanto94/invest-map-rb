import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const showFilterPanel = ref(false)
    const showSearchPanel = ref(false)
    const message = ref(null)

    const setShowFilterPanel = (val) => {
        showFilterPanel.value = val
    }
    
    const setShowSearchPanel = (val) => {
        showSearchPanel.value = val
    }

    const setMessage = (payload) => {
        // payload: { text: '...', type: 'success'|'danger' }
        message.value = payload
    }

    const clearMessage = () => {
        message.value = null
    }

    return {
        showFilterPanel,
        showSearchPanel,
        message,
        setShowFilterPanel,
        setShowSearchPanel,
        setMessage,
        clearMessage
    }
})