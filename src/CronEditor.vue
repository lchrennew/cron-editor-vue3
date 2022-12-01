<template>
    <a-form :label-col="{span: 4}" :wrapper-col="{span: 20}" size="small">
        <a-form-item label="频率" :wrapper-col="{span: 2}">
            <a-select v-model:value="modeKey" size="small">
                <a-select-option v-for="mode in modesRef" :value="mode.key">{{ mode.name }}</a-select-option>
            </a-select>
        </a-form-item>
        <component :is="mode.component" :mode="mode" v-model:value="localValue"/>
        <slot :value="localValue"/>
    </a-form>
</template>

<script>
import Minutes from "./cycles/Minutes.vue";
import Hourly from "./cycles/Hourly.vue";
import Daily from "./cycles/Daily.vue";
import Weekly from "./cycles/Weekly.vue";
import Monthly from "./cycles/Monthly.vue";

const modes = [
    {
        name: '分钟',
        key: 'Minutes',
        component: Minutes,
        default: '0 0/1 * 1/1 * ?',
        patterns: [ /^0 0\/(?<every>\d+) \* 1\/1 \* \?$/ ],
    },
    {
        name: '小时',
        key: 'Hourly',
        component: Hourly,
        default: '0 0 0/1 1/1 * ?',
        patterns: [ /^0 0 0\/(?<every>\d+) 1\/1 \* \?$/ ],
    },
    {
        name: '天',
        key: 'Daily',
        component: Daily,
        default: '0 0 0 1/1 * ?',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) 1\/1 \* \?$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? \* (?<weekday>1-5)$/,
        ],
    },
    {
        name: '周',
        key: 'Weekly',
        component: Weekly,
        default: '0 0 0 ? * 1',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) \? \* (?<weekdays>\d(?:,\d){0,6})$/,
        ],
    },
    {
        name: '月',
        key: 'Monthly',
        component: Monthly,
        default: '0 0 0 1 1/1 ?',
        patterns: [
            /^0 (?<minute>\d+) (?<hour>\d+) (?<day>\d+)(?<last>L)? 1\/(?<every>\d+) \?$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? 1\/(?<every>\d+) (?<weekday>\d)(?<nth>#[1-5])$/,
            /^0 (?<minute>\d+) (?<hour>\d+) \? 1\/(?<every>\d+) (?<weekday>\d)(?<nth>L)$/,
        ],
    },
]
</script>

<script setup>
import { computed, ref, watchEffect } from "vue";

const modesRef = ref(modes)
const props = defineProps({
    value: String
})

const localValue = ref(props.value)

const emit = defineEmits([ 'update:value' ])

const mode = computed(() => {
    const expression = localValue.value
    return (modes.find(m => m.patterns.some(pattern => pattern.test(expression))) ?? modes[0])
})

const modeKey = computed({
    get() {
        return mode.value.key
    },
    set(value) {
        localValue.value = modes.find(m => m.key === value).default
    }
})

const submit = () => emit('update:value', localValue.value)
watchEffect(submit)

</script>

<style scoped>

</style>