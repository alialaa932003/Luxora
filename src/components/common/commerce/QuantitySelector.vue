<script setup lang="ts">
import { computed } from 'vue'
import { Minus, Plus } from '@lucide/vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), {
  min: 1,
  max: 99,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const canDecrement = computed(() => props.modelValue > props.min)
const canIncrement = computed(() => props.modelValue < props.max)

function decrement() {
  if (canDecrement.value) emit('update:modelValue', props.modelValue - 1)
}
function increment() {
  if (canIncrement.value) emit('update:modelValue', props.modelValue + 1)
}
function onInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  if (!isNaN(val) && val >= props.min && val <= props.max) {
    emit('update:modelValue', val)
  }
}
</script>

<template>
  <div
    class="inline-flex items-center border border-border rounded-xl overflow-hidden bg-background"
    :class="size === 'sm' ? 'h-8' : 'h-10'"
  >
    <button
      @click="decrement"
      :disabled="!canDecrement || disabled"
      :class="size === 'sm' ? 'px-2.5' : 'px-3'"
      class="h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      aria-label="Decrease quantity"
    >
      <Minus :size="size === 'sm' ? 12 : 14" />
    </button>
    <input
      type="number"
      :value="modelValue"
      @input="onInput"
      :min="min"
      :max="max"
      :disabled="disabled"
      :class="size === 'sm' ? 'w-8 text-sm' : 'w-10 text-base'"
      class="h-full text-center font-semibold text-foreground bg-transparent border-x border-border focus:outline-none disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      :aria-label="`Quantity: ${modelValue}`"
    />
    <button
      @click="increment"
      :disabled="!canIncrement || disabled"
      :class="size === 'sm' ? 'px-2.5' : 'px-3'"
      class="h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      aria-label="Increase quantity"
    >
      <Plus :size="size === 'sm' ? 12 : 14" />
    </button>
  </div>
</template>
