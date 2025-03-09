<template>
    <div class="filter-panel" v-show="uiStore.showFilterPanel">
        <div class="filter-panel__header">
            <div class="row mb-4 mb-lg-5">
                <div class="col my-auto">
                    <a href="/">
                        <img src="@/assets/logo.png" alt="" class="filter-panel__logo d-none d-lg-block" />
                    </a>
                </div>
                <div class="col-auto">
                    <div class="filter-panel__close d-none d-lg-flex" @click="uiStore.setShowFilterPanel(false)">
                        <img src="@/assets/sidebar/arrow-left.png" alt="" />
                    </div>
                    <button class="filter-panel__btn d-lg-none" @click="uiStore.setShowFilterPanel(false)">
                        Применить фильтр
                    </button>
                </div>
            </div>

            <div class="mb-3 d-none d-lg-block">
                <input type="search" class="form-control custom-input" v-model="inputSearch"
                    placeholder="Поиск объектов" />
            </div>

            <div class="mb-3" v-if="!inputSearch">
                <app-select :options="formatingToOptions(districtsStore.items, 'name', 'id')"
                    @select="selectedDistrict = $event" :selected="selectedDistrict.name"
                    :nullOption="{ name: 'Все районы', value: null }" />
            </div>
        </div>

        <SearchResults v-if="inputSearch" :items="findObjects" :message="searchingMessage"
            :activeId="mapStore.activeObject?.id" @select="onSearchResultClick" />

        <div class="filter-panel__body custom-scroll" v-else>
            <div class="accordion filter-accordion" id="filter-accordion">
                <div class="mb-3" v-for="item in referencesStore.categoryGroups" :key="item.id">
                    <div @click="toggleCollapse('accordion-' + item.id)" class="accordion-btn">
                        <label class="checkbox-btn" @click.stop>
                            <input type="checkbox" :value="item.id" v-model="checkedCategoriesGroups" />
                            <div class="checkbox-btn__cont">
                                <i :class="item.type === 'filter' ? 'fa fa-map-o' : 'fa fa-sun-o'"></i>
                            </div>
                        </label>
                        {{ item.name }}
                        <div class="accordion-btn__count">{{ countOfCategoryGroup(item.id) }}</div>
                    </div>

                    <div class="collapse accordion-collapse show" :id="'accordion-' + item.id">
                        <div class="py-3" v-if="item.type === 'filter'">
                            <FilterControls
                                :landCategories="formatingToOptions(referencesStore.landCategories, 'title', 'id')"
                                :ownershipTypes="formatingToOptions(referencesStore.ownershipTypes, 'title', 'id')"
                                v-model:selectedLandCategory="selectedLandCategories"
                                v-model:selectedOwnership="selectedTypeOfOwnership" v-model:typeArea="selectedTypeArea"
                                v-model:area="area" :areaMarks="areaMarks" v-model:distances="distances"
                                :distancesMarks="distancesMarks" />

                            <div class="mb-3">
                                <label class="category-checkbox" v-for="ch in item.child" :key="ch.id">
                                    <input type="checkbox" :value="ch.id" v-model="checkedChildCategories" />
                                    <div class="category-checkbox__btn">
                                        <img :src="'https://invest-buryatia.ru' + ch.img" v-if="ch.img" />
                                        <img :src="ch.type ? mapStore.icons[ch.type] : mapStore.icons['default']"
                                            v-else />
                                    </div>
                                    <div class="category-checkbox__text">{{ ch.name }}</div>
                                    <div class="category-checkbox__count">{{ countOfCategory(ch.id) }}</div>
                                </label>
                            </div>
                            <button class="btn btn-light" @click="checkedChildCategories = []">Сбросить фильтр
                                категорий</button>
                        </div>

                        <div class="py-3 px-2" v-else>
                            <div v-for="obj in freeCategory(item.child[0].id)" :key="obj.id">
                                <div class="free-category-item" @click="mapStore.setActiveObject(obj)">{{ obj.title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="search-panel" v-show="uiStore.showSearchPanel">
        <div class="search-panel__close" @click="closeSearchPanel">
            <i class="fa fa-times"></i>
        </div>
        <div class="search-panel__header">
            <input type="search" class="form-control custom-input search-panel__input" v-model="inputSearch"
                placeholder="Поиск объектов" />
            <div class="search-panel__nav" v-if="inputSearch">
                <div class="search-panel__text">{{ searchingMessage }}</div>
                <a class="search-panel__nav-btn" data-bs-toggle="collapse" href="#search-panel-body">
                    <i :class="searchPanelBody ? 'fa fa-globe' : 'fa fa-list'"></i>
                </a>
            </div>
        </div>
        <div class="collapse" id="search-panel-body">
            <div class="search-panel__body custom-scroll">
                <div class="search-result" v-for="item in findObjects" :key="item.id" @click="onSearchResultClick(item)"
                    :class="{ active: mapStore.activeObject?.id === item.id }">
                    <div class="search-result__category">{{ item.category?.name }}</div>
                    <div class="search-result__title">{{ item.title }}</div>
                    <div class="search-result__address">{{ item.address }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AppSelect from '@/components/ui/AppSelect.vue'

import SearchResults from './filter/SearchResults.vue'
import FilterControls from './filter/FilterControls.vue'

import { useUIStore } from '@/stores/ui'
import { useReferencesStore } from '@/stores/references'
import { useDistrictsStore } from '@/stores/districts'
import { useObjectsStore } from '@/stores/objects'
import { useMapStore } from '@/stores/map'

const props = defineProps({
    findObjects: Array,
    findObjectsByParams: Array,
    modelValue: Object,
    searchingMessage: String,
})

const emit = defineEmits(['update:modelValue'])

const uiStore = useUIStore()
const referencesStore = useReferencesStore()
const districtsStore = useDistrictsStore()
const objectsStore = useObjectsStore()
const mapStore = useMapStore()

const inputSearch = ref('')
const searchPanelBody = ref(false)

const distancesMarks = ref([0, 1])
const areaMarks = ref([0, 1])

const checkedChildCategories = ref([])
const checkedCategoriesGroups = ref([])
const area = ref([0, 0])
const distances = ref([0, 0])
const selectedDistrict = ref({ name: 'Все районы', value: null })
const selectedLandCategories = ref({ name: 'Категория земель', value: null })
const selectedTypeArea = ref(null)
const selectedTypeOfOwnership = ref({ name: 'Форма собственности', value: null })

const formatingToOptions = (options, nameKey, valueKey) => {
    return options.map(item => ({ name: item[nameKey], value: item[valueKey] }))
}

const toggleCollapse = (id) => {
    const el = document.getElementById(id)
    if (el) new bootstrap.Collapse(el).toggle()
}

const countOfCategory = (id) => {
    return props.findObjectsByParams.filter(item => item.category.id === id).length
}

const countOfCategoryGroup = (id) => {
    return props.findObjectsByParams.filter(item => +item.category.parentId === +id).length
}

const freeCategory = (categoryId) => {
    return objectsStore.items.filter(item => categoryId === item.category.id)
}

const closeSearchPanel = () => {
    mapStore.setActiveObject(null)
    inputSearch.value = ''
    uiStore.setShowSearchPanel(false)
}

const onSearchResultClick = (item) => {
    mapStore.setActiveObject(item)
    const el = document.getElementById('search-panel-body')
    if (el) new bootstrap.Collapse(el).hide()
}

const initStartParams = () => {
    if (!objectsStore.items || objectsStore.items.length === 0) return

    let areaMax = 0
    let distanceMax = 0

    objectsStore.items.forEach(item => {
        if (+item.distanceToUU > distanceMax) distanceMax = +item.distanceToUU
        const itemArea = parseFloat(item.area.replace(',', '.'))
        if (itemArea > areaMax) areaMax = itemArea

        if (!checkedChildCategories.value.includes(item.category.id)) {
            checkedChildCategories.value.push(item.category.id)
        }
        if (!checkedCategoriesGroups.value.includes(item.category.parentId)) {
            checkedCategoriesGroups.value.push(item.category.parentId)
        }
    })

    areaMax = Math.ceil(areaMax)
    distanceMax = Math.ceil(distanceMax)

    distancesMarks.value = [0, distanceMax]
    areaMarks.value = [0, areaMax]

    if (distances.value[1] === 0) distances.value = [0, distanceMax]
    if (area.value[1] === 0) area.value = [0, areaMax]
}

watch([
    inputSearch,
    checkedChildCategories,
    checkedCategoriesGroups,
    area,
    distances,
    selectedDistrict,
    selectedLandCategories,
    selectedTypeArea,
    selectedTypeOfOwnership
], () => {
    emit('update:modelValue', {
        inputSearch: inputSearch.value,
        childCategories: checkedChildCategories.value,
        categoriesGroups: checkedCategoriesGroups.value,
        area: area.value,
        distanceToUU: distances.value,
        district: selectedDistrict.value.value,
        landCategory: selectedLandCategories.value.value,
        typeArea: selectedTypeArea.value,
        typeOfOwnership: selectedTypeOfOwnership.value.value,
    })
}, { deep: true })

watch(() => objectsStore.items, () => {
    initStartParams()
}, { immediate: true })

onMounted(async () => {
    const searchCollapse = document.getElementById('search-panel-body')
    if (searchCollapse) {
        searchCollapse.addEventListener('shown.bs.collapse', () => searchPanelBody.value = true)
        searchCollapse.addEventListener('hidden.bs.collapse', () => searchPanelBody.value = false)
    }

    await Promise.all([
        referencesStore.fetchCategoryGroups(),
        referencesStore.fetchOwnershipTypes()
    ])
})
</script>