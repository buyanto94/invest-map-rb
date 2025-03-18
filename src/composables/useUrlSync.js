import { onMounted } from 'vue'

export function useUrlSync({ objectsStore, mapStore, setMapState }) {
    
    onMounted(() => {
        const urlParams = new URLSearchParams(window.location.search)
        
        if (urlParams.has('object')) {
            const id = urlParams.get('object')
            const obj = objectsStore.items.find((item) => item.id == id)
            if (obj) {
                mapStore.setActiveObject(obj)
            }
        }

        if (urlParams.has('zoom') && urlParams.has('lat') && urlParams.has('lng')) {
            const zoom = +urlParams.get('zoom')
            const center = [urlParams.get('lat'), urlParams.get('lng')]
            
            setMapState(zoom, center)
        }
    })
}