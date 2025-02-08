<template>
  <el-container>
    <el-header>Website & Account Manager</el-header>
    <el-main>
      <el-form :model="newWebsite" label-width="120px">
        <el-form-item label="网站名字">
          <el-input v-model="newWebsite.webName"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addWebsite">添加网站</el-button>
      </el-form>
      <el-table :data="websites" style="width: 100%; margin-top: 20px">
        <el-table-column prop="webName" label="网站名字">
          <template #default="{ row }">
            <el-button @click="showDetails(row)" link type="primary">{{
              row.webName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button @click="removeWebsite(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="dialogVisible"
        title="网站详情"
        :width="600"
        :close-on-click-modal="false"
      >
        <el-button type="primary" @click="addAccount">新增</el-button>
        <el-table :data="selectedWebsiteDetails" style="width: 100%">
          <el-table-column prop="environment" label="环境"></el-table-column>
          <el-table-column prop="url" width="200" label="URL">
            <template #default="{ row }">
              <el-button @click="openUrl(row.url)" link type="primary">{{
                row.url
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号">
            <template #default="{ row }">
              <el-button @click="copyToClipboard(row.account)" link>
                {{ row.account }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码">
            <template #default="{ row }">
              <el-button @click="copyToClipboard(row.password)" link>
                {{ row.password }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template #default="{ row }">
              <el-button @click="editAccount(row)" link type="primary"
                >修改</el-button
              >
              <el-button @click="removeAccount(row)" link type="primary"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        v-model="addAccountDialog"
        :title="`${newAccount.accountId ? '修改' : '新增'}用户环境`"
        :width="600"
        :close-on-click-modal="false"
      >
        <el-form
          :model="newAccount"
          ref="newAccountFormRef"
          label-width="120px"
          :rules="newAccountRules"
        >
          <el-form-item label="环境" required prop="environment">
            <el-input v-model="newAccount.environment"></el-input>
          </el-form-item>
          <el-form-item label="URL" required prop="url">
            <el-input v-model="newAccount.url"></el-input>
          </el-form-item>
          <el-form-item label="账号" required prop="account">
            <el-input v-model="newAccount.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" required prop="password">
            <el-input v-model="newAccount.password"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="addAccountDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleNewAccountDialog">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { v4 as uuidv4 } from "uuid";
export default {
  setup() {
    const websites = ref([]);
    const newAccountFormRef = ref(null);
    const newWebsite = reactive({
      webName: "",
      environment: "",
      url: "",
      account: "",
      password: "",
    });
    const currentWebName = ref("");
    const dialogVisible = ref(false);
    const addAccountDialog = ref(false);
    const newAccount = ref({
      environment: "",
      url: "",
      account: "",
      password: "",
    });
    const newAccountRules = ref({
      environment: [{ required: true, message: "请输入环境", trigger: "blur" }],
      url: [{ required: true, message: "请输入URL", trigger: "blur" }],
      account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    const selectedWebsiteDetails = ref([]);

    const dbName = "MyDatabase"; // 数据库名称
    const storeName = "websites"; // 存储对象表
    let db = null;

    // **初始化 IndexedDB**
    const openDatabase = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        // **数据库升级（创建表）**
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        };

        request.onsuccess = (event) => {
          db = event.target.result;
          resolve(db);
        };

        request.onerror = (event) => {
          console.error("IndexedDB 打开失败", event.target.error);
          reject(event.target.error);
        };
      });
    };

    // **获取所有数据**
    const getAllWebsites = async () => {
      if (!db) await openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    };

    const addWebsite = async () => {
      if (!newWebsite.webName) {
        ElMessage.error("请输入网站名字");
        return;
      }
      const existingWebsite = websites.value.find(
        (w) => w.webName === newWebsite.webName
      );
      if (existingWebsite) {
        ElMessage.error("网站重复添加，请重新输入");
        return;
      }

      try {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        await store.add({
          webName: newWebsite.webName,
          details: [],
        });

        websites.value = await getAllWebsites();
        newWebsite.webName = "";
        ElMessage.success("网站添加成功");
      } catch (error) {
        console.error("添加网站失败:", error);
        ElMessage.error("添加网站失败");
      }
    };

    const removeWebsite = async (website) => {
      try {
        await ElMessageBox.confirm("确认删除?", "Warning", {
          confirmButtonText: "是",
          cancelButtonText: "否",
        });

        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        await store.delete(website.id);
        websites.value = await getAllWebsites();
        ElMessage.success("网站删除成功");
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除网站失败:", error);
          ElMessage.error("删除网站失败");
        }
      }
    };

    const showDetails = (website) => {
      selectedWebsiteDetails.value = website.details;
      currentWebName.value = website.webName;
      dialogVisible.value = true;
    };

    const addAccount = () => {
      newAccount.value = {};
      addAccountDialog.value = true;
      nextTick(() => {
        newAccountFormRef.value.clearValidate();
      });
    };

    const getWebsiteByName = (webName) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const indexRequest = store.getAll();

        indexRequest.onsuccess = () => {
          const website = indexRequest.result.find(
            (w) => w.webName === webName
          );
          resolve(website || null);
        };

        indexRequest.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    const performDatabaseOperation = (data) => {
      return new Promise((resolve, reject) => {
        // 打开数据库
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
          const db = event.target.result;

          // 创建一个事务并执行操作
          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);
          // 执行put操作
          const putRequest = store.put(data);

          putRequest.onsuccess = function () {
            console.log("数据插入成功");
            resolve(true);
          };

          putRequest.onerror = function (e) {
            console.error("插入数据失败:", e.target.error);
          };

          // 事务结束后关闭数据库
          transaction.oncomplete = function () {
            db.close();
          };
        };

        request.onerror = function (event) {
          console.error("打开数据库失败:", event.target.error);
          reject(event.target.error);
        };
      });
    };

    const handleNewAccountDialog = async () => {
      newAccountFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const website = await getWebsiteByName(currentWebName.value);
            if (newAccount.value.accountId) {
              // 修改账号
              const accountIndex = website.details.findIndex(
                (a) => a.accountId === newAccount.value.accountId
              );
              if (accountIndex !== -1) {
                website.details[accountIndex] = { ...newAccount.value };
              }
            } else {
              // 添加新账号
              website.details.push({
                ...newAccount.value,
                accountId: uuidv4() + Date.now(),
              });
            }

            await performDatabaseOperation(website);
            websites.value = await getAllWebsites();
            selectedWebsiteDetails.value = website.details;
            ElMessage.success(
              newAccount.value.accountId ? "账号修改成功" : "账号添加成功"
            );
            addAccountDialog.value = false;
          } catch (error) {
            console.error("操作账号失败:", error);
            ElMessage.error("操作失败");
          }
        }
      });
    };

    const editAccount = (account) => {
      addAccountDialog.value = true;
      newAccount.value = { ...account };
      nextTick(() => {
        newAccountFormRef.value.clearValidate();
      });
    };

    const openUrl = (userInput) => {
      // 将链接添加到 DOM 中（可选）
      const url = userInput.startsWith("http")
        ? userInput
        : `https://${userInput}`;
      window.open(url, "_blank");
    };

    const removeAccount = async (account) => {
      try {
        await ElMessageBox.confirm("确认删除账号?", "Warning", {
          confirmButtonText: "是",
          cancelButtonText: "否",
        });

        const website = await getWebsiteByName(currentWebName.value);

        website.details = website.details.filter(
          (a) => a.accountId !== account.accountId
        );

        await performDatabaseOperation(website);
        websites.value = await getAllWebsites();
        selectedWebsiteDetails.value = website.details;
        ElMessage.success("账号删除成功");
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除账号失败:", error);
          ElMessage.error("删除账号失败");
        }
      }
    };

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        ElMessage.success("复制成功");
      } catch (err) {
        console.error("复制失败:", err);
        ElMessage.error("复制失败");
      }
    };

    onMounted(async () => {
      await openDatabase();
      websites.value = await getAllWebsites();
    });

    return {
      websites,
      newWebsite,
      addWebsite,
      removeWebsite,
      dialogVisible,
      addAccountDialog,
      selectedWebsiteDetails,
      showDetails,
      addAccount,
      handleNewAccountDialog,
      newAccountFormRef,
      editAccount,
      openUrl,
      removeAccount,
      currentWebName,
      newAccount,
      newAccountRules,
      copyToClipboard,
    };
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
