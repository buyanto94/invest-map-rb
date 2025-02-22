import { defineStore } from 'pinia'
import { ref } from 'vue'


const LAYERS = [
    {
        name: 'Схема',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c'],
    },
    {
        name: 'Спутник',
        url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
    {
        name: 'Гибрид',
        url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
]

// Иконки маркеров
const ICONS = {
    default: require('@/assets/icons/land.png'),
    CATEGORY_76: require('@/assets/icons/land.png'),
    CATEGORY_83: require('@/assets/icons/building.png'),
    CATEGORY_57: require('@/assets/icons/place.png'),
    CATEGORY_71: require('@/assets/icons/place.png'),
}

export const useMapStore = defineStore('map', () => {
    const activeLayer = ref(LAYERS[0])
    const activeObject = ref(null)

    const setActiveLayer = (layer) => {
        activeLayer.value = layer
    }

    const setActiveObject = (object) => {
        activeObject.value = object
    }

    return {
        layers: LAYERS,
        icons: ICONS,
        activeLayer,
        activeObject,
        setActiveLayer,
        setActiveObject
    }
})