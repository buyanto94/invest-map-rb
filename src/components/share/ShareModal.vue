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

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    emits: ['copied'],
    props: {
        center: [Array, Object],
        zoom: Number,
    },
    computed: {
        ...mapGetters(['activeObject']),
        shareLink() {
            if (this.activeObject) {
                return `${window.location.host}${location.pathname}?object=${this.activeObject.id}`
            }

            if (this.center[0] && this.center[1]) {
                return `${window.location.host}${location.pathname}?zoom=${this.zoom}&lat=${this.center[0]}&lng=${this.center[1]}`
            } else {
                return `${window.location.host}${location.pathname}?zoom=${this.zoom}&lat=${this.center.lat}&lng=${this.center.lng}`
            }
        },
    },

    methods: {
        ...mapActions(['setMessage']),
        copyShareLink() {
            try {
                navigator.clipboard.writeText(this.shareLink)

                this.setMessage({
                    text: 'Ссылка скопирована.',
                    type: 'success',
                })

                this.$emit('copied')
            } catch (e) {
                this.setMessage({
                    text: 'Ошибка ' + e.name + ':' + e.message,
                    type: 'danger',
                })
            }
        },
    },
}
</script>
