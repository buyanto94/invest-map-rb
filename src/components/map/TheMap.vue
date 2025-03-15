<template>
    <div id="map">
        <l-map
            ref="mapRef"
            :zoom="zoom"
            :center="center"
            :noBlockingAnimations="true"
            :options="{ zoomControl: false }"
            @click="handleMapClick"
            @update:zoom="emit('update:zoom', $event)"
            @update:center="emit('update:center', $event)"
            @ready="onLeafletReady"
        >
            <template v-if="leafletReady">
                <l-tile-layer
                    v-if="mapStore.activeLayer"
                    :max-zoom="18"
                    :url="mapStore.activeLayer.url"
                    :subdomains="mapStore.activeLayer.subdomains"
                ></l-tile-layer>
                
                <l-control-zoom position="topright"></l-control-zoom>

                <marker-cluster>
                    <MapFeature 
                        v-for="item in markers" 
                        :key="item.id" 
                        :item="item" 
                    />
                </marker-cluster>

                <div v-if="districtsStore.showDistricts">
                    <l-polygon
                        v-for="item in districtsStore.items"
                        :key="item.id"
                        :lat-lngs="item.geometry.coordinates"
                        :fillOpacity="0"
                        @click="focusedDistrict = item.id"
                        :weight="item.id == focusedDistrict ? 3 : 1"
                        :fill="true"
                    >
                        <l-popup>{{ item.name }}</l-popup>
                    </l-polygon>
                </div>
            </template>
        </l-map>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
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
const leafletReady = ref(false)
const focusedDistrict = ref(null)

const onLeafletReady = async () => {
    await nextTick()
    leafletReady.value = true
}

const handleMapClick = () => {
    focusedDistrict.value = null
}

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
</style>