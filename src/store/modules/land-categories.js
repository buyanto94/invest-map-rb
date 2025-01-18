export default {
    actions: {
        async fetchLandCategories(ctx) {
            const res = await fetch('./example_available-land-categories.json')
            // const res = await fetch('https://invest-buryatia.ru/map/available-land-categories.php')
            const land_categories = await res.json()

            ctx.commit('updateLandCategories', land_categories)
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
