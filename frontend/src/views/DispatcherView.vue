<script setup>
import { computed, onMounted, ref, watch } from "vue";
import AppHeader from "../components/AppHeader.vue";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "../stores/auth";
import { useRequestsStore } from "../stores/requests";

const auth = useAuthStore();
const requestsStore = useRequestsStore();

const selectedStatus = ref("all");
const selectedMasters = ref({});

const masters = computed(() => {
  return auth.users.filter((user) => user.role === "master");
});

async function loadData() {
  if (!auth.users.length) {
    await auth.fetchUsers();
  }

  await requestsStore.fetchRequests(selectedStatus.value);
}

onMounted(loadData);
watch(selectedStatus, loadData);

async function assign(requestId) {
  const masterId = Number(selectedMasters.value[requestId]);

  if (!masterId) {
    return;
  }

  await requestsStore.assignRequest(requestId, masterId, auth.user.id);
  await loadData();
}

async function cancel(requestId) {
  await requestsStore.cancelRequest(requestId, auth.user.id);
  await loadData();
}
</script>

<template>
  <main class="page">
    <AppHeader />

    <section class="page-section">
      <div class="section-head row-between">
        <div>
          <h2>Панель диспетчера</h2>
          <p class="muted">Фильтр, назначение мастера и отмена заявки.</p>
        </div>

        <label class="filter-box">
          <span>Фильтр по статусу</span>
          <select v-model="selectedStatus">
            <option value="all">Все</option>
            <option value="new">new</option>
            <option value="assigned">assigned</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
            <option value="canceled">canceled</option>
          </select>
        </label>
      </div>

      <p v-if="requestsStore.error" class="error-text">
        {{ requestsStore.error }}
      </p>
      <p v-if="requestsStore.success" class="success-text">
        {{ requestsStore.success }}
      </p>

      <div class="card table-wrap">
        <table class="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Адрес</th>
              <th>Проблема</th>
              <th>Статус</th>
              <th>Мастер</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="!requestsStore.requests.length">
              <td colspan="8" class="empty-cell">Заявок нет</td>
            </tr>

            <tr v-for="item in requestsStore.requests" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>{{ item.clientName }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.address }}</td>
              <td class="problem-col">{{ item.problemText }}</td>
              <td>
                <StatusBadge :status="item.status" />
              </td>
              <td>{{ item.assignedTo?.name || "—" }}</td>
              <td>
                <div class="action-stack">
                  <template v-if="item.status === 'new'">
                    <select v-model="selectedMasters[item.id]">
                      <option value="">Выберите мастера</option>
                      <option
                        v-for="master in masters"
                        :key="master.id"
                        :value="master.id"
                      >
                        {{ master.name }}
                      </option>
                    </select>

                    <button
                      class="primary-button small"
                      @click="assign(item.id)"
                    >
                      Назначить
                    </button>

                    <button
                      class="danger-button small"
                      @click="cancel(item.id)"
                    >
                      Отменить
                    </button>
                  </template>

                  <template v-else-if="item.status === 'assigned'">
                    <button
                      class="danger-button small"
                      @click="cancel(item.id)"
                    >
                      Отменить
                    </button>
                  </template>

                  <span v-else class="muted">Нет действий</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
