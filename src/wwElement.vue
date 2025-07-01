<template>
  <div :class="wrapperClasses">
    <label v-if="content.label" :class="labelClasses">
      {{ content.label }}
      <span v-if="content.required" class="text-destructive ml-1">*</span>
    </label>
    
    <div :class="sliderContainerClasses">
      <div 
        ref="sliderRef"
        :class="sliderClasses"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
      >
        <div :class="trackClasses">
          <div :class="rangeClasses" :style="rangeStyle" />
        </div>
        <div 
          :class="thumbClasses"
          :style="thumbStyle"
          :tabindex="content.disabled ? -1 : 0"
          @keydown="handleKeyDown"
        />
      </div>
      
      <div v-if="content.showValue" :class="valueClasses">
        {{ formattedValue }}
      </div>
    </div>
    
    <div v-if="content.showMinMax" :class="minMaxClasses">
      <span>{{ content.min }}</span>
      <span>{{ content.max }}</span>
    </div>
    
    <div v-if="content.helpText" :class="helpTextClasses">
      {{ content.helpText }}
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { cn } from './cn.js'

export default {
  name: 'WewebSlider',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        required: false,
        label: '',
        helpText: '',
        showValue: true,
        showMinMax: false,
        formatValue: null,
        customClasses: ''
      })
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const sliderRef = ref(null)
    const isDragging = ref(false)

    const normalizedValue = computed(() => {
      const value = Math.min(Math.max(props.modelValue || 0, props.content.min), props.content.max)
      return ((value - props.content.min) / (props.content.max - props.content.min)) * 100
    })

    const formattedValue = computed(() => {
      if (props.content.formatValue && typeof props.content.formatValue === 'function') {
        return props.content.formatValue(props.modelValue)
      }
      return props.modelValue
    })

    const wrapperClasses = computed(() => cn(
      "w-full space-y-2",
      props.content.customClasses
    ))

    const labelClasses = computed(() => cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    ))

    const sliderContainerClasses = computed(() => cn(
      "flex items-center space-x-4"
    ))

    const sliderClasses = computed(() => cn(
      "relative flex w-full touch-none select-none items-center cursor-pointer",
      {
        "opacity-50 cursor-not-allowed": props.content.disabled
      }
    ))

    const trackClasses = computed(() => cn(
      "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    ))

    const rangeClasses = computed(() => cn(
      "absolute h-full bg-primary"
    ))

    const rangeStyle = computed(() => ({
      width: `${normalizedValue.value}%`
    }))

    const thumbClasses = computed(() => cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 absolute",
      {
        "cursor-grab": !isDragging.value && !props.content.disabled,
        "cursor-grabbing": isDragging.value
      }
    ))

    const thumbStyle = computed(() => ({
      left: `calc(${normalizedValue.value}% - 10px)`
    }))

    const valueClasses = computed(() => cn(
      "text-sm font-medium min-w-[3rem] text-center"
    ))

    const minMaxClasses = computed(() => cn(
      "flex justify-between text-xs text-muted-foreground"
    ))

    const helpTextClasses = computed(() => cn(
      "text-sm text-muted-foreground"
    ))

    const updateValue = (clientX) => {
      if (!sliderRef.value || props.content.disabled) return

      const rect = sliderRef.value.getBoundingClientRect()
      const percentage = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
      const rawValue = props.content.min + percentage * (props.content.max - props.content.min)
      const steppedValue = Math.round(rawValue / props.content.step) * props.content.step
      const clampedValue = Math.min(Math.max(steppedValue, props.content.min), props.content.max)

      emit('update:modelValue', clampedValue)
      emit('change', clampedValue)

      // Update Weweb variable if defined
      if (props.content.wewebVariable && typeof wwLib !== 'undefined') {
        wwLib.wwVariable.updateValue(props.content.wewebVariable, clampedValue)
      }
    }

    const handleMouseDown = (event) => {
      if (props.content.disabled) return
      
      isDragging.value = true
      updateValue(event.clientX)
    }

    const handleTouchStart = (event) => {
      if (props.content.disabled) return
      
      isDragging.value = true
      updateValue(event.touches[0].clientX)
    }

    const handleMouseMove = (event) => {
      if (isDragging.value) {
        updateValue(event.clientX)
      }
    }

    const handleTouchMove = (event) => {
      if (isDragging.value) {
        updateValue(event.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      isDragging.value = false
    }

    const handleKeyDown = (event) => {
      if (props.content.disabled) return

      let newValue = props.modelValue
      const step = props.content.step

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(props.modelValue - step, props.content.min)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(props.modelValue + step, props.content.max)
          break
        case 'Home':
          newValue = props.content.min
          break
        case 'End':
          newValue = props.content.max
          break
        default:
          return
      }

      event.preventDefault()
      emit('update:modelValue', newValue)
      emit('change', newValue)
    }

    onMounted(() => {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleEnd)
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    })

    return {
      sliderRef,
      formattedValue,
      wrapperClasses,
      labelClasses,
      sliderContainerClasses,
      sliderClasses,
      trackClasses,
      rangeClasses,
      rangeStyle,
      thumbClasses,
      thumbStyle,
      valueClasses,
      minMaxClasses,
      helpTextClasses,
      handleMouseDown,
      handleTouchStart,
      handleKeyDown
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 