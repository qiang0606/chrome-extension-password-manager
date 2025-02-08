<template>
  <div class="environment-list">
    <div v-for="env in environments" :key="env.id" class="environment">
      <h4>{{ env.name }}</h4>
      <div class="url">URL: {{ env.url }}</div>

      <account-list
        :accounts="env.accounts"
        @copy-username="copyUsername"
        @copy-password="copyPassword"
        @auto-fill="autoFill"
      />

      <el-button type="primary" size="small" @click="$emit('add-account', env)">
        添加账号
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import AccountList from "./AccountList.vue";

const props = defineProps({
  environments: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["add-account"]);

const copyUsername = (username) => {
  navigator.clipboard.writeText(username);
  ElMessage.success("用户名已复制");
};

const copyPassword = (password) => {
  navigator.clipboard.writeText(password);
  ElMessage.success("密码已复制");
};

const autoFill = async (account) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    type: "AUTO_FILL",
    data: {
      username: account.username,
      password: account.password,
    },
  });
};
</script>

<style scoped>
.environment-list {
  width: 100%;
  height: 100%;
}
.environment {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.url {
  color: #666;
  margin: 5px 0;
}
</style>
