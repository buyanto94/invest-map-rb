import { api } from '@/api'

export default {
    actions: {
        async fetchCategoryGroup({ commit }) {
            try {
                const data = await api.getCategoryGroups()
                commit('updateCategoryGroup', data)
            } catch (e) {
                console.error('Ошибка загрузки групп категорий:', e)
            }
        },
    },
    mutations: {
        updateCategoryGroup(state, category_group) {
            state.category_group = category_group
        },
    },
    state: {
        category_group: [],
    },
    getters: {
        allCategoryGroup(state) {
            return state.category_group
        },
    },
}