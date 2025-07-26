# VSCode 插件批量下载工具

一个用于批量下载 VSCode 插件的 Node.js 工具，可以自动获取当前已安装的插件列表并下载对应的 VSIX 文件到本地。

## ✨ 功能特性

- 🔍 **自动检测**: 自动获取当前 VSCode 中已安装的所有插件
- 📦 **批量下载**: 一键下载所有插件的 VSIX 文件
- 📊 **美观展示**: 使用表格形式展示插件列表和下载状态
- ⏱️ **耗时统计**: 显示每个插件的下载耗时
- 📈 **状态汇总**: 统计下载成功和失败的数量
- 🎯 **离线备份**: 将插件文件保存到本地，方便离线安装

## 🚀 快速开始

### 环境要求

- Node.js (版本 14 或更高)
- VSCode (已安装并配置了 `code` 命令)
- npm 或 pnpm 包管理器

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 使用方法

1. **确保 VSCode 命令可用**

   在命令行中运行以下命令，确保 `code` 命令可用：

   ```bash
   code --version
   ```

2. **运行下载脚本**

   ```bash
   # 使用 npm
   npm run dev

   # 或直接运行
   node download-vsix.js
   ```

3. **查看结果**

   脚本运行后会：

   - 显示检测到的插件列表表格
   - 逐个下载插件文件
   - 显示下载状态汇总表格
   - 将文件保存到 `downloaded/` 目录

## 📋 输出示例

### 插件列表展示

```
📦 检测到的 VSCode 插件列表:
┌─────────────────────┬─────────────┬─────────────┐
│ 插件名称            │ 版本        │ 发布者      │
├─────────────────────┼─────────────┼─────────────┤
│ python              │ 2025.6.1    │ ms-python   │
│ eslint              │ 3.0.10      │ dbaeumer    │
│ prettier            │ 11.0.0      │ esbenp      │
└─────────────────────┴─────────────┴─────────────┘
```

### 下载状态汇总

```
📊 下载状态汇总:
┌─────────────────────┬─────────────┬─────────────┐
│ 插件名称            │ 下载状态    │ 耗时(ms)    │
├─────────────────────┼─────────────┼─────────────┤
│ python              │ ✅ 成功     │ 1250        │
│ eslint              │ ✅ 成功     │ 890         │
│ prettier            │ ❌ 失败     │ 1500        │
└─────────────────────┴─────────────┴─────────────┘

📈 统计: 成功 2 个，失败 1 个
```

## 📁 文件结构

```
vscode插件批量下载/
├── download-vsix.js    # 主程序文件
├── downloaded/         # 下载的插件文件目录
├── package.json        # 项目配置文件
├── pnpm-lock.yaml      # 依赖锁定文件
└── README.md          # 项目说明文档
```

## 🔧 配置说明

### 下载目录

默认下载目录为项目根目录下的 `downloaded/` 文件夹，可以在 `download-vsix.js` 中修改：

```javascript
const DOWNLOAD_DIR = path.join(__dirname, "downloaded");
```

### 下载源

当前使用 [open-vsx.org](https://open-vsx.org/) 作为插件下载源，这是一个开源的 VSCode 插件市场。

## 🛠️ 故障排除

### 常见问题

1. **无法获取插件列表**

   ```
   错误: 无法获取 VSCode 插件列表，请确保已安装 VSCode 并 code 命令可用。
   ```

   **解决方案**:

   - 确保已安装 VSCode
   - 将 VSCode 的 `bin` 目录添加到系统 PATH 环境变量
   - 重启命令行窗口

2. **下载失败**

   ```
   ❌ 下载失败: xxx.vsix (耗时: xxxms) - 下载失败，状态码: 404
   ```

   **可能原因**:

   - 插件在 open-vsx.org 上不存在
   - 网络连接问题
   - 插件版本不匹配

3. **依赖安装失败**

   ```bash
   npm ERR! code ENOENT
   ```

   **解决方案**:

   - 确保 Node.js 版本符合要求
   - 清除 npm 缓存: `npm cache clean --force`
   - 删除 node_modules 文件夹后重新安装

## 📝 开发说明

### 主要依赖

- `axios`: HTTP 请求库，用于下载文件
- `cli-table3`: 控制台表格显示库
- `child_process`: Node.js 内置模块，用于执行系统命令
- `fs`: Node.js 内置模块，用于文件系统操作

### 核心功能

1. **插件列表获取**: 通过 `code --list-extensions --show-versions` 命令获取
2. **URL 构建**: 根据插件信息构建 open-vsx.org 的下载链接
3. **文件下载**: 使用 axios 流式下载 VSIX 文件
4. **状态跟踪**: 记录每个插件的下载状态和耗时
5. **结果展示**: 使用表格形式展示下载结果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 ISC 许可证。

## 🙏 致谢

- [open-vsx.org](https://open-vsx.org/) - 提供开源的 VSCode 插件市场
- [cli-table3](https://github.com/cli-table/cli-table3) - 美观的控制台表格显示
- [axios](https://axios-http.com/) - 强大的 HTTP 客户端库

---

如果这个工具对你有帮助，请给个 ⭐️ 支持一下！
