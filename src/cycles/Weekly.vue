<template>
    <a-form-item label="星期">
        <a-checkbox-group v-model:value="weekdaysLocal" size="small">
            <a-checkbox v-for="(name, i) in weekdayNames" :value="i+1">{{ name }}</a-checkbox>
        </a-checkbox-group>
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
const match = computed(() => props.value.match(props.mode.patterns[0]))

const weekdays = computed(() => match.value.groups.weekdays.split(',').map(i => Number(i)))
const weekdaysLocal = ref(weekdays.value)
const weekdaysString = computed(() => weekdaysLocal.value.join(','))

watch(weekdaysLocal, (value, oldValue) => value.length || (weekdaysLocal.value = oldValue))

const startsAt = computed(() => {
    const { hour = 0, minute = 0 } = match.value?.groups ?? {}
    return dayjs(`${hour}:${minute}`, 'HH:mm')
})

const startsAtLocal = ref(startsAt.value)

const startsAtString = computed(() => startsAtLocal.value?.format('m H') || '0 0')
watch(startsAtLocal, (value, oldValue) => value || (startsAtLocal.value = oldValue))

const update = () =>
    startsAtLocal.value &&
    weekdaysString.value.length &&
    emit('update:value', `0 ${startsAtString.value} ? * ${weekdaysString.value}`)
watchEffect(update)
</script>

<style scoped>

</style>