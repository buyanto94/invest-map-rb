<template>
    <div class="object-card-prev" @click="$emit('expand')">
        <div class="object-card-prev__btn">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
        </div>
        <div class="object-card-prev__category">{{ item.category?.name }}</div>
        <div class="object-card-prev__title">{{ item.title }}</div>
        <div class="object-card-prev__address">{{ item.address }}</div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
})

defineEmits(['expand'])
</script>