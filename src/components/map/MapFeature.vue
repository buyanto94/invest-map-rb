<template>
    <div v-if="isPolygon">
        <l-polygon :lat-lngs="polygonCoords" :fillOpacity="0.2" :weight="3" color="#29d321" fillColor="#29d321"
            :visible="isActive">
            <l-popup>{{ item.title }}</l-popup>
        </l-polygon>

        <l-marker :lat-lng="centerCoords" @click="onClick" :z-index-offset="isActive ? 1000 : 0">
            <l-icon :icon-size="iconSize" class-name="custom-marker-icon">
                <div class="marker-wrapper" :class="{ 'marker-active': isActive }">
                    <img :src="iconUrl" class="marker-img" :alt="item.title" />
                </div>
            </l-icon>
        </l-marker>
    </div>

    <div v-else>
        <l-marker v-if="isValidCoords" :lat-lng="item.coords" @click="onClick" :z-index-offset="isActive ? 1000 : 0">
            <l-icon :icon-size="iconSize" class-name="custom-marker-icon">
                <div class="marker-wrapper" :class="{ 'marker-active': isActive }">
                    <img :src="iconUrl" class="marker-img" :alt="item.title" />
                </div>
            </l-icon>
        </l-marker>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { LMarker, LIcon, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'
import { useMapStore } from '@/stores/map'
import { polygonCenter } from '@/utils/polygon'
import { REMOTE_ASSETS_URL } from '@/config/constants'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const mapStore = useMapStore()
const iconSize = [34, 34]

const isPolygon = computed(() => Array.isArray(props.item.coords?.[0]))
const isValidCoords = computed(() => props.item.coords?.length === 2)
const isActive = computed(() => mapStore.activeObject?.id === props.item.id)

const iconUrl = computed(() => {
    if (props.item.category?.img) {
        return REMOTE_ASSETS_URL + props.item.category.img
    }
    const type = props.item.category?.type
    return (type && mapStore.icons[type]) ? mapStore.icons[type] : mapStore.icons['default']
})

const polygonCoords = computed(() => {
    if (!isPolygon.value) return []
    const points = props.item.coords[0][0] ? props.item.coords[0][0] : props.item.coords[0]

    return points.map(el => {
        if (el.latitude && el.longitude) return [el.latitude, el.longitude]
        return [el[0], el[1]]
    })
})

const centerCoords = computed(() => {
    if (isPolygon.value) {
        return polygonCenter(props.item.coords)
    }
    return props.item.coords
})

const onClick = () => {
    mapStore.setActiveObject(props.item)
}
</script>

<style scoped>
.marker-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.marker-img {
    max-width: 100% !important;
    max-height: 100% !important;
    display: block;
}

.marker-active {
    background-color: #fff;
    border: 3px solid #f7ce38;
    padding: 2px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>