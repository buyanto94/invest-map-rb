<template>
    <the-topbar @mapToBuryatia="showBuryatia" @shareModal="openShareModal" />

    <teleport to="body">
        <app-message />

        <!-- Модалка "Поделиться" -->
        <app-modal v-model:open="isShareModalOpen" scrollable centered size="lg">
            <template #header>
                <h5 class="custom-modal__title">Поделиться картой</h5>
            </template>
            <template #default="{ close }">
                <ShareModal @copied="close" :zoom="zoom" :center="center" />
            </template>
        </app-modal>

        <!-- Модалка "Выбор карты" в мобильной версии -->
        <app-modal v-model:open="isMapSelectModalOpen" centered>
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
                    <the-navbar @mapToBuryatia="showBuryatia" @shareModal="openShareModal"
                        @selectMapModal="openMapSelectModal" />
                </div>
                <div class="panels__item">
                    <filter-panel />
                </div>
                <div class="panels__item">
                    <object-details />
                </div>
            </div>
        </div>
        <div class="col">
            <the-map :markers="filtersStore.filteredObjects" v-model:zoom="zoom" v-model:center="center" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

import { useMapStore } from '@/stores/map'
import { useUIStore } from '@/stores/ui'
import { useFiltersStore } from '@/stores/filters'
import { useAppInit } from '@/composables/useAppInit'
import { useMapControl } from '@/composables/useMapControl'
import { useUrlSync } from '@/composables/useUrlSync'

import AppModal from './components/ui/AppModal.vue'
import AppMessage from './components/ui/AppMessage.vue'
import TheTopbar from './components/layout/TheTopbar.vue'
import TheNavbar from './components/layout/TheNavbar.vue'
import TheMap from './components/map/TheMap.vue'
import FilterPanel from './components/features/FilterPanel.vue'
import ObjectDetails from './components/features/ObjectDetails.vue'
import ShareModal from './components/features/ShareModal.vue'
import SelectMapModal from './components/map/SelectMapModal.vue'

const mapStore = useMapStore()
const uiStore = useUIStore()
const filtersStore = useFiltersStore()

const { init } = useAppInit()
const { initializeFromUrl } = useUrlSync()

const { zoom, center, showBuryatia, focusOnObject } = useMapControl()

watch(
    () => mapStore.activeObject,
    (newVal) => {
        if (newVal) {
            focusOnObject(newVal)
        }
    }
)

// Модалки
const isShareModalOpen = ref(false)
const openShareModal = () => isShareModalOpen.value = true

const isMapSelectModalOpen = ref(false)
const openMapSelectModal = () => isMapSelectModalOpen.value = true

onMounted(async () => {
    await init()
    
    initializeFromUrl((z, c) => {
        zoom.value = z
        center.value = c
    })

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