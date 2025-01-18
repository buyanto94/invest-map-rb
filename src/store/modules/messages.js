export default {
    state() {
        return {
            message: null,
        }
    },
    getters: {
        message(state) {
            return state.message
        },
    },
    actions: {
        setMessage({ commit }, message) {
            commit('setMessage', message)
        },

        clearMessage({ commit }) {
            commit('clearMessage')
        },
    },
    mutations: {
        setMessage(state, message) {
            state.message = message
        },
        clearMessage(state) {
            state.message = null
        },
    },
}
