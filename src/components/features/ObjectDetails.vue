<template>
    <div class="object-details" v-if="mapStore.activeObject">
        <div class="object-card-prev">
            <div class="object-card-prev__btn" @click="fullscreenObject = true">
                <i class="fa fa-arrows-alt" aria-hidden="true"></i>
            </div>
            <div class="object-card-prev__category">{{ mapStore.activeObject.category?.name }}</div>
            <div class="object-card-prev__title">{{ mapStore.activeObject.title }}</div>
            <div class="object-card-prev__address">{{ mapStore.activeObject.address }}</div>
        </div>

        <div class="object-card custom-scroll" :class="{ fullscreen: fullscreenObject }">
            <div class="object-card__category">
                {{ mapStore.activeObject.category?.name }}
            </div>
            <a href="#" class="object-card__close" @click.prevent="close()">
                <img src="@/assets/img/card/close-line.png" alt="Close" />
            </a>

            <ObjectGallery :photos="mapStore.activeObject.photos" />

            <div class="object-card__name">{{ mapStore.activeObject.title }}</div>

            <div class="object-card__typearea card-data-block">
                <span class="card-badge">{{ mapStore.activeObject.typeArea }}</span>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Общая площадь(га)</div>
                        <div class="card-data-block__text">{{ mapStore.activeObject.area }}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Свободная площадь(га)</div>
                        <div class="card-data-block__text">{{ mapStore.activeObject.free_area || '-' }}</div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Адрес:</div>
                        <div class="card-data-block__text">{{ mapStore.activeObject.address }}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Кадастровый номер</div>
                        <div class="card-data-block__text">{{ mapStore.activeObject.cadastralNumber }}</div>
                    </div>
                </div>
            </div>

            <ObjectUtilities :item="mapStore.activeObject" />

            <div class="card-data-block">
                <div class="card-data-block__title">Категория земель</div>
                <div class="card-data-block__text">{{ getLangCategory(mapStore.activeObject.landCategory) }}</div>
            </div>
            <div class="card-data-block">
                <div class="card-data-block__title">Форма собственности</div>
                <div class="card-data-block__text">{{ mapStore.activeObject.typeOfOwnership?.title }}</div>
            </div>

            <div class="card-data-block" v-if="mapStore.activeObject.manager">
                <div class="card-data-block__title">Контактное лицо</div>
                <ObjectManager :manager="mapStore.activeObject.manager" />
            </div>

            <div class="card-data-block" v-if="mapStore.activeObject.privileges">
                <div class="card-data-block__title">Льготы и преференции</div>
                <div class="card-data-block__text">{{ mapStore.activeObject.privileges }}</div>
            </div>

            <div class="card-data-block" v-if="mapStore.activeObject.dopInfo">
                <div class="card-data-block__title">Дополнительная информация</div>
                <div class="card-data-block__text" v-html="mapStore.activeObject.dopInfo"></div>
            </div>

            <div @click="fullInfoModal = true" class="object-card__btn">
                <span>Показать полную информацию</span>
            </div>
        </div>
    </div>

    <teleport to="body">
        <app-modal v-model:open="fullInfoModal" scrollable size="lg">
            <template #header>
                <h5 class="custom-modal__title">Полная информация об объекте</h5>
                <div class="custom-modal__header-btn" @click="callPrint()">
                    <i class="fa fa-print" aria-hidden="true"></i>
                </div>
            </template>
            <template #default>
                <div id="print-content" v-if="mapStore.activeObject">
                    <table border="1" style="text-align: left; border-collapse: collapse" class="table table-bordered">
                        <tbody>
                            <tr v-if="mapStore.activeObject.category?.name">
                                <th>Категория</th>
                                <td>{{ mapStore.activeObject.category.name }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.typeObject">
                                <th>Тип объекта</th>
                                <td>{{ mapStore.activeObject.typeObject }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.title">
                                <th>Название</th>
                                <td>{{ mapStore.activeObject.title }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.landCategory">
                                <th>Категория земель</th>
                                <td>{{ getLangCategory(mapStore.activeObject.landCategory) }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.landTenure">
                                <th>Вид права владения землей</th>
                                <td>{{ mapStore.activeObject.landTenure }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.municipalArea">
                                <th>Муниципальное образование</th>
                                <td>{{ getMunicipalArea(mapStore.activeObject.municipalArea) }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.owner">
                                <th>Собственник</th>
                                <td>{{ mapStore.activeObject.owner }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.typeOfOwnership?.title">
                                <th>Форма собственности</th>
                                <td>{{ mapStore.activeObject.typeOfOwnership.title }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.specialPurpose">
                                <th>Целевое (приоритетное) назначение земельного участка, имеющиеся ограничения
                                    использования</th>
                                <td>{{ mapStore.activeObject.specialPurpose }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.area">
                                <th>Общая площадь(га)</th>
                                <td>{{ mapStore.activeObject.area }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.free_area">
                                <th>Свободная площадь(га)</th>
                                <td>{{ mapStore.activeObject.free_area }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.cadastralNumber">
                                <th>Кадастровый номер земельного участка</th>
                                <td>{{ mapStore.activeObject.cadastralNumber }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.expandability !== undefined">
                                <th>Возможность расширения</th>
                                <td>{{ mapStore.activeObject.expandability ? 'Да' : 'Нет' }}</td>
                            </tr>
                            <tr>
                                <th>Газоснабжение</th>
                                <td>{{ mapStore.activeObject.gasSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Теплоснабжение</th>
                                <td>{{ mapStore.activeObject.heatSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Электроснабжение</th>
                                <td>{{ mapStore.activeObject.powerSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Водоснабжение</th>
                                <td>{{ mapStore.activeObject.waterSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Водоотведение</th>
                                <td>{{ mapStore.activeObject.waterDisposal || '-' }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.transportInfrastructureAvailability">
                                <th>Наличие транспортной инфраструктуры</th>
                                <td>{{ mapStore.activeObject.transportInfrastructureAvailability }}</td>
                            </tr>

                            <tr v-if="mapStore.activeObject.privileges">
                                <th>Льготы и преференции</th>
                                <td>{{ mapStore.activeObject.privileges }}</td>
                            </tr>

                            <tr v-if="mapStore.activeObject.provisionTerms">
                                <th>Условия предоставления инвестору</th>
                                <td>{{ mapStore.activeObject.provisionTerms }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.dopInfo">
                                <th>Дополнительная информация</th>
                                <td v-html="mapStore.activeObject.dopInfo"></td>
                            </tr>
                            <tr v-if="mapStore.activeObject.contact">
                                <th>Контактное лицо</th>
                                <td>{{ mapStore.activeObject.contact }}</td>
                            </tr>
                            <tr v-if="mapStore.activeObject.phone">
                                <th>Телефон</th>
                                <td>{{ mapStore.activeObject.phone }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </app-modal>
    </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/map'
import { useDistrictsStore } from '@/stores/districts'
import { useReferencesStore } from '@/stores/references'
import AppModal from '@/components/ui/AppModal.vue'

import ObjectGallery from './details/ObjectGallery.vue'
import ObjectManager from './details/ObjectManager.vue'
import ObjectUtilities from './details/ObjectUtilities.vue'

const mapStore = useMapStore()
const districtsStore = useDistrictsStore()
const referencesStore = useReferencesStore()

const fullInfoModal = ref(false)
const fullscreenObject = ref(false)

const close = () => {
    mapStore.setActiveObject(null)
    fullscreenObject.value = false
}

const getLangCategory = (id) => {
    const category = referencesStore.landCategories.find((item) => item.id == id)
    return category ? category.title : '-'
}

const getMunicipalArea = (id) => {
    const area = districtsStore.items.find((item) => item.id == +id)
    return area ? area.name : '-'
}

const callPrint = () => {
    const prtContent = document.getElementById('print-content')
    if (!prtContent) return

    const WinPrint = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0')

    WinPrint.document.write(`
        <html>
            <head>
                <title>Печать объекта</title>
                <style>
                    body { font-family: sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                </style>
            </head>
            <body>
                ${prtContent.innerHTML}
            </body>
        </html>
    `)

    WinPrint.document.close()
    WinPrint.focus()
    setTimeout(() => {
        WinPrint.print()
        WinPrint.close()
    }, 500)
}

onMounted(async () => {
    if (referencesStore.landCategories.length === 0) {
        await referencesStore.fetchLandCategories()
    }
})
</script>

<style lang="scss" scoped>
.object-card-prev {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background-color: #292e91;
    padding: 20px;

    @media (min-width: 992px) {
        display: none;
    }

    &__btn {
        position: absolute;
        top: 15px;
        right: 15px;
        color: #fff;
    }

    &__category {
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 1rem;
        color: #fff;
        text-transform: uppercase;
    }

    &__title {
        color: #fff;
        font-size: 16px;
        margin-bottom: 6px;
        opacity: 0.8;
    }

    &__address {
        opacity: 0.5;
        font-size: 13px;
        color: #fff;
    }
}

.object-card {
    width: 400px;
    height: 100vh;
    color: #fff;
    background-color: #292e91;
    overflow: auto;
    padding: 30px 20px 20px;
    overflow-y: auto;
    z-index: 9;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
    }

    @media (max-width: 991.98px) {
        position: fixed;
        width: 100vw;
        left: -100%;
        top: 0;
        transition: left 0.3s ease-in-out;

        &.fullscreen {
            left: 0;
        }
    }

    &__btn {
        background: linear-gradient(95.48deg, #f7ce38 -7.1%, #fc210d 97.71%);
        border-radius: 1px;
        cursor: pointer;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        padding: 20px 30px;
        position: relative;
        margin-top: 20px;

        span {
            position: relative;
            z-index: 10;
        }

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            background: linear-gradient(95.48deg, #f7ce38 -7.1%, #f7ce38 97.71%);
            opacity: 0;
            transition: opacity 0.8s;
        }

        &:hover::before {
            opacity: 1;
        }
    }

    &__category {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        padding-right: 45px;
        text-transform: uppercase;
    }

    &__close {
        padding: 5px;
        position: absolute;
        right: 28px;
        top: 25px;
        text-align: center;
        background-color: #3036a7;
        cursor: pointer;
        z-index: 8;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (max-width: 991.98px) {
            display: none; 

            .fullscreen & {
                display: flex;
            }
        }

        img {
            width: 14px;
            height: 14px;
        }
    }

    &__name {
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        margin-bottom: 17px;
    }
}

.card-badge {
    background: rgba(255, 255, 255, 0.1);
    display: inline-block;
    border-radius: 2px;
    font-weight: 600;
    font-size: 14px;
    padding: 2px 8px;
}

.card-data-block {
    margin-bottom: 20px;
    font-size: 16px;

    &__title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 5px;
        opacity: 0.7;
    }

    &__text {
        font-size: 15px;
        color: #ffffff;
        display: block;
        margin-bottom: 5px;
    }
}
</style>