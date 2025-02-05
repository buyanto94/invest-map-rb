<template>
    <div class="select-block" ref="selectBlockRef">
        <div class="select-block__title" :class="{ active: areOptionsVisible }"
            @click="areOptionsVisible = !areOptionsVisible">
            {{ selected }}
        </div>
        <div class="select-block__options" v-if="areOptionsVisible">
            <div class="select-block__option" @click="selectOption(nullOption)">
                {{ nullOption.name }}
            </div>
            <div class="select-block__option" v-for="option in options" :key="option.value"
                @click="selectOption(option)">
                {{ option.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    selected: {
        type: String,
        default: '',
    },
    nullOption: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['select'])

const areOptionsVisible = ref(false)
const selectBlockRef = ref(null)

const selectOption = (option) => {
    emit('select', option)
    areOptionsVisible.value = false
}

const handleClickOutside = (e) => {
    if (selectBlockRef.value && !selectBlockRef.value.contains(e.target)) {
        areOptionsVisible.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.select-block {
    position: relative;

    &__title {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        color: #292e91;
        background: #f5f5fa;
        border-radius: 1px;
        padding: 15px 45px 15px 20px;
        border: 1px solid #292e91;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            width: 34px;
            height: 100%;
            top: 0;
            right: 0;
            background-color: #f5f5fa;
            background-image: url('@/assets/img/icons/arrow-select.png');
            background-position: center;
            background-size: 24px;
            background-repeat: no-repeat;
            pointer-events: none;
            transition: transform 0.2s;
        }

        &.active::after {
            transform: rotate(180deg);
        }
    }

    &__options {
        border: 1px solid #292e91;
        border-top: none;
        cursor: pointer;
        position: absolute;
        top: 100%;
        width: 100%;
        max-height: 395px;
        overflow: auto;
        z-index: 9999;
    }

    &__option {
        background-color: #fff;
        font-size: 14px;
        line-height: 16px;
        color: #292e91;
        padding: 15px 30px 15px 20px;
        border-bottom: 1px solid #e9e9f6;

        &:first-child {
            border-top: 1px solid #e9e9f6;
        }

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: #f0f0f5;
        }
    }
}
</style>