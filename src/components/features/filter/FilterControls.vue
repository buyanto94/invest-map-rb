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