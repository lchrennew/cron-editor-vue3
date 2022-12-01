<template>
    <a-form-item :wrapper-col="{span: 2}" label="每">
        <a-input-number
            v-model:value="everyLocal"
            :max="23"
            :min="1" addon-after="小时"
            size="small"/>
    </a-form-item>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";

const props = defineProps({
    mode: Object,
    value: String,
})
const emit = defineEmits([ 'update:value' ])

const match = computed(() => props.value.match(props.mode.patterns[0]))

const every = computed(() => match.value?.groups?.every || 1)

const everyLocal = ref(every.value)

const update = () =>
    emit('update:value', `0 0 0/${everyLocal.value} 1/1 * ?`)

watchEffect(update)
</script>

<style scoped>

</style>