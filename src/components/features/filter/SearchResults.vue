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

<style lang="scss" scoped>
.search-results__text {
    margin: 0 20px 20px;
}

.filter-panel__body {
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
</style>