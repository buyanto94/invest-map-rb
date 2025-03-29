import { ref } from 'vue'
import { MAP_SETTINGS } from '@/config/map'

export function useMapControl() {
    const zoom = ref(MAP_SETTINGS.DEFAULT_ZOOM)
    const center = ref(MAP_SETTINGS.DEFAULT_CENTER)

    const showBuryatia = () => {
        zoom.value = MAP_SETTINGS.DEFAULT_ZOOM
        center.value = MAP_SETTINGS.DEFAULT_CENTER
    }

    return {
        zoom,
        center,
        showBuryatia
    }
}