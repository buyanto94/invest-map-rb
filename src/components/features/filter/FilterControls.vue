<template>
    <div>
        <div class="mb-3">
            <app-select :options="landCategories" :selected="selectedLandCategory?.name || 'Категория земель'"
                :nullOption="{ name: 'Категория земель', value: null }"
                @select="$emit('update:selectedLandCategory', $event)" />
        </div>

        <div class="mb-3">
            <label>Тип</label>
            <div class="radio-bts">
                <div class="radio-bts__item" :class="{ active: typeArea === 'greenfield' }"
                    @click="$emit('update:typeArea', toggleType('greenfield'))">
                    <label>Greenfield</label>
                </div>
                <div class="radio-bts__item" :class="{ active: typeArea === 'brownfield' }"
                    @click="$emit('update:typeArea', toggleType('brownfield'))">
                    <label>Brownfield</label>
                </div>
            </div>
        </div>

        <div class="mb-3">
            <label>Общая площадь (га)</label>
            <div class="filter-slider">
                <Slider :modelValue="area" @update:modelValue="$emit('update:area', $event)" :min="areaMarks[0]"
                    :max="areaMarks[1]" tooltipPosition="bottom" />
            </div>
        </div>

        <div class="mb-3">
            <app-select :options="ownershipTypes" :selected="selectedOwnership?.name || 'Форма собственности'"
                :nullOption="{ name: 'Форма собственности', value: null }"
                @select="$emit('update:selectedOwnership', $event)" />
        </div>

        <div class="mb-3">
            <label>До Улан-Удэ (км)</label>
            <div class="filter-slider">
                <Slider :modelValue="distances" @update:modelValue="$emit('update:distances', $event)"
                    :min="distancesMarks[0]" :max="distancesMarks[1]" tooltipPosition="bottom" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Slider from '@vueform/slider'
import AppSelect from '@/components/ui/AppSelect.vue'

const props = defineProps({
    landCategories: Array,
    ownershipTypes: Array,
    selectedLandCategory: Object,
    selectedOwnership: Object,
    typeArea: String,
    area: Array,
    areaMarks: Array,
    distances: Array,
    distancesMarks: Array
})

defineEmits([
    'update:selectedLandCategory',
    'update:selectedOwnership',
    'update:typeArea',
    'update:area',
    'update:distances'
])

const toggleType = (val) => {
    return props.typeArea === val ? null : val
}
</script>

<style lang="scss" scoped>
.radio-bts {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    padding: 1px;
    background: linear-gradient(302.38deg, #292ec4 -32.56%, #4ca9df 92.35%);

    &__item {
        flex-basis: 0;
        flex-grow: 1;
        text-align: center;

        label {
            background-color: #f5f5fa;
            font-weight: 600;
            color: #292e91;
            display: block;
            cursor: pointer;
            padding: 15px 10px;
            font-size: 16px;
            margin: 0;
            border-right: 1px solid #4ca9df;
        }

        &:first-child label {
            border-radius: 1px 0 0 1px;
            border-left: none;
        }

        &:last-child label {
            border-radius: 0 1px 1px 0;
            border-right: none;
        }

        &.active label {
            background: #292e91;
            color: #fff;
        }
    }
}

.filter-slider {
    padding: 0 15px;
    margin-top: 10px;
    margin-bottom: 50px;
}
</style>