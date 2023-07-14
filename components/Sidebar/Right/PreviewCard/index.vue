<template>
  <!-- overflow hidden hides corner when hovering on item with rounded borders  -->
  <div class="m-2 border rounded-2xl bg-gray-50 dark:bg-dim-700 overflow-hidden" :class="twitterBorderColor">
    
    <h1 class="p-3 text-xl font-extrabold text-gray-900 border-b dark:text-white" :class="twitterBorderColor"> <!-- border-b= bottom border only -->
      {{ props.title }}
    </h1>
    
    <!-- items -->
    <slot></slot>

    <div class="p-3 text-sm text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300" :class="defaultTransition">
      Show more
    </div>

  </div>
  
</template>

<script setup>
import useTailwindConfig from "~/composables/useTailwindConfig";

const { twitterBorderColor, defaultTransition  } = useTailwindConfig()

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

</script>