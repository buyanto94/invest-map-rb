<template>
    <div id="map">
        <l-map ref="mapRef" :zoom="zoom" :center="center" :noBlockingAnimations="true" :options="{ zoomControl: false }"
            @click="handleMapClick" @update:zoom="emit('update:zoom', $event)"
            @update:center="emit('update:center', $event)">
            <l-tile-layer v-if="mapStore.activeLayer" :key="mapStore.activeLayer.name" :max-zoom="18"
                :url="mapStore.activeLayer.url" :subdomains="mapStore.activeLayer.subdomains"
                :name="mapStore.activeLayer.name"></l-tile-layer>

            <l-control-zoom position="topright"></l-control-zoom>

            <marker-cluster>
                <MapFeature v-for="item in markers" :key="item.id" :item="item" />
            </marker-cluster>

            <div v-if="districtsStore.showDistricts">
                <l-polygon v-for="item in districtsStore.items" :key="item.id" :lat-lngs="item.geometry.coordinates"
                    :fillOpacity="0" @click="focusedDistrict = item.id" :weight="item.id === focusedDistrict ? 3 : 1"
                    :fill="true" color="#3388ff">
                    <l-popup>{{ item.name }}</l-popup>
                </l-polygon>
            </div>
        </l-map>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer, LControlZoom, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'
import MarkerCluster from './MarkerCluster.vue'
import MapFeature from './MapFeature.vue'

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
const focusedDistrict = ref(null)

const handleMapClick = () => {
    focusedDistrict.value = null
}
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
    height: 100vh;
    z-index: 1;
}
</style>