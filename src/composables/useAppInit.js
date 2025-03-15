import { useObjectsStore } from '@/stores/objects'
import { useDistrictsStore } from '@/stores/districts'
import { useReferencesStore } from '@/stores/references'

export function useAppInit() {
    const objectsStore = useObjectsStore()
    const districtsStore = useDistrictsStore()
    const referencesStore = useReferencesStore()

    const init = async () => {
        console.log('Инициализация App')
        await Promise.all([
            objectsStore.fetchObjects(),
            districtsStore.fetchDistricts(),
            referencesStore.fetchAll()
        ])
        console.log('App инициализирован')
    }

    return {
        init
    }
}