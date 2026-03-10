<script setup>
import { onMounted } from "vue";
import AppHeader from "../components/AppHeader.vue";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "../stores/auth";
import { useRequestsStore } from "../stores/requests";

const auth = useAuthStore();
const requestsStore = useRequestsStore();

async function loadData() {
  await requestsStore.fetchMyRequests(auth.user.id);
}

onMounted(loadData);

async function take(id) {
  await requestsStore.takeRequest(id, auth.user.id);
  await loadData();
}

async function complete(id) {
  await requestsStore.completeRequest(id, auth.user.id);
  await loadData();
}
</script>

<template>
  <main class="page">
    <AppHeader />

    <section class="page-section">
      <div class="section-head">
        <h2>Панель мастера</h2>
        <p class="muted">Только заявки, назначенные текущему мастеру.</p>
      </div>

      <p v-if="requestsStore.error" class="error-text">
        {{ requestsStore.error }}
      </p>
      <p v-if="requestsStore.success" class="success-text">
        {{ requestsStore.success }}
      </p>

      <div class="grid-list">
        <article
          v-for="item in requestsStore.requests"
          :key="item.id"
          class="card request-card"
        >
          <div class="row-between gap-12">
            <h3>Заявка #{{ item.id }}</h3>
            <StatusBadge :status="item.status" />
          </div>

          <dl class="request-meta">
            <div>
              <dt>Клиент</dt>
              <dd>{{ item.clientName }}</dd>
            </div>

            <div>
              <dt>Телефон</dt>
              <dd>{{ item.phone }}</dd>
            </div>

            <div class="full-width">
              <dt>Адрес</dt>
              <dd>{{ item.address }}</dd>
            </div>

            <div class="full-width">
              <dt>Проблема</dt>
              <dd>{{ item.problemText }}</dd>
            </div>
          </dl>

          <div class="card-actions">
            <button
              v-if="item.status === 'assigned'"
              class="primary-button"
              @click="take(item.id)"
            >
              Взять в работу
            </button>

            <button
              v-if="item.status === 'in_progress'"
              class="primary-button"
              @click="complete(item.id)"
            >
              Завершить
            </button>

            <span v-if="item.status === 'done'" class="success-text">
              Работа завершена
            </span>
          </div>
        </article>

        <div v-if="!requestsStore.requests.length" class="card empty-state">
          У текущего мастера пока нет заявок.
        </div>
      </div>
    </section>
  </main>
</template>
