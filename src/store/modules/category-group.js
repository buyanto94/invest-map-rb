export default {
    actions: {
        async fetchCategoryGroup(ctx) {
            const res = await fetch('./example_category-group.json')
            // const res = await fetch('https://invest-buryatia.ru/map/category-group.php')
            const category_group = await res.json()

            ctx.commit('updateCategoryGroup', category_group)
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
