import { useReferencesStore } from '@/stores/references'
import { useDistrictsStore } from '@/stores/districts'
import { REMOTE_ASSETS_URL, OBJECT_ICONS } from '@/config/constants'

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

    const getCategoryIcon = (category) => {
        if (!category) return OBJECT_ICONS.default

        if (category.img) {
            return REMOTE_ASSETS_URL + category.img
        }

        const type = category.type
        return (type && OBJECT_ICONS[type]) ? OBJECT_ICONS[type] : OBJECT_ICONS.default
    }

    return {
        getCategoryName,
        getDistrictName,
        getOwnershipName,
        getCategoryIcon
    }
}