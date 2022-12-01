<template>
    <a-form-item label="每" :wrapper-col="{span: 2}">
        <a-input-number
            v-model:value="everyLocal"
            :max="59"
            :min="1"
            addon-after="分钟"
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
const every = computed(() => Number(props.value.match(props.mode.patterns[0])?.groups.every ?? 1))
const everyLocal = ref(every.value)

watchEffect(() => emit('update:value', `0 0/${everyLocal.value || 1} * 1/1 * ?`))

</script>

<style scoped>

</style>