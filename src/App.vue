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
            filteredObj: [],
            zoom: 6,
            center: [53.328248, 108.837283],

            filter: null,
            searchResults: [],
            searchResultsText: '',
            getSearchResults: Function,
        }
    },

    computed: {
        ...mapGetters(['activeObject', 'districts', 'showDistricts', 'allObjects', 'layers']),

        filteredByMainParams() {
            if (!this.inputSearch && this.filter) {
                return this.allObjects
                    .filter((item) => {
                        //Фильтер по району municipalArea
                        return item.municipalArea == this.filter.district || this.filter.district == null
                    })
                    .filter((item) => {
                        // Фильтер по категории земель
                        return item.landCategory == this.filter.landCategory || this.filter.landCategory == null
                    })
                    .filter((item) => {
                        // Фильтер по типу
                        return item.typeArea.toLowerCase() == this.filter.typeArea || this.filter.typeArea == null
                    })
                    .filter((item) => {
                        // Фильтер по площади
                        return (
                            +item.area.replace(',', '.') >= this.filter.area[0] &&
                            +item.area.replace(',', '.') <= this.filter.area[1]
                        )
                    })
                    .filter((item) => {
                        // Фильтер по дистанции до уу
                        return (
                            item.distanceToUU >= this.filter.distanceToUU[0] &&
                            item.distanceToUU <= this.filter.distanceToUU[1]
                        )
                    })
                    .filter((item) => {
                        // Фильтер по форме собственности
                        return (
                            item.typeOfOwnership.id == this.filter.typeOfOwnership ||
                            this.filter.typeOfOwnership == null
                        )
                    })
            } else {
                return this.allObjects
            }
        },

        filteredByCheckedChildCategories() {
            if (this.filter) {
                return this.filteredByMainParams.filter((item) => {
                    return this.filter.childCategories.indexOf(item.category.id) != -1
                })
            } else {
                return this.filteredByMainParams
            }
        },

        filterResults() {
            if (this.filter) {
                return this.filteredByCheckedChildCategories.filter((item) => {
                    return this.filter.categoriesGroups.indexOf(item.category.parentId) != -1
                })
            } else {
                return this.filteredByCheckedChildCategories
            }
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
                if (Array.isArray(this.activeObject.coords[0])) {
                    this.center = [...polygonCenter(this.activeObject['coords'])]
                } else {
                    this.center = [...this.activeObject['coords']]
                }
                this.zoom = 18
            }, 1)
        },
    },

    watch: {
        inputSearch() {
            this.getSearchResults()
            this.searchResultsText = 'Ожидаю, когда вы закончите печатать...'
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
        await this.fetchObjects()

        // for debounce start
        const search = () => {
            this.searchResults = []

            const searchText = this.inputSearch.toLowerCase()

            if (searchText !== '') {
                this.searchResults = this.allObjects.filter((item) => {
                    let itemStr = JSON.stringify(item).toLowerCase()

                    return itemStr.indexOf(searchText) != -1
                })

                this.searchResultsText = `Найдено ${this.searchResults.length} объектов`
            }
        }

        this.getSearchResults = _.debounce(search, 500)
        // for debounce end

        let urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('object')) {
            let id = urlParams.get('object')
            let obj = this.allObjects.find((item) => {
                return item.id == id
            })

            this.setActiveObject(obj)
        }

        if (urlParams.has('zoom') && urlParams.has('lat') && urlParams.has('lng')) {
            let zoom = urlParams.get('zoom')
            let lat = urlParams.get('lat')
            let lng = urlParams.get('lng')
            this.zoom = +zoom
            this.center = [lat, lng]
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
