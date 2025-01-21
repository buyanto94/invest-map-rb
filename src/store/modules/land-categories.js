import { api } from '@/api'

export default {
    actions: {
        async fetchLandCategories({ commit }) {
            try {
                const data = await api.getLandCategories()
                commit('updateLandCategories', data)
            } catch (e) {
                console.error('Ошибка загрузки категорий земель:', e)
            }
        },
    },
    mutations: {
        updateLandCategories(state, land_categories) {
            state.land_categories = land_categories
        },
    },
    state: {
        land_categories: [],
    },
    getters: {
        allLandCategories(state) {
            return state.land_categories
        },
    },
}