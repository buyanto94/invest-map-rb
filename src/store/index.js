import { createStore } from 'vuex'

import districts from './modules/districts'
import messages from './modules/messages'
import landCategories from './modules/land-categories'
import typeOfOwnership from './modules/type-of-ownership'
import objects from './modules/objects'
import categoryGroup from './modules/category-group'
import map from './modules/map'

const plugins = []

export default createStore({
    plugins,
    state() {
        return {
            showFilterPanel: false,
            showSearchPanel: false,
        }
    },
    getters: {
        showFilterPanel(state) {
            return state.showFilterPanel
        },
        showSearchPanel(state) {
            return state.showSearchPanel
        },
    },
    actions: {
        setShowFilterPanel({ commit }, value) {
            commit('setShowFilterPanel', value)
        },
        setShowSearchPanel({ commit }, value) {
            commit('setShowSearchPanel', value)
        },
    },
    mutations: {
        setShowFilterPanel(state, value) {
            state.showFilterPanel = value
        },
        setShowSearchPanel(state, value) {
            state.showSearchPanel = value
        },
    },

    modules: {
        map,
        messages,
        districts,
        landCategories,
        typeOfOwnership,
        objects,
        categoryGroup,
    },
})
