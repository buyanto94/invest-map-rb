import { api } from '@/api'

export default {
    state: {
        districts: [],
        showDistricts: true,
    },
    getters: {
        districts(state) {
            return state.districts
        },
        showDistricts(state) {
            return state.showDistricts
        },
    },
    actions: {
        async fetchDistricts({ commit }) {
            try {
                const data = await api.getDistricts()
                commit('updateDistricts', data.features)
            } catch (e) {
                console.error('Ошибка при загрузке районов:', e)
            }
        },
        setShowDistricts({ commit }, value) {
            commit('setShowDistricts', value)
        },
    },
    mutations: {
        updateDistricts(state, districts) {
            state.districts = districts
        },
        setShowDistricts(state, value) {
            state.showDistricts = value
        },
    },
}