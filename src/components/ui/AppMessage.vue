<template>
    <div class="toast-block position-fixed top-0 end-0 p-3" v-show="message">
        <div id="liveToast" class="toast align-items-center text-white border-0" role="alert">
            <div :class="'bg-' + typeMessageClass">
                <div class="d-flex" v-if="message">
                    <div class="toast-body">{{ message.text }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            timeoutID: '',
        }
    },
    computed: {
        ...mapGetters(['message']),

        typeMessageClass() {
            if (this.message && this.message.type) {
                return this.message.type
            }

            return 'primary'
        },
    },

    methods: {
        ...mapActions(['clearMessage']),

        showToast() {
            const toastLive = document.getElementById('liveToast')
            const toast = bootstrap.Toast.getOrCreateInstance(toastLive)
            toast.show()

            this.timeoutID = setTimeout(() => {
                this.hideToast()
            }, 5000)
        },

        hideToast() {
            const toastLive = document.getElementById('liveToast')
            const toast = bootstrap.Toast.getOrCreateInstance(toastLive)
            toast.hide()

            clearTimeout(this.timeoutID)
            this.clearMessage()
        },
    },

    watch: {
        message(val) {
            if (val) {
                this.showToast()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.toast-block {
    z-index: 99999;
}
</style>
