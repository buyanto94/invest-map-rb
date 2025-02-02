<template>
    <div :id="modalId" class="modal custom-modal" tabindex="-1">
        <div class="modal-dialog" :class="classObject">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header" />
                    <div class="custom-modal__header-btn" @click="closeModal">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="modal-body">
                    <slot name="default" :close="closeModal" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

const props = defineProps({
    open: Boolean,
    scrollable: Boolean,
    centered: Boolean,
    size: String // 'sm', 'lg', 'xl'
})

const emit = defineEmits(['update:open'])


const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`
let modalInstance = null

const classObject = computed(() => ({
    'modal-dialog-centered': props.centered,
    'modal-dialog-scrollable': props.scrollable,
    [`modal-${props.size}`]: !!props.size
}))

const showModal = () => {
    if (!modalInstance) {
        const el = document.getElementById(modalId)
        if (el) modalInstance = new bootstrap.Modal(el)
    }
    modalInstance?.show()
}

const closeModal = () => {
    modalInstance?.hide()
}

onMounted(() => {
    const el = document.getElementById(modalId)
    if (el) {
        el.addEventListener('hidden.bs.modal', () => {
            emit('update:open', false)
        })
    }
})

watch(() => props.open, (val) => {
    if (val) showModal()
    else closeModal()
})
</script>

<style lang="scss" scoped>
.custom-modal {
    &__header-btn {
        width: 30px;
        height: 30px;
        font-size: 24px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        margin-left: 15px;
    }

    &__title {
        flex-grow: 1;
        font-size: 24px;
        line-height: 30px;
    }
}
</style>