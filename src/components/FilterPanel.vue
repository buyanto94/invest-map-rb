<template>
    <div class="filter-panel" v-show="store.getters.showFilterPanel">
        <div class="filter-panel__header">
            <div class="row mb-4 mb-lg-5">
                <div class="col my-auto">
                    <a href="/">
                        <img src="./../assets/logo.png" alt="" class="filter-panel__logo d-none d-lg-block" />
                    </a>
                </div>
                <div class="col-auto">
                    <div class="filter-panel__close d-none d-lg-flex"
                        @click="store.dispatch('setShowFilterPanel', false)">
                        <img src="./../assets/sidebar/arrow-left.png" alt="" />
                    </div>
                    <button class="filter-panel__btn d-lg-none" @click="store.dispatch('setShowFilterPanel', false)">
                        Применить фильтр
                    </button>
                </div>
            </div>

            <div class="mb-3 d-none d-lg-block">
                <input type="search" class="form-control custom-input" v-model="inputSearch"
                    placeholder="Поиск объектов" />
            </div>

            <div class="mb-3" v-if="!inputSearch">
                <app-select :options="formatingToOptions(districts, 'name', 'id')" @select="selectedDistrict = $event"
                    :selected="selectedDistrict.name" :nullOption="{ name: 'Все районы', value: null }" />
            </div>
        </div>

        <div class="search-results" v-if="inputSearch">
            <div class="search-results__text">{{ searchingMessage }}</div>
            <div class="filter-panel__body search-body custom-scroll">
                <div class="search-result" v-for="item in findObjects" :key="item.id"
                    @click="store.dispatch('setActiveObject', item)"
                    :class="{ active: store.getters.activeObject?.id === item.id }">
                    <div class="search-result__category">{{ item.category?.name }}</div>
                    <div class="search-result__title">{{ item.title }}</div>
                    <div class="search-result__address">{{ item.address }}</div>
                </div>
            </div>
        </div>

        <div class="filter-panel__body custom-scroll" v-else>
            <div class="accordion filter-accordion" id="filter-accordion">
                <div class="mb-3" v-for="item in allCategoryGroup" :key="item.id">
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
                            <div class="mb-3">
                                <app-select :options="formatingToOptions(allLandCategories, 'title', 'id')"
                                    @select="selectedLandCategories = $event" :selected="selectedLandCategories.name"
                                    :nullOption="{ name: 'Категория земель', value: null }" />
                            </div>
                            <div class="mb-3">
                                <label>Тип</label>
                                <div class="radio-bts">
                                    <div class="radio-bts__item" :class="{ active: selectedTypeArea === 'greenfield' }"
                                        @click="selectTypeArea('greenfield')">
                                        <label>Greenfield</label>
                                    </div>
                                    <div class="radio-bts__item" :class="{ active: selectedTypeArea === 'brownfield' }"
                                        @click="selectTypeArea('brownfield')">
                                        <label>Brownfield</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label>Общая площадь (га)</label>
                                <div class="filter-slider">
                                    <Slider v-model="area" :min="areaMarks[0]" :max="areaMarks[1]"
                                        tooltipPosition="bottom" />
                                </div>
                            </div>
                            <div class="mb-3">
                                <app-select :options="formatingToOptions(allTypeOfOwnership, 'title', 'id')"
                                    @select="selectedTypeOfOwnership = $event" :selected="selectedTypeOfOwnership.name"
                                    :nullOption="{ name: 'Форма собственности', value: null }" />
                            </div>
                            <div class="mb-3">
                                <label>До Улан-Удэ (км)</label>
                                <div class="filter-slider">
                                    <Slider v-model="distances" :min="distancesMarks[0]" :max="distancesMarks[1]"
                                        tooltipPosition="bottom" />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="category-checkbox" v-for="ch in item.child" :key="ch.id">
                                    <input type="checkbox" :value="ch.id" v-model="checkedChildCategories" />
                                    <div class="category-checkbox__btn">
                                        <img :src="'https://invest-buryatia.ru' + ch.img" v-if="ch.img" />
                                        <img :src="ch.type ? iconsMarker[ch.type] : iconsMarker['default']" v-else />
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
                                <div class="free-category-item" @click="store.dispatch('setActiveObject', obj)">{{
                                    obj.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="search-panel" v-show="store.getters.showSearchPanel">
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
                    :class="{ active: store.getters.activeObject?.id === item.id }">
                    <div class="search-result__category">{{ item.category?.name }}</div>
                    <div class="search-result__title">{{ item.title }}</div>
                    <div class="search-result__address">{{ item.address }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Slider from '@vueform/slider'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AppSelect from '@/components/ui/AppSelect.vue'

const props = defineProps({
    findObjects: Array,
    findObjectsByParams: Array,
    modelValue: Object,
    searchingMessage: String,
})

const emit = defineEmits(['update:modelValue'])
const store = useStore()

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

const allCategoryGroup = computed(() => store.getters.allCategoryGroup)
const allTypeOfOwnership = computed(() => store.getters.allTypeOfOwnership)
const allLandCategories = computed(() => store.getters.allLandCategories)
const districts = computed(() => store.getters.districts)
const allObjects = computed(() => store.getters.allObjects)
const iconsMarker = computed(() => store.getters.iconsMarker)

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
    return allObjects.value.filter(item => categoryId === item.category.id)
}

const selectTypeArea = (type) => {
    selectedTypeArea.value = selectedTypeArea.value === type ? null : type
}

const closeSearchPanel = () => {
    store.dispatch('setActiveObject', null)
    inputSearch.value = ''
    store.dispatch('setShowSearchPanel', false)
}

const onSearchResultClick = (item) => {
    store.dispatch('setActiveObject', item)
    const el = document.getElementById('search-panel-body')
    if (el) new bootstrap.Collapse(el).hide()
}

const initStartParams = () => {
    if (!allObjects.value || allObjects.value.length === 0) return

    let areaMax = 0
    let distanceMax = 0
    
    allObjects.value.forEach(item => {
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

watch(allObjects, () => {
    initStartParams()
    
}, { immediate: true })

onMounted(async () => {
    const searchCollapse = document.getElementById('search-panel-body')
    if (searchCollapse) {
        searchCollapse.addEventListener('shown.bs.collapse', () => searchPanelBody.value = true)
        searchCollapse.addEventListener('hidden.bs.collapse', () => searchPanelBody.value = false)
    }

    await Promise.all([
        store.dispatch('fetchCategoryGroup'),
        store.dispatch('fetchTypeOfOwnership')
    ])
})
</script>

<style lang="scss" scoped>
.filter-panel {
    color: #000;
    height: 100vh;
    width: 360px;
    filter: drop-shadow(7px 0px 11px rgba(5, 7, 64, 0.15));
    background: url(@/assets/img/filter-bg-1.png) bottom left / contain no-repeat,
        url(@/assets/img/filter-bg-2.png) bottom right / 196px no-repeat;
    background-color: #fff;

    @media (max-width: 991.98px) {
        width: 100%;
        position: fixed;
    }

    &__header {
        padding: 24px 20px 0px;
    }

    &__btn {
        height: 40px;
        padding: 0 14px;
        border-radius: 40px;
        background: #292e91;
        color: #fff;
        cursor: pointer;
        border: none;
    }

    &__logo {
        display: inline-block;
        width: 255px;
        margin-right: 10px;
    }

    &__close {
        width: 31px;
        height: 63px;
        background: rgba(41, 46, 145, 0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 24px;
        }
    }

    &__body {
        margin: 0;
        padding: 0 20px;
        width: 100%;
        height: calc(100vh - 275px);
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        &.search-body {
            height: calc(100vh - 320px);
        }
    }
}

.search-panel {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100vw;
    background-color: #fff;

    @media (min-width: 992px) {
        display: none;
    }

    &__close {
        position: absolute;
        right: 20px;
        top: 45px;
        transform: translate(0, -50%);
        font-size: 35px;
    }

    &__input {
        width: calc(100% - 50px);
    }

    &__header {
        padding: 20px;
    }

    &__body {
        max-height: calc(100vh - 134px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    &__nav {
        padding-top: 20px;
        position: relative;

        &-btn {
            position: absolute;
            right: 0;
            top: 20px;
            color: inherit;

            &:hover {
                color: inherit;
            }
        }
    }
}

.filter-accordion {
    width: 100%;
    overflow-y: visible;
}

.filter-slider {
    padding: 0 15px;
    margin-top: 10px;
    margin-bottom: 50px;
}

.accordion-btn {
    display: block;
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 60px;
    background-color: #292e91;
    color: #fff;
    padding: 10px 35px 0 55px;
    font-size: 15px;
    line-height: 36px;

    &__count {
        position: absolute;
        font-weight: bold;
        top: 50%;
        right: 8px;
        transform: translate(0, -50%);
    }
}

.checkbox-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    user-select: none;
    margin: 0;

    input {
        display: none;
    }

    &__cont {
        background-color: #fff;
        display: block;
        width: 36px;
        height: 36px;
        border-radius: 36px;
        transition: background 0.2s ease;
        font-size: 18px;
        line-height: 36px;
        text-align: center;
        color: rgb(113, 113, 113);
        cursor: pointer;
    }

    input:checked+&__cont {
        color: #fff;
        background: linear-gradient(95.48deg, #f7ce38 -7.1%, #fc210d 97.71%);
    }
}

.category-checkbox {
    position: relative;
    user-select: none;
    display: flex;
    cursor: pointer;
    margin-bottom: 10px;
    min-height: 36px;
    padding-right: 36px;
    align-items: center;

    input {
        display: none;
    }

    &__btn {
        background-color: #ddd;
        width: 36px;
        height: 36px;
        border-radius: 36px;
        transition: background 0.2s ease;
        margin-right: 10px;
        flex-shrink: 0;
        filter: grayscale(100%);
        opacity: 0.5;

        img {
            width: 100%;
        }
    }

    &__text {
        flex-grow: 1;
    }

    &__count {
        position: absolute;
        font-weight: bold;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
    }

    input:checked+&__btn {
        filter: grayscale(0);
        opacity: 1;
    }
}

.search-results__text {
    margin: 0 20px 20px;
}

.search-result {
    border-bottom: 2px solid #292e91;
    cursor: pointer;
    padding: 20px;

    &.active {
        background-color: #292e91;

        * {
            color: #fff;
        }
    }

    &:last-child {
        border-bottom: 0;
    }

    &__category {
        margin-bottom: 6px;
        font-weight: 600;
        color: #292e91;
        text-transform: uppercase;
    }

    &__title {
        color: #292e91;
        font-size: 16px;
        margin-bottom: 6px;
        opacity: 0.8;
    }

    &__address {
        opacity: 0.5;
        font-size: 13px;
        color: #292e91;
    }
}

.radio-bts {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    padding: 1px;
    background: linear-gradient(302.38deg, #292ec4 -32.56%, #4ca9df 92.35%);

    &__item {
        flex-basis: 0;
        flex-grow: 1;
        text-align: center;

        label {
            background-color: #f5f5fa;
            font-weight: 600;
            color: #292e91;
            display: block;
            cursor: pointer;
            padding: 15px 10px;
            font-size: 16px;
            margin: 0;
            border-right: 1px solid #4ca9df;
        }

        &:first-child label {
            border-radius: 1px 0 0 1px;
            border-left: none;
        }

        &:last-child label {
            border-radius: 0 1px 1px 0;
            border-right: none;
        }

        &.active label {
            background: #292e91;
            color: #fff;
        }
    }
}

.free-category-item {
    cursor: pointer;
    margin-bottom: 8px;
}
</style>