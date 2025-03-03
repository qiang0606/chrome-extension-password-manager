import { createApp } from "vue";
import App from "./App.vue";
import AppWeb from "./AppWeb.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/main.css";

// 判断是否为网页环境
const isWeb = window.location.pathname !== "/popup.html";
const AppComponent = isWeb ? AppWeb : App;

const app = createApp(AppComponent);
app.use(ElementPlus);
app.mount("#app");
