<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
});

const labels = {
  new: "Новая",
  assigned: "Назначена",
  in_progress: "В работе",
  done: "Завершена",
  canceled: "Отменена",
};
</script>

<template>
  <span class="status-badge" :class="`status-${status}`">
    {{ labels[status] || status }}
  </span>
</template>
