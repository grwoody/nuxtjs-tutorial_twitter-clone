<template>
  <div>
    <!-- main wrapper -->
    <div class="flex items-center flex-shrink-0 p-4 pb-0">
      <!-- profile image wrapper -->
      <div class="flex 2-12 items-top">
        <img :src="props.user?.profileImage" alt="" class="inline-block w-10 h-10 rounded-full">
      </div>

    </div>
  </div>

</template>

<script setup>

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

</script>