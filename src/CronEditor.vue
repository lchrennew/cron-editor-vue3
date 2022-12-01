<template>
    <a-form :label-col="{span: 4}" :wrapper-col="{span: 20}" size="small">
        <a-form-item label="频率" :wrapper-col="{span: 2}">
            <a-select v-model:value="modeKey" size="small">
                <a-select-option v-for="mode in modes" :value="mode.key">{{ mode.name }}</a-select-option>
            </a-select>
        </a-form-item>
        <component :is="mode.component" :mode="mode" v-model:value="localValue"/>
        <slot :value="localValue"/>
    </a-form>
</template>


<script setup>
import { computed, ref, watchEffect } from "vue";
import { modes } from "./modes.js";

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