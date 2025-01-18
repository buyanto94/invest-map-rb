export default {
    actions: {
        async fetchTypeOfOwnership(ctx) {
            const res = await fetch('./example_type-of-ownership.json')
            // const res = await fetch('https://invest-buryatia.ru/map/type-of-ownership.php')
            const type_of_ownership = await res.json()

            ctx.commit('updateTypeOfOwnership', type_of_ownership)
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
