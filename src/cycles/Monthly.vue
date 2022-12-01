<template>
    <a-form-item label="每" :wrapper-col="{span: 2}">
        <a-input-number v-model:value="everyLocal" :min="1" :max="999" addon-after="个月" size="small"/>
    </a-form-item>
    <a-form-item :wrapper-col="{span: 3}">
        <template #label>
            <a-radio v-model:checked="isDayOfMonth" size="small"/>
            日期
        </template>
        <a-input-group size="small">
            <a-input-number
                v-model:value="dayOfMonthLocal"
                :max="31"
                :min="1"
                addon-after="天"
                size="small">
                <template #addonBefore>
                    <a-select size="small" v-model:value="lastDayOfMonth" style="width: 80px">
                        <a-select-option value="">第</a-select-option>
                        <a-select-option value="L">倒数第</a-select-option>
                    </a-select>
                </template>
            </a-input-number>
        </a-input-group>
    </a-form-item>
    <a-form-item>
        <template #label>
            <a-radio v-model:checked="isDayOfWeek" size="small"/>
            星期
        </template>
        <a-input-group compact size="small">
            <a-select v-model:value="nthLocal" size="small" style="width: 100px">
                <a-select-option v-for="i in 5" :value="`#${i}`">第 {{ i }} 个</a-select-option>
                <a-select-option value="L">最后一个</a-select-option>
            </a-select>
            <a-select v-model:value="weekdayLocal" size="small">
                <a-select-option v-for="(name, i) in weekdayNames" :value="i+1">周{{ name }}</a-select-option>
            </a-select>
        </a-input-group>
    </a-form-item>
    <a-form-item :wrapper-col="{span: 2}" label="开始于">
        <a-time-picker v-model:value="startsAtLocal" format="HH:mm" size="small"/>
    </a-form-item>
</template>

<script setup>

import { computed, ref, watch, watchEffect } from "vue";
import dayjs from "dayjs";

const weekdayNames = '一二三四五六日'

const props = defineProps({
    mode: Object,
    value: String,
})
const emit = defineEmits([ 'update:value' ])
const match = computed(() =>
    props.value.match(props.mode.patterns[0])
    ?? props.value.match(props.mode.patterns[1])
    ?? props.value.match(props.mode.patterns[2]))

const isDayOfMonth = computed({
    get: () => !match.value?.groups || !!match.value.groups.day,
    set: value =>
        value
        && emit(
            'update:value',
            `0 ${startsAtString.value} ${dayOfMonthLocal.value}${lastDayOfMonth.value} 1/${everyLocal.value} ?`)
})

const isDayOfWeek = computed({
    get: () => !isDayOfMonth.value,
    set: value =>
        value &&
        emit('update:value',
            `0 ${startsAtString.value} ? 1/${everyLocal.value} ${weekdayLocal.value}${nthLocal.value}`
        )
})

const dayOfMonth = computed(() => match.value.groups.day)
const dayOfMonthLocal = ref(dayOfMonth.value)

const weekday = computed(() => match.value.groups.weekday)
const weekdayLocal = ref(weekday.value || 1)
const nth = computed(() => match.value.groups.nth || `#1`)
const nthLocal = ref(nth.value)

const last = computed(() => match.value.groups.last ?? '')
const lastDayOfMonth = ref(last.value)

const every = computed(() => Number(match.value.groups.every) || 1)
const everyLocal = ref(every.value)

const startsAt = computed(() => {
    const { hour = 0, minute = 0 } = match.value?.groups ?? {}
    return dayjs(`${hour}:${minute}`, 'HH:mm')
})

const startsAtLocal = ref(startsAt.value)

const startsAtString = computed(() => startsAtLocal.value?.format('m H') || '0 0')
watch(startsAtLocal, (value, oldValue) => value || (startsAtLocal.value = oldValue))

const update = () =>
    startsAtLocal.value &&
    emit(
        'update:value',
        isDayOfMonth.value
            ? `0 ${startsAtString.value} ${dayOfMonthLocal.value}${lastDayOfMonth.value} 1/${everyLocal.value} ?`
            : `0 ${startsAtString.value} ? 1/${everyLocal.value} ${weekdayLocal.value}${nthLocal.value}`
    )
watchEffect(update)
</script>

<style scoped>

</style>