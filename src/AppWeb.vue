<template>
  <div class="web-container">
    <header class="app-header">
      <div class="header-content">
        <img src="/icons/icon16.png" alt="Logo" class="logo" />
        <h1>网站账号管理器 - Chrome 扩展</h1>
      </div>
    </header>

    <main class="app-main">
      <div class="content-container">
        <aside class="sidebar">
          <div class="intro-section">
            <div class="intro-header">
              <h2>功能介绍</h2>
            </div>

            <div class="intro-content">
              <p>
                这是一个帮助您管理网站账号和密码的 Chrome 扩展。主要功能包括：
              </p>
              <ul>
                <li><span class="bullet"></span>保存多个网站的账号密码</li>
                <li>
                  <span class="bullet"></span
                  >支持每个网站配置多个环境（测试、预发、生产等）
                </li>
                <li><span class="bullet"></span>一键复制账号密码</li>
                <li><span class="bullet"></span>自动填充表单</li>
                <li><span class="bullet"></span>数据本地存储，保障隐私安全</li>
              </ul>
            </div>

            <el-button
              type="primary"
              class="download-btn"
              @click="downloadExtension"
            >
              下载扩展
            </el-button>
          </div>
        </aside>

        <section class="demo-section">
          <h2>功能演示</h2>
          <div class="demo-container">
            <Popup />
          </div>
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <p>© 2023 网站账号管理器 - 保护您的账号安全</p>
    </footer>
  </div>
</template>

<script setup>
import Popup from "./views/Popup.vue";

const downloadExtension = () => {
  // 这里可以提供扩展的下载链接
  alert("扩展下载功能正在开发中，请稍后再试！");
};
</script>

<style scoped>
.web-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.app-header {
  background-color: #409eff;
  color: white;
  padding: 16px 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.app-main {
  flex: 1;
  padding: 32px 24px;
  overflow: hidden;
}

.content-container {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.sidebar {
  width: 30%;
  overflow-y: auto;
}

.intro-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
  border: 1px solid #ebeef5;
}

.intro-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.intro-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #303133;
}

.intro-content {
}

.intro-content p {
  color: #606266;
  margin-bottom: 12px;
}

.intro-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.intro-content li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #606266;
}

.bullet {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #409eff;
  margin-right: 10px;
}

.download-btn {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  font-size: 1rem;
}

.demo-section {
  width: 70%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.demo-section h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.3rem;
  color: #409eff;
}

.demo-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
  border: 1px solid #ebeef5;
  flex: 1;
  overflow: auto;
}

.demo-container::-webkit-scrollbar {
  width: 8px;
}

.demo-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.demo-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.demo-container::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.app-footer {
  background-color: #f0f2f5;
  color: #606266;
  text-align: center;
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar,
  .demo-section {
    width: 100%;
  }

  .demo-section {
    height: 500px;
  }
}
</style>
