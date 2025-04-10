<template>
    <div ref="modalRef" class="modal custom-modal" tabindex="-1">
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
import { computed, onMounted, watch, ref, onBeforeUnmount } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

const props = defineProps({
    open: Boolean,
    scrollable: Boolean,
    centered: Boolean,
    size: String
})

const emit = defineEmits(['update:open'])

const modalRef = ref(null)
let modalInstance = null

const classObject = computed(() => ({
    'modal-dialog-centered': props.centered,
    'modal-dialog-scrollable': props.scrollable,
    [`modal-${props.size}`]: !!props.size
}))

const showModal = () => {
    if (!modalInstance && modalRef.value) {
        modalInstance = new bootstrap.Modal(modalRef.value)

        modalRef.value.addEventListener('hidden.bs.modal', onHidden)
    }
    modalInstance?.show()
}

const closeModal = () => {
    modalInstance?.hide()
}

const onHidden = () => {
    emit('update:open', false)
}

onMounted(() => {
    if (props.open) {
        showModal()
    }
})


onBeforeUnmount(() => {
    if (modalRef.value) {
        modalRef.value.removeEventListener('hidden.bs.modal', onHidden)
    }
    if (modalInstance) {
        modalInstance.dispose()
    }
})

watch(() => props.open, (val) => {
    if (val) showModal()
    else closeModal()
})
</script>