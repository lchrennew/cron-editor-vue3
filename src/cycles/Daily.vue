<template>
    <a-form-item label="周期">
        <a-radio v-model:checked="isEvery" size="small">每天（含周末）</a-radio>
        <a-radio v-model:checked="isWeekday" size="small">每天（非周末）</a-radio>
    </a-form-item>
    <a-form-item :wrapper-col="{span: 2}" label="开始于">
        <a-time-picker v-model:value="startsAtLocal" format="HH:mm" size="small"/>
    </a-form-item>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import dayjs from "dayjs";

const props = defineProps({
    mode: Object,
    value: String,
})
const emit = defineEmits([ 'update:value' ])
const match = computed(() =>
    props.value.match(props.mode.patterns[0])
    ?? props.value.match(props.mode.patterns[1]))

const isEvery = computed({
    get: () => !match.value?.groups || !match.value.groups.weekday,
    set: value => value && emit('update:value', `0 ${startsAtString.value} 1/1 * ?`),
})

const isWeekday = computed({
    get: () => !isEvery.value,
    set: value => value && emit('update:value', `0 ${startsAtString.value} ? * 1-5`),
})

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
        `0 ${startsAtString.value} ${isEvery.value ? '1/1 * ?' : '? * 1-5'}`)
watchEffect(update)
</script>

<style scoped>

</style>