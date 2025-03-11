<template>
    <div class="object-details" v-if="mapStore.activeObject">
        <ObjectPreviewBar :item="mapStore.activeObject" @expand="fullscreenObject = true" />
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

        <ObjectFullInfo v-model:isOpen="fullInfoModal" :item="mapStore.activeObject" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/map'
import { useReferencesStore } from '@/stores/references'

import ObjectGallery from './details/ObjectGallery.vue'
import ObjectManager from './details/ObjectManager.vue'
import ObjectUtilities from './details/ObjectUtilities.vue'
import ObjectPreviewBar from './details/ObjectPreviewBar.vue'
import ObjectFullInfo from './details/ObjectFullInfo.vue'

const mapStore = useMapStore()
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

onMounted(async () => {
    if (referencesStore.landCategories.length === 0) {
        await referencesStore.fetchLandCategories()
    }
})
</script>