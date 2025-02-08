<template>
  <div class="account-list">
    <div v-for="account in accounts" :key="account.id" class="account-item">
      <span class="username">用户名: {{ account.username }}</span>
      <div class="operations">
        <el-button
          type="primary"
          size="small"
          @click="$emit('copy-username', account.username)"
        >
          复制用户名
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="$emit('copy-password', account.password)"
        >
          复制密码
        </el-button>
        <el-button
          type="success"
          size="small"
          @click="$emit('auto-fill', account)"
        >
          自动填充
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["copy-username", "copy-password", "auto-fill"]);
</script>

<style scoped>
.account-list {
  width: 100%;
  height: 100%;
}
.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.username {
  font-weight: bold;
}

.operations {
  display: flex;
  gap: 10px;
}
</style>
