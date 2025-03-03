<template>
    <div class="card-manager" v-if="manager">
        <div class="row">
            <div class="col-auto my-auto">
                <div class="card-manager__image">
                    <img :src="manager.photo" class="img-fluid" alt="Manager" />
                </div>
            </div>
            <div class="col my-auto">
                <div class="card-manager__title">{{ manager.dolg }}</div>
                <div class="card-manager__text mb-2">{{ manager.name }}</div>
                <div v-if="manager.phone">
                    <a :href="`tel:${manager.phone.replace(/\s/g, '')}`" class="card-manager__text">
                        <i class="fa fa-phone" aria-hidden="true"></i>
                        {{ manager.phone }}
                    </a>
                </div>
                <a :href="`mailto:${manager.email}`" class="card-manager__text">
                    <i class="fa fa-envelope" aria-hidden="true"></i> {{ manager.email }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    manager: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.card-manager {
    &__image {
        width: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
    }

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
        text-decoration: none;
    }

    a {
        color: inherit;

        &:hover {
            text-decoration: underline;
        }
    }

    i {
        margin-right: 5px;
    }
}
</style>