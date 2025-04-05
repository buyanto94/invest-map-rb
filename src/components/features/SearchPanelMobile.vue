<template>
    <div class="search-panel" v-show="uiStore.showSearchPanel">
        <div class="search-panel__close" @click="closeSearchPanel">
            <i class="fa fa-times"></i>
        </div>
        <div class="search-panel__header">
            <input 
                type="search" 
                class="form-control custom-input search-panel__input" 
                v-model="filtersStore.inputSearch"
                placeholder="Поиск объектов" 
            />
            <div class="search-panel__nav" v-if="filtersStore.inputSearch">
                <div class="search-panel__text">{{ filtersStore.searchResultsText }}</div>
                <a class="search-panel__nav-btn" data-bs-toggle="collapse" href="#search-panel-body">
                    <i :class="isBodyExpanded ? 'fa fa-globe' : 'fa fa-list'"></i>
                </a>
            </div>
        </div>
        <div class="collapse" id="search-panel-body">
            <div class="search-panel__body custom-scroll">
                <div 
                    class="search-result" 
                    v-for="item in filtersStore.filteredObjects" 
                    :key="item.id"
                    @click="onSearchResultClick(item)" 
                    :class="{ active: mapStore.activeObject?.id === item.id }"
                >
                    <div class="search-result__category">{{ item.category?.name }}</div>
                    <div class="search-result__title">{{ item.title }}</div>
                    <div class="search-result__address">{{ item.address }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useUIStore } from '@/stores/ui'
import { useMapStore } from '@/stores/map'
import { useFiltersStore } from '@/stores/filters'

const uiStore = useUIStore()
const mapStore = useMapStore()
const filtersStore = useFiltersStore()

const isBodyExpanded = ref(false)

const closeSearchPanel = () => {
    mapStore.setActiveObject(null)
    filtersStore.inputSearch = ''
    uiStore.setShowSearchPanel(false)
}

const onSearchResultClick = (item) => {
    mapStore.setActiveObject(item)
    const el = document.getElementById('search-panel-body')
    if (el) new bootstrap.Collapse(el).hide()
}

onMounted(() => {
    const searchCollapse = document.getElementById('search-panel-body')
    if (searchCollapse) {
        searchCollapse.addEventListener('shown.bs.collapse', () => isBodyExpanded.value = true)
        searchCollapse.addEventListener('hidden.bs.collapse', () => isBodyExpanded.value = false)
    }
})
</script>