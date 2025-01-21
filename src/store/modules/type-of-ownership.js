import { api } from '@/api'

export default {
    actions: {
        async fetchTypeOfOwnership({ commit }) {
            try {
                const data = await api.getTypeOfOwnership()
                commit('updateTypeOfOwnership', data)
            } catch (e) {
                console.error('Ошибка загрузки форм собственности:', e)
            }
        },
    },
    mutations: {
        updateTypeOfOwnership(state, type_of_ownership) {
            state.type_of_ownership = type_of_ownership
        },
    },
    state: {
        type_of_ownership: [],
    },
    getters: {
        allTypeOfOwnership(state) {
            return state.type_of_ownership
        },
    },
}