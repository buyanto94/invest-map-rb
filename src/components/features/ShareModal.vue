<template>
    <div class="modal-share">
        <div class="modal-share__field">
            {{ shareLink }}
        </div>
        <div class="modal-share__btn" @click="copyShareLink()">
            Скопировать ссылку <i class="fa fa-clone" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMapStore } from '@/stores/map'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
    center: [Array, Object],
    zoom: Number,
})

const emit = defineEmits(['copied'])
const mapStore = useMapStore()
const uiStore = useUIStore()

const shareLink = computed(() => {
    const baseUrl = window.location.origin + window.location.pathname

    if (mapStore.activeObject) {
        return `${baseUrl}?object=${mapStore.activeObject.id}`
    }

    const lat = Array.isArray(props.center) ? props.center[0] : props.center.lat
    const lng = Array.isArray(props.center) ? props.center[1] : props.center.lng

    return `${baseUrl}?zoom=${props.zoom}&lat=${lat}&lng=${lng}`
})

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(shareLink.value)

        uiStore.setMessage({
            text: 'Ссылка скопирована.',
            type: 'success',
        })

        emit('copied')
    } catch (e) {
        uiStore.setMessage({
            text: 'Ошибка копирования: ' + e.message,
            type: 'danger',
        })
    }
}
</script>

<style lang="scss" scoped>
.modal-share {
    &__field {
        padding: 12px 10px;
        background: #eff7fd;
        margin-bottom: 20px;
        word-break: break-all;
    }

    &__btn {
        padding: 10px 20px;
        border-radius: initial;
        background: #71bbe9;
        font-weight: 600;
        color: #fff;
        justify-content: space-between;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>