<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <header class="app-header">
    <div>
      <h1 class="app-title">Ремонтная служба</h1>
      <p v-if="auth.user" class="muted">
        Пользователь: <strong>{{ auth.user.name }}</strong>
      </p>
    </div>

    <div class="header-actions">
      <RouterLink v-if="auth.user" to="/create" class="ghost-button">
        Создать заявку
      </RouterLink>
      <button v-if="auth.user" class="ghost-button" @click="logout">
        Выйти
      </button>
    </div>
  </header>
</template>
