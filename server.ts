import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url"; // 1. 引入转换工具

const app = express();
const PORT = 3000;

// 2. 模拟出 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// 3. 现在使用 path.join
const MD_DIR = path.join(__dirname, "public/files");

/**
 * 定义接口返回的类型规范
 */
interface FileListResponse {
  files: string[];
  total: number;
}

app.get("/api/files", (req: Request, res: Response) => {
  // 读取目录
  fs.readdir(MD_DIR, (err, files) => {
    if (err) {
      console.error("读取目录失败:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // 过滤出 .md 文件
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // 按照 TS 定义的格式返回
    const responseData: FileListResponse = {
      files: mdFiles,
      total: mdFiles.length,
    };

    res.json(responseData);
  });
});

app.listen(PORT, () => {
  console.log(`[Server]: 后端运行在 http://localhost:${PORT}/api/files`);
});
