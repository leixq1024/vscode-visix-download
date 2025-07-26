/**
 * 1.列出插件列表
 * 2.开始逐个下载,并且存储到本地
 * 3.显示下载成功和下载失败的插件
 */
// 引入所需模块
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const axios = require("axios");
const Table = require("cli-table3");

// 下载目录路径-默认是当前路径
const DOWNLOAD_DIR = path.join(__dirname, "downloaded");

// 确保下载目录存在，不存在则创建
const ensureDir = dir => (fs.existsSync(dir) ? dir : (fs.mkdirSync(dir), dir));

// 获取已安装的 VSCode 插件及其版本信息
const getExtensions = () => {
  try {
    // 执行命令获取插件列表
    const output = execSync("code --list-extensions --show-versions", { encoding: "utf-8" });
    return output
      .split("\n")
      .filter(Boolean)
      .map(line => {
        // 解析每一行，格式为 publisher.extension@version
        const match = line.match(/^([^.]+)\.([^\@]+)\@(.+)$/);
        return match ? { publisher: match[1], extension: match[2], version: match[3] } : null;
      })
      .filter(Boolean);
  } catch (e) {
    // 获取失败时抛出异常
    throw new Error("无法获取 VSCode 插件列表，请确保已安装 VSCode 并 code 命令可用。");
  }
};

// 显示插件列表表格
const printExtensionsTable = extensions => {
  const table = new Table({
    head: ["插件名称", "版本", "发布者"],
    style: { head: ["cyan"], border: ["grey"] }
  });

  extensions.forEach(ext => {
    table.push([ext.extension, ext.version, ext.publisher]);
  });

  console.log("\n📦 检测到的 VSCode 插件列表, 共: ", extensions.length, "个");
  console.log(table.toString());
};

// 显示下载状态表格
const printDownloadStatusTable = statusList => {
  const table = new Table({
    head: ["插件名称", "下载状态", "耗时(ms)"],
    style: { head: ["green"], border: ["grey"] }
  });

  statusList.forEach(item => {
    const status = item.success ? "✅ 成功" : "❌ 失败";
    table.push([item.extension, status, item.time]);
  });

  console.log("\n📊 下载状态汇总:");
  console.log(table.toString());

  // 统计成功和失败数量
  const successCount = statusList.filter(item => item.success).length;
  const failCount = statusList.length - successCount;
  console.log(`\n📈 统计: 成功 ${successCount} 个，失败 ${failCount} 个`);
};

// 根据插件信息拼接 open-vsx.org 的下载地址
const getVsixUrl = ({ publisher, extension, version }) =>
  `https://open-vsx.org/api/${publisher}/${extension}/${version}/file/${publisher}.${extension}-${version}.vsix`;

// 下载单个插件 VSIX 文件
const downloadVsix = async (url, dest) => {
  const response = await axios({
    method: "get",
    url,
    responseType: "stream", // 以流的方式下载
    maxRedirects: 5 // 支持重定向
  });
  if (response.status !== 200) throw new Error(`下载失败，状态码: ${response.status}`);
  const fileStream = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    response.data.pipe(fileStream);
    response.data.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

// 批量下载所有插件
const downloadAllExtensions = async (extensions, downloadDir) => {
  const statusList = [];

  for (let i = 0, len = extensions.length; i < len; i++) {
    const ext = extensions[i];
    const url = getVsixUrl(ext);
    const filename = `${ext.publisher}.${ext.extension}-${ext.version}.vsix`;
    const dest = path.join(downloadDir, filename);

    console.log(`正在下载第 ${i + 1}/${len} 个插件: ${ext.extension} ...`);

    const startTime = Date.now();
    try {
      await downloadVsix(url, dest);
      const endTime = Date.now();
      const time = endTime - startTime;

      statusList.push({
        extension: ext.extension,
        success: true,
        time: time
      });

      console.log(`✅ 下载成功: ${filename} (耗时: ${time}ms)`);
    } catch (e) {
      const endTime = Date.now();
      const time = endTime - startTime;

      statusList.push({
        extension: ext.extension,
        success: false,
        time: time
      });

      console.log(`❌ 下载失败: ${filename} (耗时: ${time}ms) - ${e.message}`);
    }
  }

  return statusList;
};

// 运行入口
(async () => {
  try {
    // 创建/获取下载目录
    const downloadDir = ensureDir(DOWNLOAD_DIR);

    // 获取插件列表
    const extensions = getExtensions();

    // 显示插件列表表格
    printExtensionsTable(extensions);

    console.log("\n🚀 开始批量下载...");
    const statusList = await downloadAllExtensions(extensions, downloadDir);

    // 显示下载状态表格
    printDownloadStatusTable(statusList);

    console.log("\n🎉 全部下载完成！");
  } catch (error) {
    console.error("❌ 程序执行出错:", error.message);
    process.exit(1);
  }
})();
