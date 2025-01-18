<template>
    <div class="filter-panel" v-show="showFilterPanel">
        <div class="filter-panel__header">
            <div class="row mb-4 mb-lg-5">
                <div class="col my-auto">
                    <a href="/">
                        <img src="./../assets/logo.png" alt="" class="filter-panel__logo d-none d-lg-block" />
                    </a>
                </div>
                <div class="col-auto">
                    <div class="filter-panel__close d-none d-lg-flex" @click="setShowFilterPanel(false)">
                        <img src="./../assets/sidebar/arrow-left.png" alt="" />
                    </div>
                    <button class="filter-panel__btn d-lg-none" @click="setShowFilterPanel(false)">
                        Применить фильтр
                    </button>
                </div>
            </div>
            <div class="mb-3 d-none d-lg-block">
                <input
                    type="search"
                    class="form-control custom-input"
                    v-model="inputSearch"
                    placeholder="Поиск объектов"
                />
            </div>
            <div class="mb-3" v-if="!inputSearch">
                <app-select
                    :options="formatingToOptions(districts, 'name', 'id')"
                    @select="selectedDistrict = $event"
                    :selected="selectedDistrict.name"
                    :nullOption="{ name: 'Все районы', value: null }"
                />
            </div>
        </div>

        <div class="search-results" v-if="inputSearch">
            <div class="search-results__text">
                {{ searchingMessage }}
            </div>
            <div class="filter-panel__body search-body custom-scroll">
                <div
                    class="search-result"
                    v-for="item in findObjects"
                    :key="item.id"
                    @click="setActiveObject(item)"
                    :class="[activeObject?.id == item.id ? 'active' : '']"
                >
                    <div class="search-result__category">{{ item['category']['name'] }}</div>
                    <div class="search-result__title">{{ item['title'] }}</div>
                    <div class="search-result__address">{{ item['address'] }}</div>
                </div>
            </div>
        </div>

        <div class="filter-panel__body custom-scroll" v-else>
            <div class="accordion filter-accordion" id="filter-accordion">
                <div class="mb-3" v-for="item in allCategoryGroup" :key="item.id">
                    <div @click="showCollapse('accordion-' + item.id)" class="accordion-btn">
                        <label class="checkbox-btn" v-on:click.stop>
                            <input type="checkbox" :value="item.id" v-model="checkedCategoriesGroups" />
                            <div class="checkbox-btn__cont" v-if="item.type == 'filter'">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                            </div>
                            <div class="checkbox-btn__cont" v-else>
                                <i class="fa fa-sun-o" aria-hidden="true"></i>
                            </div>
                        </label>
                        {{ item.name }}
                        <div class="accordion-btn__count">{{ countOfCategoryGroup(item.id) }}</div>
                    </div>
                    <div
                        class="collapse accordion-collapse show"
                        :id="'accordion-' + item.id"
                        data-bs-parent="#filter-accordion"
                    >
                        <div class="py-3" v-if="item.type == 'filter'">
                            <div class="mb-3">
                                <app-select
                                    :options="formatingToOptions(allLandCategories, 'title', 'id')"
                                    @select="selectedLandCategories = $event"
                                    :selected="selectedLandCategories.name"
                                    :nullOption="{ name: 'Категория земель', value: null }"
                                />
                            </div>
                            <div class="mb-3">
                                <label>Тип</label>
                                <div class="radio-bts">
                                    <div
                                        class="radio-bts__item"
                                        :class="{ active: selectedTypeArea == 'greenfield' }"
                                        @click="selectTypeArea('greenfield')"
                                    >
                                        <label>Greenfield</label>
                                    </div>
                                    <div
                                        class="radio-bts__item"
                                        :class="{ active: selectedTypeArea == 'brownfield' }"
                                        @click="selectTypeArea('brownfield')"
                                    >
                                        <label>Brownfield</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label>Общая площадь(га)</label>
                                <div class="filter-slider">
                                    <Slider
                                        v-model="area"
                                        tooltipPosition="bottom"
                                        :min="areaMarks[0]"
                                        :max="areaMarks[1]"
                                    />
                                </div>
                            </div>
                            <div class="mb-3">
                                <app-select
                                    :options="formatingToOptions(allTypeOfOwnership, 'title', 'id')"
                                    @select="selectedTypeOfOwnership = $event"
                                    :selected="selectedTypeOfOwnership.name"
                                    :nullOption="{ name: 'Форма собственности', value: null }"
                                />
                            </div>
                            <div class="mb-3">
                                <label>До Улан-Удэ (км)</label>
                                <div class="filter-slider">
                                    <Slider
                                        tooltipPosition="bottom"
                                        v-model="distances"
                                        :min="distancesMarks[0]"
                                        :max="distancesMarks[1]"
                                    />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="category-checkbox" v-for="ch in item.child" :key="ch.id">
                                    <input type="checkbox" :value="ch.id" v-model="checkedChildCategories" />
                                    <div class="category-checkbox__btn">
                                        <img :src="'https://invest-buryatia.ru' + ch['img']" alt="" v-if="ch['img']" />
                                        <img
                                            v-else
                                            :src="ch['type'] ? iconsMarker[ch['type']] : iconsMarker['default']"
                                        />
                                    </div>
                                    <div class="category-checkbox__text">
                                        {{ ch.name }}
                                    </div>
                                    <div class="category-checkbox__count">
                                        {{ countOfCategory(ch.id) }}
                                    </div>
                                </label>
                            </div>
                            <button class="btn btn-light" @click="resetFilterChildCategories">
                                Сбросить фильтр категорий
                            </button>
                        </div>
                        <div class="py-3 px-2" v-else>
                            <div v-for="obj in freeCategory(item.child[0].id)" v-bind:key="obj.id">
                                <div class="free-category-item" @click="setActiveObject(obj)">
                                    {{ obj.title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="search-panel" v-show="showSearchPanel">
        <div class="search-panel__close" @click="setActiveObject(null), (inputSearch = ''), setShowSearchPanel(false)">
            <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div class="search-panel__header">
            <input
                type="search"
                class="form-control custom-input search-panel__input"
                v-model="inputSearch"
                placeholder="Поиск объектов"
            />

            <div class="search-panel__nav" v-if="inputSearch">
                <div class="search-panel__text">
                    {{ searchingMessage }}
                </div>
                <a class="search-panel__nav-btn" data-bs-toggle="collapse" href="#search-panel-body">
                    <span v-if="searchPanelBody"><i class="fa fa-globe" aria-hidden="true"></i></span>
                    <span v-else><i class="fa fa-list" aria-hidden="true"></i></span>
                </a>
            </div>
        </div>
        <div class="collapse" id="search-panel-body">
            <div class="search-panel__body custom-scroll">
                <div
                    class="search-result"
                    v-for="item in findObjects"
                    :key="item.id"
                    @click="setActiveObject(item), hideCollapse('search-panel-body')"
                    :class="[activeObject?.id == item.id ? 'active' : '']"
                >
                    <div class="search-result__category">{{ item['category']['name'] }}</div>
                    <div class="search-result__title">{{ item['title'] }}</div>
                    <div class="search-result__address">{{ item['address'] }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppSelect from '@/components/ui/AppSelect.vue'
import Slider from '@vueform/slider'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { mapGetters, mapActions } from 'vuex'

export default {
    emits: ['update:modelValue'],
    props: {
        findObjects: Array,
        findObjectsByParams: Array,
        modelValue: Object,
        searchingMessage: String,
    },

    data() {
        return {
            inputSearch: '',
            searchPanelBody: false,

            // start params
            distancesMarks: [0, 1],
            areaMarks: [0, 1],

            // for filter
            checkedChildCategories: [],
            checkedCategoriesGroups: [],
            area: [0, 0],
            distances: [0, 0],
            selectedDistrict: { name: 'Все районы', value: null },
            selectedLandCategories: { name: 'Категория земель', value: null },
            selectedTypeArea: null,
            selectedTypeOfOwnership: { name: 'Форма собственности', value: null },
        }
    },

    computed: {
        ...mapGetters([
            'showFilterPanel',
            'allCategoryGroup',
            'allTypeOfOwnership',
            'allLandCategories',
            'districts',
            'showSearchPanel',
            'allObjects',
            'activeObject',
            'iconsMarker',
        ]),
    },

    methods: {
        ...mapActions([
            'setActiveObject',
            'setShowFilterPanel',
            'setShowSearchPanel',
            'fetchCategoryGroup',
            'fetchTypeOfOwnership',
        ]),

        freeCategory(category_id) {
            return this.allObjects.filter((item) => {
                return category_id == item.category.id
            })
        },

        initListenCollapseSearch() {
            const myCollapsible = document.getElementById('search-panel-body')
            myCollapsible.addEventListener('shown.bs.collapse', () => {
                this.searchPanelBody = true
            })

            myCollapsible.addEventListener('hidden.bs.collapse', () => {
                this.searchPanelBody = false
            })
        },

        initStartParams() {
            let areaMax = 0
            let distanceMax = 0

            this.allObjects.forEach((item) => {
                if (+item.distanceToUU >= distanceMax) {
                    distanceMax = +item.distanceToUU
                }
                if (+item.area >= areaMax) {
                    areaMax = +item.area
                }

                // Все дочерние категории записываются в выбранные категории
                if (this.checkedChildCategories.indexOf(item.category.id) == -1) {
                    this.checkedChildCategories.splice(this.checkedChildCategories.length, 1, item.category.id)
                }

                // Все родительние категории записываются в выбранные категории
                if (this.checkedCategoriesGroups.indexOf(item.category.parentId) == -1) {
                    this.checkedCategoriesGroups.splice(this.checkedCategoriesGroups.length, 1, item.category.parentId)
                }
            })

            this.distancesMarks.splice(1, 1, distanceMax)
            this.areaMarks.splice(1, 1, areaMax)

            setTimeout(() => {
                this.distances.splice(1, 1, distanceMax)
                this.area.splice(1, 1, areaMax)
            }, 0)
        },

        formatingToOptions(options, name, value) {
            let newArr = options.map((item) => {
                return { name: item[name], value: item[value] }
            })

            return newArr
        },

        showCollapse(id) {
            var myCollapse = document.getElementById(id)
            const bsCollapse = new bootstrap.Collapse(myCollapse)
            bsCollapse.show()
        },

        hideCollapse(id) {
            var myCollapse = document.getElementById(id)
            const bsCollapse = new bootstrap.Collapse(myCollapse)
            bsCollapse.hide()
        },

        countOfCategory(id) {
            let arrCategory = this.findObjectsByParams.filter((item) => {
                return item.category.id == id
            })

            return arrCategory.length
        },

        countOfCategoryGroup(id) {
            let arrCategory = this.findObjectsByParams.filter((item) => {
                return +item.category.parentId == +id
            })

            return arrCategory.length
        },

        resetFilterChildCategories() {
            this.checkedChildCategories = [undefined]
        },

        selectTypeArea(typeArea) {
            if (this.selectedTypeArea == typeArea) {
                this.selectedTypeArea = null
            } else {
                this.selectedTypeArea = typeArea
            }
        },
    },

    async mounted() {
        this.initListenCollapseSearch()

        await this.fetchCategoryGroup()
        await this.fetchTypeOfOwnership()

        this.initStartParams()

        // формируется filter
        this.$watch(
            (vm) => [
                vm.inputSearch,
                vm.checkedChildCategories,
                vm.checkedCategoriesGroups,
                vm.area,
                vm.distances,
                vm.selectedDistrict,
                vm.selectedLandCategories,
                vm.selectedTypeArea,
                vm.selectedTypeOfOwnership,
            ],
            () => {
                const filter = {
                    inputSearch: this.inputSearch,
                    childCategories: this.checkedChildCategories,
                    categoriesGroups: this.checkedCategoriesGroups,
                    area: this.area,
                    distanceToUU: this.distances,
                    district: this.selectedDistrict.value,
                    landCategory: this.selectedLandCategories.value,
                    typeArea: this.selectedTypeArea,
                    typeOfOwnership: this.selectedTypeOfOwnership.value,
                }

                this.$emit('update:modelValue', filter)
            },
            {
                immediate: true,
                deep: true,
            }
        )
    },

    watch: {},

    components: {
        AppSelect,
        Slider,
    },
}
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
    }

    &__close img {
        width: 24px;
    }

    &__body {
        margin: 0;
        padding: 0px 20px;
        width: 100%;
        height: calc(100vh - 275px);
        overflow: auto;
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
            right: 0px;
            top: 20px;
            color: inherit;
            text-decoration: none;

            &:hover {
                color: inherit;
                text-decoration: none;
            }
        }
    }
}

.filter-accordion {
    width: 100%;
    overflow-y: visible;
}

.filter-slider {
    padding: 0px 15px;
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
    padding-top: 10px;
    padding-left: 55px;
    padding-right: 35px;
    font-size: 15px;
    line-height: 36px;

    &__count {
        display: block;
        position: absolute;
        font-weight: bold;
        top: 50%;
        text-align: right;
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

    input[type='checkbox'] {
        z-index: -1;
        opacity: 0;
        display: block;
        width: 0;
        height: 0;
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

    input[type='checkbox']:checked + &__cont {
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
    justify-content: flex-start;

    input[type='checkbox'] {
        z-index: -1;
        opacity: 0;
        display: block;
        width: 0;
        height: 0;
    }

    &__btn {
        background-color: #ddd;
        display: block;
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
        display: inline-block;
        vertical-align: middle;
        flex-grow: 1;
    }

    &__count {
        display: block;
        position: absolute;
        font-weight: bold;
        text-align: right;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
    }

    /* Checked */
    input[type='checkbox']:checked + &__btn {
        filter: grayscale(0);
        opacity: 1;
    }
}

.search-results {
    &__text {
        margin: 0px 20px 20px;
    }
}

.search-result {
    border-bottom: 2px solid #292e91;
    cursor: pointer;
    padding: 20px;

    &.active {
        background-color: #292e91;
    }
    &:last-child {
        border-bottom: 0;
    }
    &__category {
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 1rem;
        color: #292e91;
        text-transform: uppercase;

        .active & {
            color: #fff;
        }
    }
    &__title {
        color: #292e91;
        font-size: 16px;
        margin-bottom: 6px;
        opacity: 0.8;
        .active & {
            color: #fff;
            font-size: 16px;
            margin-bottom: 6px;
        }
    }

    &__text {
        font-size: 14px;
        color: #292e91;
        margin-bottom: 20px;
        padding: 0 20px;
    }

    &__address {
        opacity: 0.5;
        font-size: 13px;
        color: #292e91;

        .active & {
            color: #000;
        }
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
        input[type='radio'] {
            display: none;
        }
        label {
            background-color: #f5f5fa;
            font-weight: 600;
            color: #292e91;
            display: block;
            cursor: pointer;
            padding: 15px 10px;
            border-right: none;
            user-select: none;
            font-size: 16px;
            line-height: 18px;
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
