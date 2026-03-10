<script setup>
import { reactive } from "vue";

const emit = defineEmits(["submit"]);

const form = reactive({
  clientName: "",
  phone: "",
  address: "",
  problemText: "",
});

function onSubmit() {
  emit("submit", { ...form });

  form.clientName = "";
  form.phone = "";
  form.address = "";
  form.problemText = "";
}
</script>

<template>
  <form class="card form-grid" @submit.prevent="onSubmit">
    <label>
      <span>Имя клиента</span>
      <input v-model.trim="form.clientName" type="text" required />
    </label>

    <label>
      <span>Телефон</span>
      <input v-model.trim="form.phone" type="text" required />
    </label>

    <label class="full-width">
      <span>Адрес</span>
      <input v-model.trim="form.address" type="text" required />
    </label>

    <label class="full-width">
      <span>Описание проблемы</span>
      <textarea v-model.trim="form.problemText" rows="5" required />
    </label>

    <div class="full-width">
      <button class="primary-button" type="submit">Создать заявку</button>
    </div>
  </form>
</template>
