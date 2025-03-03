<template>
    <div class="card-gallery" v-if="photos && photos.length">
        <div class="card-gallery__main">
            <a :href="photos[0]" data-fancybox="gallery">
                <img :src="photos[0]" alt="Main photo" />
            </a>
        </div>
        <div class="card-gallery__thumbs">
            <div class="row">
                <div class="col-3" v-for="(item, index) in photos" :key="index" v-show="index !== 0">
                    <a :href="item" data-fancybox="gallery">
                        <img :src="item" alt="Thumbnail" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js'

defineProps({
    photos: {
        type: Array,
        default: () => []
    }
})

onMounted(() => {
    Fancybox.bind('[data-fancybox]', {})
})
</script>

<style lang="scss" scoped>
.card-gallery {
    margin-bottom: 20px;

    img {
        width: 100%;
        object-fit: cover;
    }

    &__main {
        margin-bottom: 2px;

        img {
            height: 200px;
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

            >[class*='col-'] {
                padding: 1px;
            }
        }
    }
}
</style>