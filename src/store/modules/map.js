const layers = [
    {
        name: 'Схема',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c'],
    },
    // {
    //     name: 'Схема',
    //     url: 'https://api.mapbox.com/styles/v1/investmapbur/ckrbvfgm10xfu17o58y6iv5vn/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW52ZXN0bWFwYnVyIiwiYSI6ImNrcmJ1MXhyMjBlZm0zMHBlY3dxZ2N0cm0ifQ.zHcxNLF7KSfDvDCtM963Iw',
    //     subdomains: [],
    // },
    {
        name: 'Спутник',
        url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
    {
        name: 'Гибрид',
        url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
]

export default {
    state() {
        return {
            activeLayer: layers[0],
            activeObject: null,
            layers: layers,
            iconsMarker: {
                default: require('@/assets/icons/land.png'),
                CATEGORY_76: require('@/assets/icons/land.png'),
                CATEGORY_83: require('@/assets/icons/building.png'),
                CATEGORY_57: require('@/assets/icons/place.png'),
                CATEGORY_71: require('@/assets/icons/place.png'),
            },
        }
    },
    getters: {
        activeLayer(state) {
            return state.activeLayer
        },
        activeObject(state) {
            return state.activeObject
        },
        layers(state) {
            return state.layers
        },
        iconsMarker(state) {
            return state.iconsMarker
        },
    },
    actions: {
        setActiveLayer({ commit }, layer) {
            commit('setActiveLayer', layer)
        },
        setActiveObject({ commit }, object) {
            commit('setActiveObject', object)
        },
    },

    mutations: {
        setActiveLayer(state, layer) {
            state.activeLayer = layer
        },
        setActiveObject(state, object) {
            state.activeObject = object
        },
    },
}
