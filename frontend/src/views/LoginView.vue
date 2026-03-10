<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (!auth.users.length) {
    await auth.fetchUsers();
  }
});

function selectUser(user) {
  auth.login(user);
  router.push(user.role === "dispatcher" ? "/dispatcher" : "/master");
}
</script>

<template>
  <main class="page auth-page">
    <section class="card narrow-card">
      <h2>Авторизация</h2>
      <p class="muted">Выберите пользователя из списка</p>

      <p v-if="auth.loading">Загрузка...</p>
      <p v-else-if="auth.error" class="error-text">{{ auth.error }}</p>

      <div v-else class="user-list">
        <button
          v-for="user in auth.users"
          :key="user.id"
          class="user-card"
          @click="selectUser(user)"
        >
          <strong>{{ user.name }}</strong>
          <span>{{ user.role === "dispatcher" ? "Диспетчер" : "Мастер" }}</span>
        </button>
      </div>
    </section>
  </main>
</template>
