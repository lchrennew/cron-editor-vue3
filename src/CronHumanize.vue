<template>
    {{ text }}
</template>

<script setup>
import { modes } from "./modes.js";
import { ref, watchEffect } from 'vue'

const props = defineProps({
    value: String
})

const text = ref('--')
watchEffect(() => {
    let patternIndex, match, humanize
    modes.some(m => m.patterns.some((pattern, i) => {
        match = props.value.match(pattern)
        if (!match) return
        patternIndex = i
        humanize = m.humanize[i]
        text.value = humanize(match.groups)
    }))
})
</script>

<style scoped>

</style>