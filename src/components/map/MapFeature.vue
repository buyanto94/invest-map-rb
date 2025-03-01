<template>
    <!-- Если это полигон (массив массивов координат) -->
    <div v-if="isPolygon">
        <l-polygon :lat-lngs="polygonCoords" :fillOpacity="0.2" :weight="3" color="#29d321" fillColor="#29d321"
            :visible="isActive">
            <l-popup>{{ item.title }}</l-popup>
        </l-polygon>
        <l-marker :lat-lng="centerCoords" @click="onClick">
            <l-icon :icon-size="iconSize">
                <img :src="iconUrl" class="marker-icon" :title="item.category?.name" />
            </l-icon>
        </l-marker>
    </div>

    <!-- Если это обычная точка -->
    <div v-else>
        <l-marker v-if="item.coords.length === 2" :lat-lng="item.coords" @click="onClick">
            <l-icon :icon-size="iconSize">
                <img :src="iconUrl" class="marker-icon" :title="item.category?.name" />
            </l-icon>
        </l-marker>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMapStore } from '@/stores/map'
import { polygonCenter } from '@/utils/polygon'
import { LMarker, LIcon, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const mapStore = useMapStore()
const iconSize = [30, 30]

const isPolygon = computed(() => Array.isArray(props.item.coords[0]))

const isActive = computed(() => mapStore.activeObject?.id === props.item.id)

const iconUrl = computed(() => {
    if (props.item.category?.img) {
        return 'https://invest-buryatia.ru' + props.item.category.img
    }
    return props.item.category?.type
        ? mapStore.icons[props.item.category.type]
        : mapStore.icons['default']
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
.marker-icon {
    max-width: 100% !important;
}
</style>