<template>
    <div class="top-panel">
        <div class="top-panel-item" title="Инвестиционный портал">
            <a href="https://invest-buryatia.ru/" class="top-panel__btn show-site" target="_blank"></a>
        </div>
        <div class="top-panel-item" title="К Республике Бурятия">
            <button class="top-panel__btn show-bur" @click="$emit('mapToBuryatia')"></button>
        </div>
        <div class="top-panel-item" title="Поделиться">
            <button class="top-panel__btn show-share" @click="$emit('shareModal')"></button>
        </div>
        <div class="top-panel-item" title="Выбрать карту">
            <button
                class="top-panel__btn show-layers"
                data-bs-toggle="collapse"
                data-bs-target="#top-panel-collapse"
            ></button>

            <div class="top-panel-item__content">
                <div class="collapse" id="top-panel-collapse">
                    <ul class="panel-list">
                        <li
                            class="panel-list-item"
                            @click="setActiveLayer(item)"
                            v-for="item in layers"
                            :key="item"
                            :class="[activeLayer.name == item.name ? 'active' : '']"
                        >
                            {{ item.name }}
                        </li>
                        <li
                            class="panel-list-item"
                            :class="{ active: showDistricts }"
                            @click="setShowDistricts(!showDistricts)"
                        >
                            Районы
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    emits: ['mapToBuryatia', 'shareModal'],

    computed: {
        ...mapGetters(['layers', 'activeLayer', 'showDistricts']),
    },
    methods: {
        ...mapActions(['setActiveLayer', 'setShowDistricts']),
    },
}
</script>

<style lang="scss" scoped>
.top-panel {
    position: fixed;
    top: 14px;
    right: 20px;
    z-index: 1002;
    display: flex;

    @media (max-width: 991.98px) {
        display: none;
    }

    &__btn {
        display: block;
        position: relative;
        padding: 0;
        border: none;
        border-radius: 100%;
        width: 40px;
        height: 40px;
        background: linear-gradient(117.02deg, #f7ce38 -2.53%, #fc210d 134.16%);
        box-shadow: 2px 2px 8px rgba(9, 12, 72, 0.2);

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 100%;
            background-position: center;
            background-repeat: no-repeat;
        }

        &.show-site::after {
            background-image: url(@/assets/img/icons/logo.png);
            background-position: 11px 9px;
            background-size: 17px;
        }

        &.show-bur::after {
            background-image: url(@/assets/img/icons/focus-line.png);
            background-size: 24px;
        }
        &.show-share::after {
            background-image: url(@/assets/img/icons/share-line.png);
            background-size: 24px;
        }

        &.show-layers::after {
            background-image: url(@/assets/img/icons/stack-line.png);
            background-size: 24px;
        }
    }
}

.top-panel-item {
    position: relative;
    margin-right: 10px;
    &:last-child {
        margin-right: 0;
    }

    &__content {
        position: absolute;
        top: calc(100% + 15px);
        right: 0px;
    }
}

.panel-list {
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: #fff;
    box-shadow: 0 11px 8px -8px #00000026;
}

.panel-list-item {
    min-width: 160px;
    padding: 12px;
    font-size: 18px;
    color: #000;
    cursor: pointer;

    &.active {
        background-color: #f97a23;
        color: #fff;
    }
}
</style>
