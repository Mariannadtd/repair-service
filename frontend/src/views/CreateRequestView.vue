<script setup>
import AppHeader from "../components/AppHeader.vue";
import RequestForm from "../components/RequestForm.vue";
import { useRequestsStore } from "../stores/requests";

const requestsStore = useRequestsStore();

async function handleSubmit(payload) {
  await requestsStore.createRequest(payload);
}
</script>

<template>
  <main class="page">
    <AppHeader />

    <section class="page-section">
      <div class="section-head">
        <h2>Создание заявки</h2>
        <p class="muted">
          После создания заявка автоматически получает статус
          <strong>new</strong>.
        </p>
      </div>

      <p v-if="requestsStore.error" class="error-text">
        {{ requestsStore.error }}
      </p>

      <p v-if="requestsStore.success" class="success-text">
        {{ requestsStore.success }}
      </p>

      <RequestForm @submit="handleSubmit" />
    </section>
  </main>
</template>
