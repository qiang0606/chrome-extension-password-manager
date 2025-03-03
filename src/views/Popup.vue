<template>
  <div class="popup-container">
    <header class="popup-header">
      <h1>Website & Account Manager</h1>
    </header>

    <main class="popup-main">
      <div class="add-website-form">
        <el-form :model="newWebsite" label-width="120px">
          <el-form-item label="网站名字">
            <el-input v-model="newWebsite.webName"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addWebsite" class="add-btn"
            >添加网站</el-button
          >
        </el-form>
      </div>

      <div class="website-list">
        <el-table :data="websites" style="width: 100%">
          <el-table-column prop="webName" label="网站名字">
            <template #default="{ row }">
              <el-button
                @click="showDetails(row)"
                link
                type="primary"
                class="website-link"
              >
                {{ row.webName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                @click="removeWebsite(row)"
                link
                type="danger"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        v-model="dialogVisible"
        title="网站详情"
        :width="800"
        :close-on-click-modal="false"
        class="details-dialog"
      >
        <el-button type="primary" @click="addAccount" class="add-account-btn"
          >新增账号</el-button
        >
        <el-table
          :data="selectedWebsiteDetails"
          style="width: 100%; margin-top: 16px"
        >
          <el-table-column
            prop="environment"
            label="环境"
            width="100"
          ></el-table-column>
          <el-table-column prop="url" width="180" label="URL">
            <template #default="{ row }">
              <el-button
                @click="openUrl(row.url)"
                link
                type="primary"
                class="url-link"
              >
                {{ row.url }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号" width="150">
            <template #default="{ row }">
              <el-button
                @click="copyToClipboard(row.account)"
                link
                class="copy-btn"
              >
                {{ row.account }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码" width="150">
            <template #default="{ row }">
              <el-button
                @click="copyToClipboard(row.password)"
                link
                class="copy-btn"
              >
                {{ row.password }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template #default="{ row }">
              <div class="action-buttons-row">
                <el-link
                  :underline="false"
                  @click="editAccount(row)"
                  type="primary"
                  >修改</el-link
                >
                <el-link
                  :underline="false"
                  @click="removeAccount(row)"
                  type="danger"
                  >删除</el-link
                >
                <el-link
                  :underline="false"
                  @click="copyAccountRow(row)"
                  type="success"
                  >复制</el-link
                >
              </div>
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
    </main>
  </div>
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

        request.onerror = (event) => {
          console.error("数据库打开失败:", event);
          reject("数据库打开失败");
        };

        request.onsuccess = (event) => {
          db = event.target.result;
          console.log("数据库打开成功");
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
            console.log("数据库表创建成功");
          }
        };
      });
    };

    // 创建内存数据库（用于模拟）
    const createMemoryDB = () => {
      let data = [];
      return {
        memoryDB: true,
        transaction: () => {
          return {
            objectStore: () => {
              return {
                add: (item) => {
                  data.push(item);
                  return {
                    onsuccess: () => {},
                  };
                },
                put: (item) => {
                  const index = data.findIndex((i) => i.id === item.id);
                  if (index !== -1) {
                    data[index] = item;
                  }
                  return {
                    onsuccess: () => {},
                  };
                },
                delete: (id) => {
                  data = data.filter((item) => item.id !== id);
                  return {
                    onsuccess: () => {},
                  };
                },
                get: (id) => {
                  const item = data.find((item) => item.id === id);
                  return {
                    result: item,
                    onsuccess: () => {},
                  };
                },
                getAll: () => {
                  return {
                    result: data,
                    onsuccess: () => {},
                  };
                },
              };
            },
          };
        },
      };
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

    const copyAccountRow = (row) => {
      const text = `环境: ${row.environment}
URL: ${row.url}
账号: ${row.account}
密码: ${row.password}`;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          ElMessage.success("账号信息已复制到剪贴板");
        })
        .catch((err) => {
          console.error("复制失败:", err);
          ElMessage.error("复制失败，请手动复制");
        });
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
      copyAccountRow,
    };
  },
};
</script>

<style>
.popup-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  background-color: #409eff;
  color: white;
  padding: 16px;
  text-align: center;
}

.popup-header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.popup-main {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.add-website-form {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}

.add-btn {
  width: 100%;
  margin-top: 8px;
}

.website-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 确保表格占满剩余空间并且内容过多时出现滚动条 */
.website-list .el-table {
  flex: 1;
  overflow: auto;
}

/* 隐藏表格外部的滚动条，只保留表格内部的滚动条 */
.website-list .el-table__body-wrapper {
  overflow-y: auto;
  max-height: calc(100% - 40px); /* 减去表头高度 */
}

.website-link {
  font-weight: 500;
}

.details-dialog .el-dialog__header {
  background-color: #f5f7fa;
  padding: 16px 20px;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

.details-dialog .el-dialog__body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.add-account-btn {
  margin-bottom: 16px;
}

.url-link,
.copy-btn {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  display: inline-block;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-buttons-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  justify-content: space-between;
  width: 100%;
}

.action-buttons-row .el-button {
  padding: 6px 8px;
  font-size: 12px;
  min-width: 50px;
}

/* 表格样式 */
.el-table {
  --el-table-border-color: #ebeef5;
  --el-table-header-background-color: #f5f7fa;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.el-table td {
  padding: 12px 0;
}

/* 按钮样式 */
.el-button--primary {
  background-color: #409eff;
}

.el-button--danger {
  background-color: #f56c6c;
  color: white;
}

.el-button--success {
  background-color: #67c23a;
  color: white;
}

/* 确保对话框内的表格有合适的宽度 */
.details-dialog .el-table {
  width: 100% !important;
}

/* 确保操作按钮在小屏幕上也能正常显示 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons .el-button {
    margin-bottom: 4px;
  }
}
</style>
