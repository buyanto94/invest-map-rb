<template>
    <div class="nav-desktop" v-show="!uiStore.showFilterPanel">
        <div class="nav-desktop__logo">
            <img src="./../assets/img/logo-mini.png" class="img-fluid" alt="" />
        </div>
        <div class="nav-desktop__item" @click="uiStore.setShowFilterPanel(true)">
            <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="nav-desktop__item" @click="uiStore.setShowFilterPanel(true)">
            <i class="fa fa-sliders" aria-hidden="true"></i>
        </div>
        <div class="nav-desktop__toggler" @click="uiStore.setShowFilterPanel(true)">
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
    </div>

    <div class="nav-mobile" v-show="!uiStore.showFilterPanel && !uiStore.showSearchPanel">
        <nav class="navbar bg-light navbar-expand">
            <div class="navbar-nav w-100 nav-justified">
                <li class="nav-item">
                    <a class="nav-link" @click.prevent="uiStore.setShowFilterPanel(true)">
                        <i class="fa fa-sliders" aria-hidden="true"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" @click.prevent="uiStore.setShowSearchPanel(true)">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" @click.prevent="emit('shareModal')" target="_self">
                        <i class="fa fa-share" aria-hidden="true"></i>
                    </a>
                </li>
                <li class="nav-item dropdown dropup">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item" href="https://invest-buryatia.ru/" target="_blank">Инвестиционный
                                портал</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="emit('mapToBuryatia')">К республике
                                Бурятия</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="emit('selectMapModal')">Выбрать карту</a>
                        </li>
                    </ul>
                </li>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'

const emit = defineEmits(['mapToBuryatia', 'shareModal', 'selectMapModal'])
const uiStore = useUIStore()
</script>

<style lang="scss" scoped>
.navbar {
    .nav-link {
        color: #292e91;
    }
}

.nav-desktop {
    margin: 0;
    height: 100vh;
    width: 65px;
    background-color: #fff;
    padding: 24px 5px 12px;
    color: #292e91;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    @media (max-width: 991.98px) {
        display: none;
    }

    &__logo {
        max-width: 45px;
        margin-bottom: 28px;
    }

    &__item {
        margin-bottom: 20px;
        cursor: pointer;
    }

    &__toggler {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: auto;
        width: 40px;
        height: 40px;
        color: #292e91;
        background: rgba(41, 46, 145, 0.1);
        cursor: pointer;
    }
}

.nav-mobile {
    position: fixed;
    bottom: 0;
    width: 100vw;

    @media (min-width: 992px) {
        display: none;
    }

    .dropdown-toggle::after {
        content: none;
    }
}

.dropdown-menu {
    border-radius: 0px;
    padding: 0;

    .dropdown-item {
        padding: 10px 16px;
        color: #292e91;
    }

    li {
        border-bottom: 1px solid #eff7fd;

        &:last-child {
            border-bottom: none;
        }
    }
}

.dropup .dropdown-menu {
    bottom: calc(100% + 8px) !important;
}
</style>