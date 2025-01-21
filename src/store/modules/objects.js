import { api } from '@/api'

export default {
    actions: {
        async fetchObjects({ commit }) {
            try {
                const data = await api.getObjects()
                commit('updateObjects', data.items)
            } catch (e) {
                console.error('Ошибка при загрузке объектов:', e)
            }
        },
    },
    mutations: {
        updateObjects(state, objects) {
            state.objects = objects
        },
    },
    state: {
        objects: [],
        areaMax: 0,
    },
    getters: {
        allObjects(state) {
            return state.objects
        },
    },
}