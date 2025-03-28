import { useObjectsStore } from '@/stores/objects'
import { useMapStore } from '@/stores/map'

export function useUrlSync() {
    const objectsStore = useObjectsStore()
    const mapStore = useMapStore()

    const initializeFromUrl = (setMapState) => {
        const urlParams = new URLSearchParams(window.location.search)

        if (urlParams.has('object')) {
            const id = urlParams.get('object')

            const obj = objectsStore.items.find(item => String(item.id) === String(id))

            if (obj) {
                mapStore.setActiveObject(obj)
            } else {
                console.warn(`Объект с id=${id} не найден в загруженных данных`)
            }
        }

        if (urlParams.has('zoom') && urlParams.has('lat') && urlParams.has('lng')) {
            const zoom = parseInt(urlParams.get('zoom'), 10)
            const lat = parseFloat(urlParams.get('lat'))
            const lng = parseFloat(urlParams.get('lng'))

            if (!isNaN(zoom) && !isNaN(lat) && !isNaN(lng)) {
                if (typeof setMapState === 'function') {
                    setMapState(zoom, [lat, lng])
                }
            }
        }
    }

    return {
        initializeFromUrl
    }
}