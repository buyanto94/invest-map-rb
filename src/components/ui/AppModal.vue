<template>
    <!-- todo: Почему то при передаче open = '' возвращает true -->
    <div :id="id" class="modal custom-modal">
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
<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
    emits: ['update:open'],
    props: {
        open: Boolean,
        scrollable: Boolean,
        centered: Boolean,
        size: {
            validator(value) {
                return ['sm', 'lg', 'xl'].includes(value)
            },
        },
    },
    data() {
        return {
            id: 'modal-' + Date.now(),
        }
    },

    computed: {
        classObject() {
            const obj = {}

            if (this.centered) {
                obj['modal-dialog-centered'] = true
            }

            if (this.scrollable) {
                obj['modal-dialog-scrollable'] = true
            }

            if (this.size) {
                obj['modal-' + this.size] = true
            }

            return obj
        },
    },

    methods: {
        showModal() {
            const myModal = new bootstrap.Modal(document.getElementById(this.id))
            myModal.show()
        },

        closeModal() {
            const truck_modal = document.querySelector(`#${this.id}`)
            const modal = bootstrap.Modal.getInstance(truck_modal)

            if (modal) {
                modal.hide()
            }
        },
    },

    mounted() {
        var myModalEl = document.getElementById(this.id)
        myModalEl.addEventListener('hidden.bs.modal', () => {
            this.$emit('update:open', false)
        })
    },
    watch: {
        open(value) {
            if (value === true) {
                this.showModal()
            } else {
                this.closeModal()
            }
        },
    },
}
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
