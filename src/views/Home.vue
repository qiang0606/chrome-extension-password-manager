<template>
  <div class="home">
    <h1>Password Manager</h1>
    <el-button type="primary" @click="addWebsite">Add Website</el-button>
    <WebsiteList :websites="websites" @select-website="selectWebsite" />
    <EnvironmentList
      v-if="selectedWebsite"
      :environments="selectedWebsite.environments"
      @select-environment="selectEnvironment"
    />
    <AccountList
      v-if="selectedEnvironment"
      :accounts="selectedEnvironment.accounts"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import WebsiteList from "../components/WebsiteList.vue";
import EnvironmentList from "../components/EnvironmentList.vue";
import AccountList from "../components/AccountList.vue";

const websites = ref([]);
const selectedWebsite = ref(null);
const selectedEnvironment = ref(null);

const addWebsite = () => {
  // 添加网站的逻辑
};

const selectWebsite = (website) => {
  selectedWebsite.value = website;
  selectedEnvironment.value = null;
};

const selectEnvironment = (environment) => {
  selectedEnvironment.value = environment;
};
</script>

<style scoped>
.home {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
