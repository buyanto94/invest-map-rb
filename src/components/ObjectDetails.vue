<template>
    <div class="object-details" v-if="activeObject">
        <div class="object-card-prev">
            <div class="object-card-prev__btn" @click="fullscreenObject = true">
                <i class="fa fa-arrows-alt" aria-hidden="true"></i>
            </div>
            <div class="object-card-prev__category">{{ activeObject['category']['name'] }}</div>
            <div class="object-card-prev__title">{{ activeObject['title'] }}</div>
            <div class="object-card-prev__address">{{ activeObject['address'] }}</div>
        </div>

        <div class="object-card custom-scroll" :class="{ fullscreen: fullscreenObject }" v-if="activeObject">
            <div class="object-card__category">
                {{ activeObject['category']['name'] }}
            </div>
            <a href="#" class="object-card__close" @click.prevent="close()">
                <img src="./../assets/img/card/close-line.png" alt="" />
            </a>

            <div class="object-card__gallery">
                <div class="card-gallery" v-if="activeObject['photos']">
                    <div class="card-gallery__main">
                        <a :href="activeObject['photos'][0]" data-fancybox="gallery">
                            <img :src="activeObject['photos'][0]" alt="" />
                        </a>
                    </div>
                    <div class="card-gallery__thumbs">
                        <div class="row">
                            <div
                                class="col-3"
                                v-for="(item, index) in activeObject['photos']"
                                :key="index"
                                v-show="index != 0"
                            >
                                <a :href="item" data-fancybox="gallery" v-if="index != 0">
                                    <img :src="item" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="object-card__name">
                {{ activeObject['title'] }}
            </div>
            <div class="object-card__typearea card-data-block">
                <span class="card-badge">
                    {{ activeObject['typeArea'] }}
                </span>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Общая площадь(га)</div>
                        <div class="card-data-block__text">
                            {{ activeObject['area'] }}
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Свободная площадь(га)</div>
                        <div class="card-data-block__text">
                            {{ activeObject['free_area'] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Адрес:</div>
                        <div class="card-data-block__text">
                            {{ activeObject['address'] }}
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card-data-block">
                        <div class="card-data-block__title">Кадастровый номер</div>
                        <div class="card-data-block__text">
                            {{ activeObject['cadastralNumber'] }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-data-block object-card__icons">
                <div class="prop-icon" title="Электричество" :class="{ has: activeObject['powerSupply'] }">
                    <img src="./../assets/img/card/light.png" alt="" />
                </div>
                <div class="prop-icon" title="Газ" :class="{ has: activeObject['gasSupply'] }">
                    <img src="./../assets/img/card/gas.png" alt="" />
                </div>
                <div class="prop-icon" title="Водоснабжение" :class="{ has: activeObject['waterSupply'] }">
                    <img src="./../assets/img/card/water.png" alt="" />
                </div>
                <!-- вместо транспорт инет -->
                <div
                    class="prop-icon"
                    title="Интернет"
                    :class="{ has: activeObject['transportInfrastructureAvailability'] }"
                >
                    <img src="./../assets/img/card/enet.png" alt="" />
                </div>

                <div class="prop-icon" title="Водоотведение" :class="{ has: activeObject['waterDisposal'] }">
                    <img src="./../assets/img/card/water-out.png" alt="" />
                </div>
                <div class="prop-icon" title="Теплоснабжение" :class="{ has: activeObject['heatSupply'] }">
                    <img src="./../assets/img/card/heating.png" alt="" />
                </div>
            </div>

            <div class="card-data-block">
                <div class="card-data-block__title">Категория земель</div>
                <div class="card-data-block__text">
                    {{ getLangCategory(activeObject['landCategory']) }}
                </div>
            </div>
            <div class="card-data-block">
                <div class="card-data-block__title">Форма собственности</div>
                <div class="card-data-block__text">
                    {{ activeObject['typeOfOwnership']['title'] }}
                </div>
            </div>
            <div class="card-data-block" v-if="activeObject['manager']">
                <div class="card-data-block__title">Контактное лицо</div>
                <div class="card-manager">
                    <div class="row">
                        <div class="col-auto my-auto">
                            <div class="card-manager__image">
                                <img :src="activeObject['manager']['photo']" class="img-fluid" />
                            </div>
                        </div>
                        <div class="col my-auto">
                            <div class="card-data-block__title">
                                {{ activeObject['manager']['dolg'] }}
                            </div>
                            <div class="card-data-block__text mb-2">
                                {{ activeObject['manager']['name'] }}
                            </div>
                            <div v-if="activeObject.manager.phone">
                                <a
                                    :href="`tel:${activeObject.manager.phone.replace(/\s/g, '')}`"
                                    class="card-data-block__text"
                                >
                                    <i class="fa fa-phone" aria-hidden="true"></i>
                                    {{ activeObject['manager']['phone'] }}
                                </a>
                            </div>
                            <a :href="`mailto:${activeObject['manager']['email']}`" class="card-data-block__text">
                                <i class="fa fa-envelope" aria-hidden="true"></i>{{ activeObject['manager']['email'] }}
                            </a>
                        </div>
                    </div>
                </div>
                <!-- <div class="card-data-block__text">
                            {{ activeObject['contact'] }}
                        </div>
                        <div class="card-data-block__phone">
                            {{ activeObject['phone'] }}
                        </div> -->
            </div>

            <div class="card-data-block" v-if="activeObject['privileges']">
                <div class="card-data-block__title">Льготы и преференции</div>
                <div class="card-data-block__text">
                    {{ activeObject['privileges'] }}
                </div>
            </div>

            <div class="card-data-block">
                <div class="card-data-block__title">Дополнительная информация</div>
                <div class="card-data-block__text" v-html="activeObject['dopInfo']"></div>
            </div>

            <div @click="fullInfoModal = true" class="object-card__btn">
                <span> Показать полную информацию </span>
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
                <div id="print-content" v-if="activeObject">
                    <table border="1" style="text-align: left; border-collapse: collapse" class="table table-bordered">
                        <tbody>
                            <tr v-if="activeObject['category']['name']">
                                <th>Категория</th>
                                <td>{{ activeObject['category']['name'] }}</td>
                            </tr>
                            <tr v-if="activeObject['typeObject']">
                                <th>Тип объекта</th>
                                <td>{{ activeObject['typeObject'] }}</td>
                            </tr>
                            <tr v-if="activeObject['title']">
                                <th>Название</th>
                                <td>{{ activeObject['title'] }}</td>
                            </tr>
                            <tr v-if="activeObject['landCategory']">
                                <th>Категория земель</th>
                                <td>{{ getLangCategory(activeObject['landCategory']) }}</td>
                            </tr>
                            <tr v-if="activeObject['landTenure']">
                                <th>Вид права владения землей</th>
                                <td>{{ activeObject['landTenure'] }}</td>
                            </tr>
                            <tr v-if="activeObject['municipalArea']">
                                <th>Муниципальное образование</th>
                                <td>{{ getMunicipalArea(activeObject['municipalArea']) }}</td>
                            </tr>
                            <tr v-if="activeObject['owner']">
                                <th>Собственник</th>
                                <td>{{ activeObject['owner'] }}</td>
                            </tr>
                            <tr v-if="activeObject['typeOfOwnership']['title']">
                                <th>Форма собственности</th>
                                <td>{{ activeObject['typeOfOwnership']['title'] }}</td>
                            </tr>
                            <tr v-if="activeObject['specialPurpose']">
                                <th>
                                    Целевое (приоритетное) назначение земельного участка, имеющиеся ограничения
                                    использования
                                </th>
                                <td>{{ activeObject['specialPurpose'] }}</td>
                            </tr>
                            <tr v-if="activeObject['area']">
                                <th>Общая площадь(га)</th>
                                <td>{{ activeObject['area'] }}</td>
                            </tr>
                            <tr v-if="activeObject['free_area']">
                                <th>Свободная площадь(га)</th>
                                <td>{{ activeObject['free_area'] }}</td>
                            </tr>
                            <tr v-if="activeObject['cadastralNumber']">
                                <th>Кадастровый номер земельного участка</th>
                                <td>{{ activeObject['cadastralNumber'] }}</td>
                            </tr>
                            <tr v-if="activeObject['expandability']">
                                <th>Возможность расширения</th>
                                <td v-if="activeObject['expandability']">Да</td>
                                <td v-else>Нет</td>
                            </tr>
                            <tr>
                                <th>Газоснабжение</th>
                                <td v-if="activeObject['gasSupply']">
                                    {{ activeObject['gasSupply'] }}
                                </td>
                                <td v-else>-</td>
                            </tr>
                            <tr>
                                <th>Теплоснабжение</th>
                                <td v-if="activeObject['heatSupply']">
                                    {{ activeObject['heatSupply'] }}
                                </td>
                                <td v-else>-</td>
                            </tr>
                            <tr>
                                <th>Электроснабжение</th>
                                <td v-if="activeObject['powerSupply']">
                                    {{ activeObject['powerSupply'] }}
                                </td>
                                <td v-else>-</td>
                            </tr>
                            <tr>
                                <th>Водоснабжение</th>
                                <td v-if="activeObject['waterSupply']">
                                    {{ activeObject['waterSupply'] }}
                                </td>
                                <td v-else>-</td>
                            </tr>
                            <tr>
                                <th>Водоотведение</th>
                                <td v-if="activeObject['waterDisposal']">
                                    {{ activeObject['waterDisposal'] }}
                                </td>
                                <td v-else>-</td>
                            </tr>
                            <tr v-if="activeObject['transportInfrastructureAvailability']">
                                <th>Наличие транспортной инфраструктуры</th>
                                <td>{{ activeObject['transportInfrastructureAvailability'] }}</td>
                            </tr>

                            <tr v-if="activeObject['privileges']">
                                <th>Льготы и преференции</th>
                                <td>{{ activeObject['privileges'] }}</td>
                            </tr>

                            <tr v-if="activeObject['provisionTerms']">
                                <th>Условия предоставления инвестору</th>
                                <td>{{ activeObject['provisionTerms'] }}</td>
                            </tr>
                            <tr v-if="activeObject['dopInfo']">
                                <th>Дополнительная информация</th>
                                <td v-html="activeObject['dopInfo']"></td>
                            </tr>
                            <tr v-if="activeObject['contact']">
                                <th>Контактное лицо</th>
                                <td>{{ activeObject['contact'] }}</td>
                            </tr>
                            <tr v-if="activeObject['phone']">
                                <th>Телефон</th>
                                <td>{{ activeObject['phone'] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </app-modal>
    </teleport>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppModal from './ui/AppModal'
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js'

export default {
    emits: [],
    props: {},

    components: { AppModal },

    data() {
        return {
            fullInfoModal: false,
            fullscreenObject: false,
        }
    },

    async mounted() {
        await this.fetchLandCategories()

        Fancybox.bind('[data-fancybox]', {})
    },

    computed: {
        ...mapGetters(['districts', 'allLandCategories', 'activeObject']),
    },

    methods: {
        ...mapActions(['fetchLandCategories', 'setActiveObject']),

        close() {
            this.setActiveObject(null)
            this.fullscreenObject = false
        },

        getLangCategory(id) {
            let lcat = this.allLandCategories.find((item) => {
                return item.id == id
            })

            if (lcat) {
                return lcat.title
            } else {
                return '-'
            }
        },

        getMunicipalArea(id) {
            let ma = this.districts.find((item) => {
                return item.id == +id
            })

            if (ma) {
                return ma.name
            } else {
                return '-'
            }
        },

        callPrint() {
            let prtContent = document.getElementById('print-content')
            let WinPrint = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0')
            WinPrint.document.write(prtContent.innerHTML)
            WinPrint.document.close()
            WinPrint.focus()
            WinPrint.print()
            WinPrint.close()
        },
    },
}
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
    @media (max-width: 991.98px) {
        position: fixed;
        width: 100vw;
        left: -100%;

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

        &:hover {
            color: #fff;
            text-decoration: none;
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

        @media (max-width: 991.98px) {
            display: none;
            position: fixed;

            .fullscreen & {
                display: block;
            }
        }

        &:hover {
            opacity: 1;
        }

        img {
            width: 24px;
            height: 24px;
        }
    }

    &__gallery {
        margin-bottom: 20px;
    }

    &__name {
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        margin-bottom: 17px;
    }

    &__icons {
        padding: 15px 0;
        border-top: 1px solid #ffffff1a;
        border-bottom: 1px solid #ffffff1a;
    }
}

.card-badge {
    background: rgba(255, 255, 255, 0.1);
    display: inline-block;
    border-radius: 2px;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    padding: 2px 8px;
}

.card-gallery {
    img {
        width: 100%;
        object-fit: cover;
    }

    &__main {
        margin-bottom: 2px;
        img {
            height: 260px;
        }
    }

    &__thumbs {
        img {
            height: 60px;
            margin-bottom: 2px;
        }
        .row {
            margin-right: -1px;
            margin-left: -1px;
            > .col,
            > [class*='col-'] {
                padding-right: 1px;
                padding-left: 1px;
            }
        }
    }
}

.card-data-block {
    margin-bottom: 25px;
    font-size: 16px;

    &__title {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 8px;
        opacity: 0.8;
    }

    &__text {
        font-size: 16px;
        line-height: 18px;
        color: #ffffff;
        display: block;
        margin-bottom: 8px;
    }
}

.prop-icon {
    width: 48px;
    height: 48px;
    padding: 10px;
    border-radius: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    position: relative;
    display: inline-block;
    margin-right: 10px;

    &:last-child {
        margin-right: 0;
    }

    &::before {
        content: '';
        position: absolute;
        background-repeat: no-repeat;
        border-radius: 20px;
        right: -3px;
        top: 0px;
        width: 18px;
        height: 18px;
        background-size: cover;
        background-position: center;
        background-image: url(@/assets/img/card/none.png);
    }

    &.has {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        &::before {
            background-image: url(@/assets/img/card/has.png);
        }
    }

    img {
        width: 100%;
        height: auto;
    }
}

.card-manager {
    &__image {
        width: 100px;
    }

    .row {
        margin-right: -5px;
        margin-left: -5px;
        > .col,
        > [class*='col-'] {
            padding-right: 5px;
            padding-left: 5px;
        }
    }

    i {
        margin-right: 10px;
    }

    a {
        color: inherit;
        text-decoration: none;
        &:hover {
            color: inherit;
            text-decoration: none;
        }
    }
}
</style>
