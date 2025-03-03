<template>
  <div class="web-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <img src="/icons/icon16.png" alt="Logo" class="logo" />
          <h1>网站账号管理器 - Chrome 扩展</h1>
        </div>
      </el-header>
      <el-main>
        <div class="content">
          <div class="description">
            <h2>功能介绍</h2>
            <p>
              这是一个帮助您管理网站账号和密码的 Chrome 扩展。主要功能包括：
            </p>
            <ul>
              <li>保存多个网站的账号密码</li>
              <li>支持每个网站配置多个环境（测试、预发、生产等）</li>
              <li>一键复制账号密码</li>
              <li>自动填充表单</li>
              <li>数据本地存储，保障隐私安全</li>
            </ul>

            <el-button type="primary" size="large" @click="downloadExtension">
              下载扩展
            </el-button>
          </div>

          <div class="demo">
            <h2>功能演示</h2>
            <div class="extension-preview">
              <Popup />
            </div>
          </div>
        </div>

        <div class="installation">
          <h2>安装说明</h2>
          <ol>
            <li>下载扩展压缩包并解压</li>
            <li>打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)</li>
            <li>开启右上角的"开发者模式"</li>
            <li>点击"加载已解压的扩展程序"</li>
            <li>选择解压后的文件夹</li>
          </ol>
        </div>
      </el-main>
      <el-footer>
        <p>© 2023 网站账号管理器 - 保护您的账号安全</p>
      </el-footer>
    </el-container>
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
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.el-main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.description,
.demo {
  flex: 1;
}

.extension-preview {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 500px;
  height: 600px;
  overflow: auto;
}

.installation {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.el-footer {
  text-align: center;
  background-color: #f5f7fa;
  color: #606266;
  padding: 20px;
  margin-top: auto;
}

h1 {
  margin: 0;
}

h2 {
  margin-top: 0;
  color: #409eff;
}

ul,
ol {
  padding-left: 20px;
  line-height: 1.8;
}
</style>
