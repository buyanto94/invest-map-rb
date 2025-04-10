<template>
    <div class="toast-block position-fixed top-0 end-0 p-3" v-show="uiStore.message">
        <div ref="toastRef" class="toast align-items-center text-white border-0" role="alert">
            <div :class="'bg-' + typeMessageClass">
                <div class="d-flex" v-if="uiStore.message">
                    <div class="toast-body">{{ uiStore.message.text }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref, onBeforeUnmount } from 'vue'
import { useUIStore } from '@/stores/ui'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

const uiStore = useUIStore()
const toastRef = ref(null)
let toastInstance = null
const timeoutID = ref(null)

const typeMessageClass = computed(() => {
    return (uiStore.message && uiStore.message.type) ? uiStore.message.type : 'primary'
})

const getToastInstance = () => {
    if (!toastRef.value) return null
    if (!toastInstance) {
        toastInstance = bootstrap.Toast.getOrCreateInstance(toastRef.value)
    }
    return toastInstance
}

const showToast = () => {
    const toast = getToastInstance()
    if (!toast) return

    toast.show()

    if (timeoutID.value) clearTimeout(timeoutID.value)

    timeoutID.value = setTimeout(() => {
        hideToast()
    }, 5000)
}

const hideToast = () => {
    const toast = getToastInstance()
    if (toast) toast.hide()

    if (timeoutID.value) clearTimeout(timeoutID.value)
    uiStore.clearMessage()
}

onBeforeUnmount(() => {
    if (timeoutID.value) clearTimeout(timeoutID.value)
    if (toastInstance) toastInstance.dispose()
})

watch(() => uiStore.message, (val) => {
    if (val) showToast()
})
</script>

<style lang="scss" scoped>
.toast-block {
    z-index: 99999;
}
</style>