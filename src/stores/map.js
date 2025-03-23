import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TILE_LAYERS } from '@/config/map'
import { OBJECT_ICONS } from '@/config/constants'

export const useMapStore = defineStore('map', () => {
    const activeLayer = ref(TILE_LAYERS[0])
    const activeObject = ref(null)

    const setActiveLayer = (layer) => {
        activeLayer.value = layer
    }

    const setActiveObject = (object) => {
        activeObject.value = object
    }

    return {
        layers: TILE_LAYERS,
        icons: OBJECT_ICONS,
        activeLayer,
        activeObject,
        setActiveLayer,
        setActiveObject
    }
})