import { useReferencesStore } from '@/stores/references'
import { useDistrictsStore } from '@/stores/districts'

export function useFormatters() {
    const referencesStore = useReferencesStore()
    const districtsStore = useDistrictsStore()

    const getCategoryName = (id) => {
        if (!id) return '-'
        const category = referencesStore.landCategories.find((item) => item.id == id)
        return category ? category.title : '-'
    }

    const getDistrictName = (id) => {
        if (!id) return '-'
        const area = districtsStore.items.find((item) => item.id == +id)
        return area ? area.name : '-'
    }

    const getOwnershipName = (id) => {
        if (!id) return '-'
        const owner = referencesStore.ownershipTypes.find((item) => item.id == id)
        return owner ? owner.title : '-'
    }

    return {
        getCategoryName,
        getDistrictName,
        getOwnershipName
    }
}