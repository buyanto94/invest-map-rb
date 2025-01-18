<template>
    <div class="select-block">
        <div
            class="select-block__title"
            :class="{ active: areOptionsVisible }"
            @click="areOptionsVisible = !areOptionsVisible"
        >
            {{ selected }}
        </div>
        <div class="select-block__options" v-if="areOptionsVisible">
            <div class="select-block__option" @click="selectOption(nullOption)">
                {{ nullOption.name }}
            </div>
            <div
                class="select-block__option"
                v-for="option in options"
                :key="option.value"
                @click="selectOption(option)"
            >
                {{ option.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default() {
                return []
            },
        },
        selected: {
            type: String,
            default: '',
        },
        nullOption: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            areOptionsVisible: false,
        }
    },
    methods: {
        selectOption(option) {
            this.$emit('select', option)
            this.areOptionsVisible = false
        },

        hideSelect(e) {
            if (!e.target.classList.contains('select-block__title')) {
                this.areOptionsVisible = false
            }
        },
    },

    mounted() {
        document.addEventListener('click', this.hideSelect.bind(this), true)
    },

    // beforeDestroy() {
    //     document.removeEventListener('click', this.hideSelect)
    // },
}
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
            top: 0px;
            right: 0px;
            background-color: #f5f5fa;
            background-image: url('@/assets/img/icons/arrow-select.png');
            background-position: center;
            background-size: 24px;
            background-repeat: no-repeat;
            pointer-events: none;
        }

        &.active::after {
            transform: rotate(180deg);
        }
    }

    &__options {
        border-left: 1px solid #292e91;
        border-right: 1px solid #292e91;
        border-bottom: 1px solid #292e91;
        cursor: pointer;
        position: absolute;
        top: calc(100% - 1px);
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
    }
}
</style>
