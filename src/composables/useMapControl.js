import { ref } from 'vue'
import { polygonCenter } from '@/utils/polygon'


export function useMapControl() {
    const zoom = ref(6)
    const center = ref([53.328248, 108.837283])

    const showBuryatia = () => {
        zoom.value = 6
        center.value = [53.328248, 108.837283]
    }

    const focusOnObject = (object) => {
        if (!object) return

        setTimeout(() => {
            if (Array.isArray(object.coords[0])) {
                center.value = [...polygonCenter(object.coords)]
            } else {
                center.value = [...object.coords]
            }
            zoom.value = 18
        }, 10)
    }

    return {
        zoom,
        center,
        showBuryatia,
        focusOnObject
    }
}