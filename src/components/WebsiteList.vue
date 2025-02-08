<template>
  <div class="website-list">
    <el-button type="primary" @click="showAddDialog">添加网站</el-button>

    <el-card v-for="site in websites" :key="site.id" class="website-card">
      <template #header>
        <div class="card-header">
          <span>{{ site.name }}</span>
          <div class="operations">
            <el-button type="primary" size="small" @click="editWebsite(site)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteWebsite(site.id)"
              >删除</el-button
            >
          </div>
        </div>
      </template>

      <environment-list
        :environments="site.environments"
        @add-account="showAddAccountDialog(site, $event)"
      />
    </el-card>

    <!-- 添加/编辑网站对话框 -->
    <el-dialog
      v-model="websiteDialog.visible"
      :title="websiteDialog.type === 'add' ? '添加网站' : '编辑网站'"
      :width="600"
    >
      <el-form :model="websiteDialog.form" label-width="100px">
        <el-form-item label="网站名称" required>
          <el-input v-model="websiteDialog.form.name" />
        </el-form-item>
        <el-form-item label="环境配置">
          <div
            v-for="(env, index) in websiteDialog.form.environments"
            :key="index"
            class="env-item"
          >
            <el-input v-model="env.name" placeholder="环境名称" />
            <el-input v-model="env.url" placeholder="环境URL" />
            <el-button type="danger" @click="removeEnvironment(index)"
              >删除</el-button
            >
          </div>
          <el-button type="primary" @click="addEnvironment">添加环境</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="websiteDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveWebsite">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import EnvironmentList from "./EnvironmentList.vue";

const websites = ref([]);
const websiteDialog = ref({
  visible: false,
  type: "add",
  form: {
    name: "",
    environments: [],
  },
});

// 从 Chrome 存储加载数据
const loadWebsites = async () => {
  const result = await chrome.storage.sync.get("websites");
  websites.value = result.websites || [];
};

onMounted(loadWebsites);

// 保存数据到 Chrome 存储
const saveToStorage = async () => {
  await chrome.storage.sync.set({ websites: websites.value });
};

const showAddDialog = () => {
  websiteDialog.value = {
    visible: true,
    type: "add",
    form: {
      name: "",
      environments: [],
    },
  };
};

const editWebsite = (site) => {
  websiteDialog.value = {
    visible: true,
    type: "edit",
    form: JSON.parse(JSON.stringify(site)),
  };
};

const deleteWebsite = async (id) => {
  websites.value = websites.value.filter((site) => site.id !== id);
  await saveToStorage();
  ElMessage.success("删除成功");
};

const addEnvironment = () => {
  websiteDialog.value.form.environments.push({
    name: "",
    url: "",
    accounts: [],
  });
};

const removeEnvironment = (index) => {
  websiteDialog.value.form.environments.splice(index, 1);
};

const saveWebsite = async () => {
  if (!websiteDialog.value.form.name) {
    return ElMessage.warning("请输入网站名称");
  }

  if (websiteDialog.value.type === "add") {
    websites.value.push({
      id: Date.now(),
      ...websiteDialog.value.form,
    });
  } else {
    const index = websites.value.findIndex(
      (site) => site.id === websiteDialog.value.form.id
    );
    if (index !== -1) {
      websites.value[index] = { ...websiteDialog.value.form };
    }
  }

  await saveToStorage();
  websiteDialog.value.visible = false;
  ElMessage.success("保存成功");
};
</script>

<style scoped>
.website-list {
  width: 100%;
  min-width: 760px; /* 考虑到padding的宽度 */
}

.website-card {
  margin: 20px 0;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operations {
  display: flex;
  gap: 10px;
}

.env-item {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}
</style>
