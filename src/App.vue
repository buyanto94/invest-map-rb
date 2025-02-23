<template>
    <the-topbar @mapToBuryatia="showBuryatia" @shareModal="shareModal = true" />
    <teleport to="body">
        <app-message />
        <app-modal v-model:open="shareModal" scrollable centered size="lg">
            <template #header>
                <h5 class="custom-modal__title">Поделиться картой</h5>
            </template>
            <template #default="{ close }">
                <ShareModal @copied="close" :zoom="zoom" :center="center" />
            </template>
        </app-modal>
        <app-modal v-model:open="selectMapModal" centered>
            <template #header>
                <h5 class="custom-modal__title">Выбрать карту</h5>
            </template>
            <SelectMapModal />
        </app-modal>
    </teleport>

    <div class="row g-0 h-100">
        <div class="col-auto">
            <div class="panels">
                <div class="panels__item">
                    <the-navbar @mapToBuryatia="showBuryatia" @shareModal="shareModal = true"
                        @selectMapModal="selectMapModal = true" />
                </div>
                <div class="panels__item">
                    <filter-panel v-model="filter" :findObjects="findObjects"
                        :findObjectsByParams="filteredByMainParams" :searchingMessage="searchResultsText" />
                </div>
                <div class="panels__item">
                    <object-details />
                </div>
            </div>
        </div>
        <div class="col">
            <the-map :markers="findObjects" v-model:zoom="zoom" v-model:center="center" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import _ from 'lodash'
import { polygonCenter } from '@/utils/polygon'
import { filterObjects, searchObjects } from '@/utils/filter-objects'

import { useObjectsStore } from '@/stores/objects'
import { useMapStore } from '@/stores/map'
import { useUIStore } from '@/stores/ui'

import AppModal from './components/ui/AppModal.vue'
import AppMessage from './components/ui/AppMessage.vue'
import TheTopbar from './components/TheTopbar.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheMap from './components/TheMap.vue'
import FilterPanel from './components/FilterPanel.vue'
import ObjectDetails from './components/ObjectDetails.vue'
import ShareModal from './components/share/ShareModal.vue'
import SelectMapModal from './components/SelectMapModal.vue'

const objectsStore = useObjectsStore()
const mapStore = useMapStore()
const uiStore = useUIStore()

const shareModal = ref(false)
const selectMapModal = ref(false)
const zoom = ref(6)
const center = ref([53.328248, 108.837283])
const filter = ref(null)
const searchResults = ref([])
const searchResultsText = ref('')

const inputSearch = computed(() => filter.value ? filter.value.inputSearch : '')

const filteredByMainParams = computed(() => {
    if (!filter.value) return objectsStore.items
    const countFilter = { ...filter.value, childCategories: [], categoriesGroups: [] }
    return filterObjects(objectsStore.items, countFilter)
})

const filterResults = computed(() => {
    return filterObjects(objectsStore.items, filter.value)
})

const findObjects = computed(() => {
    if (inputSearch.value) {
        return searchResults.value
    } else {
        return filterResults.value
    }
})

const showBuryatia = () => {
    zoom.value = 6
    center.value = [53.328248, 108.837283]
}

const showObjectInfo = () => {
    setTimeout(() => {
        const obj = mapStore.activeObject
        if (!obj) return

        if (Array.isArray(obj.coords[0])) {
            center.value = [...polygonCenter(obj.coords)]
        } else {
            center.value = [...obj.coords]
        }
        zoom.value = 18
    }, 10)
}

const performSearch = () => {
    searchResults.value = []
    const searchText = inputSearch.value

    if (searchText) {
        searchResults.value = searchObjects(objectsStore.items, searchText)
        searchResultsText.value = `Найдено ${searchResults.value.length} объектов`
    }
}

const debouncedSearch = _.debounce(performSearch, 500)

watch(inputSearch, () => {
    searchResultsText.value = 'Поиск...'
    debouncedSearch()
})

watch(() => mapStore.activeObject, (val, oldVal) => {
    if (!val && oldVal) {
        setTimeout(() => {
            if (Array.isArray(oldVal.coords[0])) {
                center.value = [...polygonCenter(oldVal.coords)]
            } else {
                center.value = [...oldVal.coords]
            }
            zoom.value = 8
        }, 10)
    }
    if (val) {
        showObjectInfo()
    }
})

onMounted(async () => {
    await objectsStore.fetchObjects()

    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.has('object')) {
        const id = urlParams.get('object')
        const obj = objectsStore.items.find((item) => item.id == id)
        if (obj) mapStore.setActiveObject(obj)
    }

    if (urlParams.has('zoom') && urlParams.has('lat') && urlParams.has('lng')) {
        zoom.value = +urlParams.get('zoom')
        center.value = [urlParams.get('lat'), urlParams.get('lng')]
    }

    if (window.innerWidth >= 992) {
        uiStore.setShowFilterPanel(true)
    }
})
</script>

<style lang="scss" scoped>
.panels {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    top: 0;
    left: 0;
    margin: 0;
    z-index: 1000;

    a {
        text-decoration: none;
    }

    &__item {
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
    }
}
</style>