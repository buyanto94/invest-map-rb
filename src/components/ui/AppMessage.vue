<template>
    <div class="toast-block position-fixed top-0 end-0 p-3" v-show="uiStore.message">
        <div id="liveToast" class="toast align-items-center text-white border-0" role="alert">
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
import { computed, watch, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

const uiStore = useUIStore()
const timeoutID = ref(null)

const typeMessageClass = computed(() => {
    return (uiStore.message && uiStore.message.type) ? uiStore.message.type : 'primary'
})

const showToast = () => {
    const toastLive = document.getElementById('liveToast')
    if (!toastLive) return

    const toast = bootstrap.Toast.getOrCreateInstance(toastLive)
    toast.show()

    timeoutID.value = setTimeout(() => {
        hideToast()
    }, 5000)
}

const hideToast = () => {
    const toastLive = document.getElementById('liveToast')
    if (!toastLive) return

    const toast = bootstrap.Toast.getOrCreateInstance(toastLive)
    toast.hide()

    if (timeoutID.value) clearTimeout(timeoutID.value)
    uiStore.clearMessage()
}

watch(() => uiStore.message, (val) => {
    if (val) showToast()
})
</script>

<style lang="scss" scoped>
.toast-block {
    z-index: 99999;
}
</style>