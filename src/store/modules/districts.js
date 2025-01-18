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
        async fetchDistricts(ctx) {
            const res = await fetch('./districts.json')
            const districts = (await res.json()).features

            ctx.commit('updateDistricts', districts)
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
