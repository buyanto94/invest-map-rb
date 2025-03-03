<template>
    <div class="object-card__icons">
        <div class="prop-icon" title="Электричество" :class="{ has: item.powerSupply }">
            <img src="@/assets/img/card/light.png" alt="" />
        </div>
        <div class="prop-icon" title="Газ" :class="{ has: item.gasSupply }">
            <img src="@/assets/img/card/gas.png" alt="" />
        </div>
        <div class="prop-icon" title="Водоснабжение" :class="{ has: item.waterSupply }">
            <img src="@/assets/img/card/water.png" alt="" />
        </div>
        <div class="prop-icon" title="Интернет" :class="{ has: item.transportInfrastructureAvailability }">
            <img src="@/assets/img/card/enet.png" alt="" />
        </div>
        <div class="prop-icon" title="Водоотведение" :class="{ has: item.waterDisposal }">
            <img src="@/assets/img/card/water-out.png" alt="" />
        </div>
        <div class="prop-icon" title="Теплоснабжение" :class="{ has: item.heatSupply }">
            <img src="@/assets/img/card/heating.png" alt="" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.object-card__icons {
    padding: 15px 0;
    border-top: 1px solid #ffffff1a;
    border-bottom: 1px solid #ffffff1a;
    margin-bottom: 20px;
}

.prop-icon {
    width: 48px;
    height: 48px;
    padding: 10px;
    border-radius: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    position: relative;
    display: inline-block;
    margin-right: 10px;

    &.has {
        background: rgba(255, 255, 255, 0.1);
        border: none;

        &::before {
            content: '';
            position: absolute;
            right: -3px;
            top: 0px;
            width: 18px;
            height: 18px;
            background: url(@/assets/img/card/has.png) center/cover no-repeat;
        }
    }

    img {
        width: 100%;
        height: auto;
    }
}
</style>