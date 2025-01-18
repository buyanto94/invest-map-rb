<template>
    <div id="map">
        <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            :noBlockingAnimations="true"
            :options="{ zoomControl: false }"
            @click="handleMapClick"
            @update:zoom="zoomUpdated"
            @update:center="centerUpdated"
            @ready="onLeafletReady"
        >
            <template v-if="leafletReady">
                <l-tile-layer
                    :max-zoom="18"
                    v-if="activeLayer"
                    :url="activeLayer.url"
                    :subdomains="activeLayer.subdomains"
                ></l-tile-layer>
                <l-control-zoom position="topright"></l-control-zoom>

                <marker-cluster>
                    <div v-if="true">
                        <div v-for="item in markers" :key="item.id">
                            <div v-if="Array.isArray(item.coords[0])">
                                <l-polygon
                                    :lat-lngs="poligonReqFormat(item['coords'])"
                                    :fillOpacity="0.2"
                                    :weight="3"
                                    color="#29d321"
                                    fillColor="#29d321"
                                    :visible="item.id == activeObject?.id ? true : false"
                                >
                                    <l-popup>
                                        {{ item['title'] }}
                                    </l-popup>
                                </l-polygon>
                                <l-marker :lat-lng="polygonCenter(item['coords'])" @click="setActiveObject(item)">
                                    <l-icon :icon-size="iconSize">
                                        <img
                                            :src="'https://invest-buryatia.ru' + item['category']['img']"
                                            v-if="item['category']['img']"
                                            :title="item['category']['type']"
                                        />
                                        <img
                                            v-else
                                            :src="
                                                item['category']['type']
                                                    ? iconsMarker[item['category']['type']]
                                                    : iconsMarker['default']
                                            "
                                            :title="item['category']['type']"
                                        />
                                    </l-icon>
                                </l-marker>
                            </div>
                            <div v-else>
                                <l-marker
                                    v-if="item['coords'].length == 2"
                                    :lat-lng="item['coords']"
                                    @click="setActiveObject(item)"
                                >
                                    <l-icon :icon-size="iconSize" class-name="icon-base">
                                        <img
                                            :src="'https://invest-buryatia.ru' + item['category']['img']"
                                            v-if="item['category']['img']"
                                            :title="item['category']['type']"
                                        />
                                        <img
                                            v-else
                                            :src="
                                                item['category']['type']
                                                    ? iconsMarker[item['category']['type']]
                                                    : iconsMarker['default']
                                            "
                                            :title="item['category']['type']"
                                        />
                                    </l-icon>
                                </l-marker>
                            </div>
                        </div>
                    </div>
                </marker-cluster>

                <div v-if="showDistricts">
                    <l-polygon
                        v-for="item in districts"
                        :key="item.id"
                        :lat-lngs="item['geometry']['coordinates']"
                        :fillOpacity="0"
                        @click="focusedDistrict = item.id"
                        :weight="item.id == focusedDistrict ? 3 : 1"
                        :fill="true"
                    >
                        <l-popup>
                            {{ item.name }}
                        </l-popup>
                    </l-polygon>
                </div>
            </template>
        </l-map>
    </div>
</template>

<script>
import { polygonCenter } from '@/utils/polygon'

import { LMap, LTileLayer, LControlZoom, LMarker, LIcon, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'
import MarkerCluster from './MarkerCluster.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
    emits: ['update:zoom', 'update:center'],
    props: {
        zoom: Number,
        center: [Array, Object],
        markers: Array,
    },
    components: {
        LMap,
        LTileLayer,
        LControlZoom,
        LMarker,
        LIcon,
        LPolygon,
        LPopup,
        MarkerCluster,
    },

    data() {
        return {
            leafletReady: false,
            leafletObject: null,
            iconSize: [30, 30],
            focusedDistrict: null,
        }
    },

    computed: {
        ...mapGetters(['activeObject', 'activeLayer', 'showDistricts', 'districts', 'iconsMarker']),
    },

    methods: {
        ...mapActions(['fetchDistricts', 'setActiveObject']),
        zoomUpdated(zoom) {
            this.$emit('update:zoom', zoom)
        },

        centerUpdated(center) {
            this.$emit('update:center', center)
        },

        polygonCenter,

        async onLeafletReady() {
            await this.$nextTick()
            this.leafletObject = this.$refs.map.leafletObject
            this.leafletReady = true
        },
        handleMapClick() {
            this.focusedDistrict = null
        },
    },

    async mounted() {
        await this.fetchDistricts()
    },

    watch: {
        activeLayer() {
            this.leafletReady = false
            setTimeout(() => {
                this.leafletReady = true
            }, 0)
        },
    },
}
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
    height: 100vh;
}
</style>
