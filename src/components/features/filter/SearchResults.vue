<template>
    <div class="search-results">
        <div class="search-results__text">{{ message }}</div>
        <div class="filter-panel__body search-body custom-scroll">
            <div class="search-result" v-for="item in items" :key="item.id" @click="emit('select', item)"
                :class="{ active: activeId === item.id }">
                <div class="search-result__category">{{ item.category?.name }}</div>
                <div class="search-result__title">{{ item.title }}</div>
                <div class="search-result__address">{{ item.address }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    items: { type: Array, default: () => [] },
    message: { type: String, default: '' },
    activeId: { type: [String, Number], default: null }
})

const emit = defineEmits(['select'])
</script>