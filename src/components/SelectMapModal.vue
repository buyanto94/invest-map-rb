<template>
    <ul class="select-map">
        <li
            class="select-map-item"
            @click="setActiveLayer(item)"
            v-for="item in layers"
            :key="item"
            :class="[activeLayer.name == item.name ? 'active' : '']"
        >
            {{ item.name }}
        </li>
        <li class="select-map-item" :class="{ active: showDistricts }" @click="setShowDistricts(!showDistricts)">
            Районы
        </li>
    </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters(['showDistricts', 'layers', 'activeLayer']),
    },
    methods: {
        ...mapActions(['setActiveLayer', 'setShowDistricts']),
    },
}
</script>
