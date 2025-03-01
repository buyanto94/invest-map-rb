<template>
    <div style="display: none">
        <slot v-if="ready"></slot>
    </div>
</template>

<script setup>
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { inject, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs } from 'vue'
import { propsBinder, remapEvents } from '@vue-leaflet/vue-leaflet/src/utils'
import { setup as layerSetup } from '@vue-leaflet/vue-leaflet/src/functions/layer'

const props = defineProps({
    options: {
        type: Object,
        default: () => ({}),
    },
})

const leafletRef = ref({})
const ready = ref(false)
const attrs = useAttrs()

const addLayerToMainMap = inject('addLayer')
const removeLayerFromMainMap = inject('removeLayer')

provide('canSetParentHtml', () => !!leafletRef.value.getElement())
provide('setParentHtml', (html) => (leafletRef.value.getElement().innerHTML = html))
provide('addLayer', (layer) => leafletRef.value.addLayer(layer.leafletObject))
provide('removeLayer', (layer) => leafletRef.value.removeLayer(layer.leafletObject))

const { methods } = layerSetup(props, leafletRef, { attrs })

onMounted(async () => {
    const { DomEvent } = await import('leaflet/dist/leaflet-src.esm')
    const { MarkerClusterGroup } = await import('leaflet.markercluster/dist/leaflet.markercluster-src.js')

    leafletRef.value = new MarkerClusterGroup(props.options)

    const listeners = remapEvents(attrs)
    DomEvent.on(leafletRef.value, listeners)

    propsBinder(methods, leafletRef.value, props)

    addLayerToMainMap({
        ...props,
        ...methods,
        leafletObject: leafletRef.value,
    })

    ready.value = true
    nextTick(() => attrs.onReady?.(leafletRef.value))
})

onBeforeUnmount(() => {
    if (leafletRef.value && leafletRef.value._leaflet_id) {
        removeLayerFromMainMap({ leafletObject: leafletRef.value })
    }
})
</script>