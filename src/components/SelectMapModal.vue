<template>
    <ul class="select-map">
        <li class="select-map-item" @click="mapStore.setActiveLayer(item)" v-for="item in mapStore.layers"
            :key="item.name" :class="{ active: mapStore.activeLayer.name === item.name }">
            {{ item.name }}
        </li>
        <li class="select-map-item" :class="{ active: districtsStore.showDistricts }"
            @click="districtsStore.setShowDistricts(!districtsStore.showDistricts)">
            Районы
        </li>
    </ul>
</template>

<script setup>
import { useMapStore } from '@/stores/map'
import { useDistrictsStore } from '@/stores/districts'

const mapStore = useMapStore()
const districtsStore = useDistrictsStore()
</script>

<style lang="scss" scoped>
.select-map {
    margin: 0;
    padding: 0;
    list-style: none;
}

.select-map-item {
    position: relative;
    min-width: 160px;
    padding: 12px 12px 12px 40px;
    font-size: 18px;
    color: #a0adc2;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }

    &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translate(0, -50%);
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background-position: center;
        background-size: cover;
    }

    &.active {
        color: #292e91;

        &::before {
            background-image: url(@/assets/img/icons/check.png);
        }
    }
}
</style>