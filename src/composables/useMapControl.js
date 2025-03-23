import { ref } from 'vue'
import { polygonCenter } from '@/utils/polygon'
import { MAP_SETTINGS } from '@/config/map'

export function useMapControl() {
    const zoom = ref(MAP_SETTINGS.DEFAULT_ZOOM)
    const center = ref(MAP_SETTINGS.DEFAULT_CENTER)

    const showBuryatia = () => {
        zoom.value = MAP_SETTINGS.DEFAULT_ZOOM
        center.value = MAP_SETTINGS.DEFAULT_CENTER
    }

    const focusOnObject = (object) => {
        if (!object) return

        setTimeout(() => {
            if (Array.isArray(object.coords[0])) {
                center.value = [...polygonCenter(object.coords)]
            } else {
                center.value = [...object.coords]
            }
            zoom.value = MAP_SETTINGS.OBJECT_FOCUS_ZOOM
        }, 10)
    }

    return {
        zoom,
        center,
        showBuryatia,
        focusOnObject
    }
}