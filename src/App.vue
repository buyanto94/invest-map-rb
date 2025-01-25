<template>
    <the-topbar @mapToBuryatia="showBuryatia" @shareModal="shareModal = true" />
    <teleport to="body">
        <app-message />
        <app-modal v-model:open="shareModal" scrollable centered size="lg">
            <template #header>
                <h5 class="custom-modal__title">Поделиться картой</h5>
            </template>
            <template #default="{ close }">
                <share-modal @copied="close" :zoom="zoom" :center="center" />
            </template>
        </app-modal>
        <app-modal v-model:open="selectMapModal" centered>
            <template #header>
                <h5 class="custom-modal__title">Выбрать карту</h5>
            </template>
            <select-map-modal />
        </app-modal>
    </teleport>

    <div class="row g-0 h-100">
        <div class="col-auto">
            <div class="panels">
                <div class="panels__item">
                    <the-navbar
                        @mapToBuryatia="showBuryatia"
                        @shareModal="shareModal = true"
                        @selectMapModal="selectMapModal = true"
                    />
                </div>
                <div class="panels__item">
                    <filter-panel
                        v-model="filter"
                        :findObjects="findObjects"
                        :findObjectsByParams="filteredByMainParams"
                        :searchingMessage="searchResultsText"
                    />
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

    <div
        class="d-none"
        style="z-index: 99999; position: fixed; top: 0; left: 50%; width: auto; height: 90vh; overflow: scroll"
    >
        <div class="bg-light">
            <pre>
                {{ filter }}
            </pre>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { polygonCenter } from '@/utils/polygon'
import { filterObjects, searchObjects } from '@/utils/filter-objects'

import AppModal from './components/ui/AppModal'
import AppMessage from './components/ui/AppMessage'
import TheTopbar from './components/TheTopbar'
import TheNavbar from './components/TheNavbar'
import TheMap from './components/TheMap'
import FilterPanel from './components/FilterPanel.vue'
import ObjectDetails from './components/ObjectDetails.vue'
import ShareModal from './components/share/ShareModal.vue'
import SelectMapModal from './components/SelectMapModal.vue'

export default {
    name: 'App',
    components: {
        AppModal,
        AppMessage,
        TheTopbar,
        TheNavbar,
        FilterPanel,
        ObjectDetails,
        TheMap,
        ShareModal,
        SelectMapModal,
    },
    data() {
        return {
            shareModal: false,
            selectMapModal: false,
            zoom: 6,
            center: [53.328248, 108.837283],
            filter: null,
            searchResults: [],
            searchResultsText: '',
            debouncedSearch: null,
        }
    },

    computed: {
        ...mapGetters(['activeObject', 'districts', 'showDistricts', 'allObjects', 'layers']),

        filteredByMainParams() {
            if (!this.filter) return this.allObjects
            
            const countFilter = { 
                ...this.filter, 
                childCategories: [], 
                categoriesGroups: [] 
            }
            return filterObjects(this.allObjects, countFilter)
        },

        filterResults() {
            return filterObjects(this.allObjects, this.filter)
        },

        inputSearch() {
            return this.filter ? this.filter.inputSearch : ''
        },

        findObjects() {
            if (this.inputSearch) {
                return this.searchResults
            } else {
                return this.filterResults
            }
        },
    },

    methods: {
        ...mapActions([
            'setActiveObject',
            'setActiveLayer',
            'fetchDistricts',
            'fetchObjects',
            'setShowDistricts',
            'setShowFilterPanel',
        ]),

        showBuryatia() {
            this.zoom = 6
            this.center = [53.328248, 108.837283]
        },

        showObjectInfo() {
            this.zoom = 16

            setTimeout(() => {
                if (!this.activeObject) return;
                
                if (Array.isArray(this.activeObject.coords[0])) {
                    this.center = [...polygonCenter(this.activeObject['coords'])]
                } else {
                    this.center = [...this.activeObject['coords']]
                }
                this.zoom = 18
            }, 1)
        },

        performSearch() {
            this.searchResults = []
            const searchText = this.inputSearch

            if (searchText) {
                this.searchResults = searchObjects(this.allObjects, searchText)
                this.searchResultsText = `Найдено ${this.searchResults.length} объектов`
            }
        }
    },

    watch: {
        inputSearch() {
            this.searchResultsText = 'Поиск...'
            this.debouncedSearch()
        },

        activeObject(val, oldVal) {
            if (!val && oldVal) {
                this.zoom = 11
                setTimeout(() => {
                    if (Array.isArray(oldVal.coords[0])) {
                        this.center = [...polygonCenter(oldVal['coords'])]
                    } else {
                        this.center = [...oldVal['coords']]
                    }
                    this.zoom = 8
                }, 1)
            }

            if (val) {
                this.showObjectInfo()
            }
        },
    },

    async mounted() {
        this.debouncedSearch = _.debounce(this.performSearch, 500)

        await this.fetchObjects()

        // Обработка URL параметров (если ссылка на конкретный объект)
        const urlParams = new URLSearchParams(window.location.search)
        
        if (urlParams.has('object')) {
            const id = urlParams.get('object')
            const obj = this.allObjects.find((item) => item.id == id)
            if (obj) this.setActiveObject(obj)
        }

        if (urlParams.has('zoom') && urlParams.has('lat') && urlParams.has('lng')) {
            this.zoom = +urlParams.get('zoom')
            this.center = [urlParams.get('lat'), urlParams.get('lng')]
        }

        if (window.innerWidth >= 992) {
            this.setShowFilterPanel(true)
        }
    },
}
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
