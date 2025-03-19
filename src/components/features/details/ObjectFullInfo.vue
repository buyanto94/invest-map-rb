<template>
    <teleport to="body">
        <app-modal :open="isOpen" @update:open="emit('update:isOpen', $event)" scrollable size="lg">
            <template #header>
                <h5 class="custom-modal__title">Полная информация об объекте</h5>
                <div class="custom-modal__header-btn" @click="printElement('print-content')">
                    <i class="fa fa-print" aria-hidden="true"></i>
                </div>
            </template>
            <template #default>
                <div id="print-content" v-if="item">
                    <table border="1" style="text-align: left; border-collapse: collapse" class="table table-bordered">
                        <tbody>
                            <tr v-if="item.category?.name">
                                <th>Категория</th>
                                <td>{{ item.category.name }}</td>
                            </tr>
                            <tr v-if="item.typeObject">
                                <th>Тип объекта</th>
                                <td>{{ item.typeObject }}</td>
                            </tr>
                            <tr v-if="item.title">
                                <th>Название</th>
                                <td>{{ item.title }}</td>
                            </tr>
                            <tr v-if="item.landCategory">
                                <th>Категория земель</th>
                                <td>{{ getCategoryName(item.landCategory) }}</td>
                            </tr>
                            <tr v-if="item.landTenure">
                                <th>Вид права владения землей</th>
                                <td>{{ item.landTenure }}</td>
                            </tr>
                            <tr v-if="item.municipalArea">
                                <th>Муниципальное образование</th>
                                <td>{{ getDistrictName(item.municipalArea) }}</td>
                            </tr>
                            <tr v-if="item.owner">
                                <th>Собственник</th>
                                <td>{{ item.owner }}</td>
                            </tr>
                            <tr v-if="item.typeOfOwnership?.title">
                                <th>Форма собственности</th>
                                <td>{{ item.typeOfOwnership.title }}</td>
                            </tr>
                            <tr v-if="item.specialPurpose">
                                <th>Целевое (приоритетное) назначение земельного участка</th>
                                <td>{{ item.specialPurpose }}</td>
                            </tr>
                            <tr v-if="item.area">
                                <th>Общая площадь(га)</th>
                                <td>{{ item.area }}</td>
                            </tr>
                            <tr v-if="item.free_area">
                                <th>Свободная площадь(га)</th>
                                <td>{{ item.free_area }}</td>
                            </tr>
                            <tr v-if="item.cadastralNumber">
                                <th>Кадастровый номер земельного участка</th>
                                <td>{{ item.cadastralNumber }}</td>
                            </tr>
                            <tr v-if="item.expandability !== undefined">
                                <th>Возможность расширения</th>
                                <td>{{ item.expandability ? 'Да' : 'Нет' }}</td>
                            </tr>
                            <tr>
                                <th>Газоснабжение</th>
                                <td>{{ item.gasSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Теплоснабжение</th>
                                <td>{{ item.heatSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Электроснабжение</th>
                                <td>{{ item.powerSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Водоснабжение</th>
                                <td>{{ item.waterSupply || '-' }}</td>
                            </tr>
                            <tr>
                                <th>Водоотведение</th>
                                <td>{{ item.waterDisposal || '-' }}</td>
                            </tr>
                            <tr v-if="item.transportInfrastructureAvailability">
                                <th>Наличие транспортной инфраструктуры</th>
                                <td>{{ item.transportInfrastructureAvailability }}</td>
                            </tr>
                            <tr v-if="item.privileges">
                                <th>Льготы и преференции</th>
                                <td>{{ item.privileges }}</td>
                            </tr>
                            <tr v-if="item.provisionTerms">
                                <th>Условия предоставления инвестору</th>
                                <td>{{ item.provisionTerms }}</td>
                            </tr>
                            <tr v-if="item.dopInfo">
                                <th>Дополнительная информация</th>
                                <td v-html="item.dopInfo"></td>
                            </tr>
                            <tr v-if="item.contact">
                                <th>Контактное лицо</th>
                                <td>{{ item.contact }}</td>
                            </tr>
                            <tr v-if="item.phone">
                                <th>Телефон</th>
                                <td>{{ item.phone }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </app-modal>
    </teleport>
</template>

<script setup>
import AppModal from '@/components/ui/AppModal.vue'
import { useFormatters } from '@/composables/useFormatters'
import { usePrint } from '@/composables/usePrint'

defineProps({
    isOpen: Boolean,
    item: Object
})

const emit = defineEmits(['update:isOpen'])

const { getCategoryName, getDistrictName } = useFormatters()
const { printElement } = usePrint()
</script>