<template>
  <div class="popup-container">
    <header class="popup-header">
      <h1>Website & Account Manager</h1>
    </header>

    <main class="popup-main-flex">
      <!-- 左侧功能区 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">添加网站</h3>
          <div class="add-website-form">
            <el-input
              v-model="newWebsite.webName"
              placeholder="输入网站名称"
              class="sidebar-input"
            ></el-input>
            <el-button type="primary" @click="addWebsite" class="sidebar-btn"
              >添加网站</el-button
            >
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">数据管理</h3>
          <div class="sidebar-buttons">
            <el-dropdown
              @command="handleExport"
              trigger="click"
              class="sidebar-dropdown"
            >
              <el-button type="success" class="sidebar-btn">
                导出数据 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="json">JSON 格式</el-dropdown-item>
                  <el-dropdown-item command="excel"
                    >Excel 格式</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-dropdown
              @command="handleImport"
              trigger="click"
              class="sidebar-dropdown"
            >
              <el-button type="warning" class="sidebar-btn">
                导入数据 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="json">JSON 格式</el-dropdown-item>
                  <el-dropdown-item command="excel"
                    >Excel 格式</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 右侧表格区域 -->
      <div class="main-content">
        <div class="website-list">
          <el-table :data="websites" style="width: 100%; height: 100%">
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
                <el-dropdown
                  @command="(cmd) => handleCopy(cmd, row)"
                  trigger="click"
                >
                  <el-link :underline="false" type="success">复制</el-link>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="all"
                        >复制全部信息</el-dropdown-item
                      >
                      <el-dropdown-item command="account"
                        >仅复制账号</el-dropdown-item
                      >
                      <el-dropdown-item command="password"
                        >仅复制密码</el-dropdown-item
                      >
                      <el-dropdown-item command="url"
                        >仅复制URL</el-dropdown-item
                      >
                      <el-dropdown-item command="duplicate"
                        >复制为新行</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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

      <el-dialog
        v-model="importDataDialog"
        :title="`导入${importFormat === 'json' ? 'JSON' : 'Excel'} 数据`"
        width="500"
        :close-on-click-modal="false"
        @closed="handleImportDialogClosed"
      >
        <div class="import-dialog-content">
          <template v-if="importFormat === 'json'">
            <p class="import-tip">请粘贴之前导出的JSON数据：</p>
            <el-input
              v-model="importDataText"
              type="textarea"
              :rows="10"
              placeholder="粘贴JSON数据到这里"
            ></el-input>
          </template>
          <template v-else>
            <p class="import-tip">请选择Excel文件：</p>
            <el-upload
              class="excel-uploader"
              action="#"
              :auto-upload="false"
              :on-change="handleExcelUpload"
              :limit="1"
              accept=".xlsx,.xls"
              ref="excelUploadRef"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
              </template>
            </el-upload>
            <div v-if="excelFileName" class="selected-file">
              已选择: {{ excelFileName }}
            </div>
          </template>
          <div class="import-options">
            <el-checkbox v-model="importOverwrite">覆盖现有数据</el-checkbox>
            <el-tooltip
              content="选中将清空现有数据后导入，不选中则合并数据"
              placement="top"
            >
              <el-icon class="info-icon"><el-icon-info-filled /></el-icon>
            </el-tooltip>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="importDataDialog = false">取消</el-button>
            <el-button type="primary" @click="importData">导入</el-button>
          </div>
        </template>
      </el-dialog>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { v4 as uuidv4 } from "uuid";
import { InfoFilled as ElIconInfoFilled } from "@element-plus/icons-vue";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export default {
  components: {
    ElIconInfoFilled,
  },
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
    const importDataDialog = ref(false);
    const importDataText = ref("");
    const importOverwrite = ref(false);
    const importFormat = ref("json");
    const excelFileName = ref("");
    const excelFileData = ref(null);
    const excelUploadRef = ref(null);
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
    const getAllWebsites = () => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);
          const request = store.getAll();

          request.onsuccess = (event) => {
            const websites = event.target.result;
            // 确保每个网站对象都有 ID
            websites.forEach((website) => {
              if (!website.id) {
                website.id = uuidv4();
              }
            });
            resolve(websites);
          };

          request.onerror = (event) => {
            console.error("获取所有网站失败:", event);
            reject("获取所有网站失败");
          };
        } catch (error) {
          console.error("获取所有网站失败:", error);
          if (db && db.memoryDB) {
            // 使用内存数据库
            const transaction = db.transaction();
            const store = transaction.objectStore();
            const request = store.getAll();
            request.onsuccess();
            resolve(request.result);
          } else {
            reject("获取所有网站失败");
          }
        }
      });
    };

    const addWebsite = async () => {
      if (!newWebsite.webName) {
        ElMessage.error("请输入网站名称");
        return;
      }

      try {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const websiteObj = {
          id: uuidv4(),
          webName: newWebsite.webName,
          details: [],
        };
        await store.add(websiteObj);

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

    // 复制账号信息到剪贴板
    const copyToClipboard = (text) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          ElMessage.success("复制成功");
        })
        .catch((err) => {
          console.error("复制失败:", err);
          ElMessage.error("复制失败，请手动复制");
        });
    };

    // 复制整行账号信息
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

    // 处理不同的复制命令
    const handleCopy = (command, row) => {
      let text = "";
      let successMessage = "";

      switch (command) {
        case "all":
          text = `环境: ${row.environment}\nURL: ${row.url}\n账号: ${row.account}\n密码: ${row.password}`;
          successMessage = "全部账号信息已复制到剪贴板";
          break;
        case "account":
          text = row.account;
          successMessage = "账号已复制到剪贴板";
          break;
        case "password":
          text = row.password;
          successMessage = "密码已复制到剪贴板";
          break;
        case "url":
          text = row.url;
          successMessage = "URL已复制到剪贴板";
          break;
        case "duplicate":
          // 复制为新行
          duplicateAccount(row);
          return; // 不需要执行后面的复制到剪贴板操作
        default:
          text = `环境: ${row.environment}\nURL: ${row.url}\n账号: ${row.account}\n密码: ${row.password}`;
          successMessage = "账号信息已复制到剪贴板";
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          ElMessage.success(successMessage);
        })
        .catch((err) => {
          console.error("复制失败:", err);
          ElMessage.error("复制失败，请手动复制");
        });
    };

    // 复制账号为新行
    const duplicateAccount = (row) => {
      // 打开新增账号对话框
      addAccountDialog.value = true;

      // 复制账号信息，但不复制ID
      newAccount.value = {
        accountId: "", // 新账号，没有ID
        environment: `${row.environment} (复制)`, // 添加标记以区分
        url: row.url,
        account: row.account,
        password: row.password,
      };

      // 提示用户
      ElMessage.success("已复制账号信息，请修改后保存");
    };

    // 处理导出选择
    const handleExport = (command) => {
      if (command === "json") {
        exportJsonData();
      } else if (command === "excel") {
        exportExcelData();
      }
    };

    // 清空导入文件
    const clearImportFile = () => {
      excelFileName.value = "";
      excelFileData.value = null;
      importDataText.value = "";

      // 清空文件上传组件
      if (excelUploadRef.value) {
        excelUploadRef.value.clearFiles();
      }
    };

    // 处理导入对话框关闭
    const handleImportDialogClosed = () => {
      clearImportFile();
    };

    // 处理导入选择
    const handleImport = (command) => {
      importFormat.value = command;
      importDataDialog.value = true;
      clearImportFile();
    };

    // 处理Excel文件上传
    const handleExcelUpload = (file) => {
      excelFileName.value = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          excelFileData.value = data;
        } catch (error) {
          console.error("读取Excel文件失败:", error);
          ElMessage.error("读取Excel文件失败");
        }
      };
      reader.readAsArrayBuffer(file.raw);
    };

    // 导出数据为JSON
    const exportJsonData = async () => {
      try {
        const allData = await getAllWebsites();

        // 创建一个包含元数据的导出对象
        const exportObj = {
          version: "1.0",
          timestamp: new Date().toISOString(),
          data: allData,
        };

        // 转换为JSON字符串
        const jsonStr = JSON.stringify(exportObj, null, 2);

        // 创建Blob对象
        const blob = new Blob([jsonStr], { type: "application/json" });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // 使用dayjs格式化日期为年月日时分秒
        const formattedDate = dayjs().format("YYYY-MM-DD-HH-mm-ss");

        a.download = `indexDB-${formattedDate}.json`;
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);

        ElMessage.success("数据导出成功");
      } catch (error) {
        console.error("导出数据失败:", error);
        ElMessage.error("导出数据失败");
      }
    };

    // 导出数据为Excel
    const exportExcelData = async () => {
      try {
        const allData = await getAllWebsites();

        // 准备Excel工作表数据
        const worksheetData = [];

        // 添加表头
        worksheetData.push(["网站名称", "环境", "URL", "账号", "密码"]);

        // 添加数据行
        allData.forEach((website) => {
          if (website.details && website.details.length > 0) {
            website.details.forEach((detail) => {
              worksheetData.push([
                website.webName,
                detail.environment,
                detail.url,
                detail.account,
                detail.password,
              ]);
            });
          } else {
            // 如果没有详情，只添加网站名称
            worksheetData.push([website.webName, "", "", "", ""]);
          }
        });

        // 创建工作簿和工作表
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        // 设置列宽
        const colWidths = [
          { wch: 20 }, // 网站名称
          { wch: 15 }, // 环境
          { wch: 30 }, // URL
          { wch: 20 }, // 账号
          { wch: 20 }, // 密码
        ];
        ws["!cols"] = colWidths;

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, "网站账号");

        // 格式化日期
        const formattedDate = dayjs().format("YYYY-MM-DD-HH-mm-ss");

        // 导出Excel文件
        XLSX.writeFile(wb, `indexDB-${formattedDate}.xlsx`);

        ElMessage.success("Excel数据导出成功");
      } catch (error) {
        console.error("导出Excel数据失败:", error);
        ElMessage.error("导出Excel数据失败");
      }
    };

    // 导入数据
    const importData = async () => {
      try {
        if (importFormat.value === "json") {
          if (!importDataText.value.trim()) {
            ElMessage.warning("请先粘贴要导入的数据");
            return;
          }

          // 解析JSON
          let importObj;
          try {
            importObj = JSON.parse(importDataText.value);
          } catch (e) {
            ElMessage.error("无效的JSON数据格式");
            return;
          }

          // 验证数据格式
          if (!importObj.data || !Array.isArray(importObj.data)) {
            ElMessage.error("导入数据格式不正确");
            return;
          }

          // 确认导入
          await ElMessageBox.confirm(
            `确定要导入${importObj.data.length}条网站数据吗？${
              importOverwrite.value ? "这将覆盖现有数据。" : ""
            }`,
            "导入确认",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          );

          // 执行导入
          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);

          // 如果选择覆盖，先清空现有数据
          if (importOverwrite.value) {
            // 获取所有键并删除
            const allKeys = await new Promise((resolve) => {
              const keysRequest = store.getAllKeys();
              keysRequest.onsuccess = () => resolve(keysRequest.result);
            });

            for (const key of allKeys) {
              await new Promise((resolve) => {
                const deleteRequest = store.delete(key);
                deleteRequest.onsuccess = () => resolve();
              });
            }
          }

          // 导入新数据
          for (const website of importObj.data) {
            // 确保每个网站有唯一ID
            if (!website.id) {
              website.id = uuidv4();
            }

            // 如果不覆盖，检查是否存在同名网站
            if (!importOverwrite.value) {
              const existingWebsite = await new Promise((resolve) => {
                const getRequest = store.get(website.id);
                getRequest.onsuccess = () => resolve(getRequest.result);
              });

              if (existingWebsite) {
                // 如果存在，生成新ID避免覆盖
                website.id = uuidv4();
              }
            }

            // 添加或更新网站
            await new Promise((resolve) => {
              const putRequest = store.put(website);
              putRequest.onsuccess = () => resolve();
            });
          }

          // 刷新数据
          websites.value = await getAllWebsites();

          // 关闭对话框并清空输入
          importDataDialog.value = false;
          importDataText.value = "";
          importOverwrite.value = false;
          clearImportFile();

          ElMessage.success(`成功导入${importObj.data.length}条网站数据`);
        } else if (importFormat.value === "excel") {
          // 处理Excel导入
          if (!excelFileData.value) {
            ElMessage.warning("请先选择Excel文件");
            return;
          }

          // 读取Excel文件
          const workbook = XLSX.read(excelFileData.value, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // 转换为JSON
          const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // 验证表头
          const headers = excelData[0];
          if (
            !headers ||
            headers.length < 5 ||
            !headers.includes("网站名称") ||
            !headers.includes("环境") ||
            !headers.includes("URL") ||
            !headers.includes("账号") ||
            !headers.includes("密码")
          ) {
            ElMessage.error("Excel文件格式不正确，请确保包含正确的表头");
            return;
          }

          // 获取列索引
          const websiteNameIndex = headers.indexOf("网站名称");
          const environmentIndex = headers.indexOf("环境");
          const urlIndex = headers.indexOf("URL");
          const accountIndex = headers.indexOf("账号");
          const passwordIndex = headers.indexOf("密码");

          // 处理数据行
          const websiteMap = new Map();

          for (let i = 1; i < excelData.length; i++) {
            const row = excelData[i];
            if (row.length <= 1 || !row[websiteNameIndex]) continue;

            const websiteName = row[websiteNameIndex];

            // 如果有环境信息，则添加详情
            if (
              row[environmentIndex] ||
              row[urlIndex] ||
              row[accountIndex] ||
              row[passwordIndex]
            ) {
              const detail = {
                accountId: uuidv4(),
                environment: row[environmentIndex] || "",
                url: row[urlIndex] || "",
                account: row[accountIndex] || "",
                password: row[passwordIndex] || "",
              };

              if (websiteMap.has(websiteName)) {
                websiteMap.get(websiteName).details.push(detail);
              } else {
                websiteMap.set(websiteName, {
                  id: uuidv4(),
                  webName: websiteName,
                  details: [detail],
                });
              }
            } else if (!websiteMap.has(websiteName)) {
              // 如果只有网站名称，且之前没有添加过
              websiteMap.set(websiteName, {
                id: uuidv4(),
                webName: websiteName,
                details: [],
              });
            }
          }

          // 转换为数组
          const importData = Array.from(websiteMap.values());

          // 确认导入
          await ElMessageBox.confirm(
            `确定要导入${importData.length}条网站数据吗？${
              importOverwrite.value ? "这将覆盖现有数据。" : ""
            }`,
            "导入确认",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          );

          // 如果选择覆盖，先清空现有数据
          if (importOverwrite.value) {
            // 获取所有键
            const transaction1 = db.transaction(storeName, "readwrite");
            const store1 = transaction1.objectStore(storeName);

            const allKeys = await new Promise((resolve) => {
              const keysRequest = store1.getAllKeys();
              keysRequest.onsuccess = () => resolve(keysRequest.result);
            });

            // 等待事务完成
            await new Promise((resolve) => {
              transaction1.oncomplete = resolve;
            });

            for (const key of allKeys) {
              // 为每个删除操作创建新事务
              const deleteTransaction = db.transaction(storeName, "readwrite");
              const deleteStore = deleteTransaction.objectStore(storeName);

              await new Promise((resolve) => {
                const deleteRequest = deleteStore.delete(key);
                deleteRequest.onsuccess = () => resolve();
              });

              // 等待删除事务完成
              await new Promise((resolve) => {
                deleteTransaction.oncomplete = resolve;
              });
            }
          }

          // 导入新数据
          for (const website of importData) {
            // 为每个网站创建新事务
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            // 如果不覆盖，检查是否存在同名网站
            if (!importOverwrite.value) {
              // 查找同名网站
              const existingWebsite = await new Promise((resolve) => {
                const getRequest = store.openCursor();
                let found = null;

                getRequest.onsuccess = (event) => {
                  const cursor = event.target.result;
                  if (cursor) {
                    if (cursor.value.webName === website.webName) {
                      found = cursor.value;
                      resolve(found);
                    } else {
                      cursor.continue();
                    }
                  } else {
                    resolve(null);
                  }
                };
              });

              if (existingWebsite) {
                // 如果存在同名网站，合并详情
                existingWebsite.details = [
                  ...existingWebsite.details,
                  ...website.details,
                ];

                // 更新现有网站
                await new Promise((resolve) => {
                  const putRequest = store.put(existingWebsite);
                  putRequest.onsuccess = () => resolve();
                });

                // 等待事务完成
                await new Promise((resolve) => {
                  transaction.oncomplete = resolve;
                });
                continue;
              }
            }

            // 添加新网站
            await new Promise((resolve) => {
              const putRequest = store.put(website);
              putRequest.onsuccess = () => resolve();
            });

            // 等待事务完成
            await new Promise((resolve) => {
              transaction.oncomplete = resolve;
            });
          }

          // 刷新数据
          websites.value = await getAllWebsites();

          // 关闭对话框并清空输入
          importDataDialog.value = false;
          importOverwrite.value = false;
          clearImportFile();

          ElMessage.success(`成功导入${importData.length}条网站数据`);
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("导入数据失败:", error);
          ElMessage.error("导入数据失败: " + (error.message || error));
          clearImportFile();
        }
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
      copyAccountRow,
      handleCopy,
      duplicateAccount,
      handleExport,
      handleImport,
      importData,
      importDataDialog,
      importDataText,
      importOverwrite,
      importFormat,
      excelFileName,
      handleExcelUpload,
      excelUploadRef,
      handleImportDialogClosed,
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

.popup-main-flex {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧边栏样式 */
.sidebar {
  width: 250px;
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.sidebar-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.sidebar-input {
  margin-bottom: 12px;
}

.sidebar-btn {
  width: 100%;
}

.sidebar-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-dropdown {
  width: 100%;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

/* 导入导出按钮样式 */
.data-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  gap: 10px;
}

.export-actions,
.import-actions {
  flex: 1;
}

.export-actions .el-dropdown,
.import-actions .el-dropdown {
  width: 100%;
}

.export-actions .el-dropdown-selfdefine,
.import-actions .el-dropdown-selfdefine {
  width: 100%;
}

.import-dialog-content {
  display: flex;
  flex-direction: column;
}

.import-tip {
  margin-bottom: 10px;
  color: #606266;
}

.import-options {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.info-icon {
  margin-left: 8px;
  color: #909399;
  cursor: help;
}

.excel-uploader {
  margin-bottom: 16px;
}

.selected-file {
  margin: 10px 0;
  padding: 8px 12px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-size: 14px;
}
</style>
