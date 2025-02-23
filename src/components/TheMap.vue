<template>
    <div id="map">
        <l-map ref="mapRef" :zoom="zoom" :center="center" :noBlockingAnimations="true" :options="{ zoomControl: false }"
            @click="handleMapClick" @update:zoom="emit('update:zoom', $event)"
            @update:center="emit('update:center', $event)" @ready="onLeafletReady">
            <template v-if="leafletReady">
                <l-tile-layer v-if="mapStore.activeLayer" :max-zoom="18" :url="mapStore.activeLayer.url"
                    :subdomains="mapStore.activeLayer.subdomains"></l-tile-layer>

                <l-control-zoom position="topright"></l-control-zoom>

                <marker-cluster>
                    <template v-for="item in markers" :key="item.id">
                        <!-- Если это полигон (массив массивов) -->
                        <div v-if="Array.isArray(item.coords[0])">
                            <l-polygon :lat-lngs="poligonReqFormat(item.coords)" :fillOpacity="0.2" :weight="3"
                                color="#29d321" fillColor="#29d321" :visible="item.id == mapStore.activeObject?.id">
                                <l-popup>{{ item.title }}</l-popup>
                            </l-polygon>

                            <l-marker :lat-lng="polygonCenter(item.coords)" @click="mapStore.setActiveObject(item)">
                                <l-icon :icon-size="iconSize">
                                    <img :src="'https://invest-buryatia.ru' + item.category.img"
                                        v-if="item.category?.img" :title="item.category.type" class="marker-icon" />
                                    <img v-else
                                        :src="item.category?.type ? mapStore.icons[item.category.type] : mapStore.icons['default']"
                                        :title="item.category?.type" class="marker-icon" />
                                </l-icon>
                            </l-marker>
                        </div>

                        <!-- Если это точка -->
                        <div v-else>
                            <l-marker v-if="item.coords.length === 2" :lat-lng="item.coords"
                                @click="mapStore.setActiveObject(item)">
                                <l-icon :icon-size="iconSize">
                                    <img :src="'https://invest-buryatia.ru' + item.category.img"
                                        v-if="item.category?.img" :title="item.category.type" class="marker-icon" />
                                    <img v-else
                                        :src="item.category?.type ? mapStore.icons[item.category.type] : mapStore.icons['default']"
                                        :title="item.category?.type" class="marker-icon" />
                                </l-icon>
                            </l-marker>
                        </div>
                    </template>
                </marker-cluster>

                <!-- Районы (GeoJSON) -->
                <div v-if="districtsStore.showDistricts">
                    <l-polygon v-for="item in districtsStore.items" :key="item.id" :lat-lngs="item.geometry.coordinates"
                        :fillOpacity="0" @click="focusedDistrict = item.id" :weight="item.id == focusedDistrict ? 3 : 1"
                        :fill="true">
                        <l-popup>{{ item.name }}</l-popup>
                    </l-polygon>
                </div>
            </template>
        </l-map>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { polygonCenter } from '@/utils/polygon'
import { LMap, LTileLayer, LControlZoom, LMarker, LIcon, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'
import MarkerCluster from './MarkerCluster.vue'

import { useMapStore } from '@/stores/map'
import { useDistrictsStore } from '@/stores/districts'

defineProps({
    zoom: Number,
    center: [Array, Object],
    markers: Array,
})
const emit = defineEmits(['update:zoom', 'update:center'])

const mapStore = useMapStore()
const districtsStore = useDistrictsStore()

const mapRef = ref(null)
const leafletReady = ref(false)
const focusedDistrict = ref(null)
const iconSize = [30, 30]

const onLeafletReady = async () => {
    await nextTick()
    leafletReady.value = true
}

const handleMapClick = () => {
    focusedDistrict.value = null
}

const poligonReqFormat = (polygon) => {
    if (!polygon || !polygon[0]) return []
    const points = polygon[0][0] ? polygon[0][0] : polygon[0]

    return points.map(element => {
        if (element.latitude && element.longitude) {
            return [element.latitude, element.longitude]
        }
        return [element[0], element[1]]
    })
}

onMounted(async () => {
    await districtsStore.fetchDistricts()
})

watch(() => mapStore.activeLayer, () => {
    leafletReady.value = false
    setTimeout(() => {
        leafletReady.value = true
    }, 0)
})
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
    height: 100vh;
}

.marker-icon {
    max-width: 100% !important;
}
</style>