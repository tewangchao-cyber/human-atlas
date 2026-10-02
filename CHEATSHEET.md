# Human Atlas 本地运行 Cheat-Sheet

所有命令都在项目文件夹里运行：

```bash
cd ~/Documents/Claude/HumanAtlas
```

---

## 0. 第一次（或删掉 node_modules 之后）

```bash
npm ci
```

按 `package-lock.json` 安装依赖，只需做一次。

---

## 1. 开发模式（平时用这个）

**启动**

```bash
npm run dev
```

浏览器打开 → http://localhost:3016

- 改代码后页面自动刷新
- 同一 Wi-Fi 下的手机也能访问：`http://<电脑的局域网IP>:3016`

**关闭**：在运行它的终端窗口按 `Ctrl + C`

---

## 2. 生产模式预览（模拟正式上线的效果）

**构建 + 启动**

```bash
npm run build
npx vite preview --port 4173
```

浏览器打开 → http://localhost:4173

- `npm run build` 生成 `dist/` 文件夹（纯静态文件）
- 改了代码要重新 `npm run build` 才能看到变化

**关闭**：同样按 `Ctrl + C`

---

## 3. 关不掉 / 端口被占用

终端窗口已经关了，或者提示 `Port 3016 is in use`：

```bash
lsof -i :3016            # 看看是谁占着 3016 端口
lsof -ti :3016 | xargs kill   # 关掉它（生产预览就把 3016 换成 4173）
```

---

## 4. 从 GitHub 获取作者的最新版本

```bash
git pull
npm ci        # 如果 package.json 有变化，重新装依赖
```

---

## 5. 清理空间（约 780 MB，随时可再生成）

```bash
rm -rf dist node_modules
```

之后要先 `npm ci` 才能再运行。

---

## 速查表

| 想做什么 | 命令 | 地址 |
|---|---|---|
| 安装依赖 | `npm ci` | |
| 开发模式 | `npm run dev` | localhost:3016 |
| 构建 | `npm run build` | |
| 生产预览 | `npx vite preview --port 4173` | localhost:4173 |
| 停止 | `Ctrl + C` | |
| 强制停止 | `lsof -ti :端口 \| xargs kill` | |
| 更新代码 | `git pull` | |
| 看改了什么 | `git status` / `git diff` | |

---

# Git 心智模型

> 忘了命令时，先问自己：**我想把东西从哪里搬到哪里？**

## 4 个地方

```
 ┌─────────────── 你的电脑 ───────────────┐
 │                                        │
 │   ① 工作区   你正在编辑的文件（书桌）       │
 │      │  git add                         │
 │      ▼                                  │
 │   ② 暂存区   准备存档的改动（纸箱）         │
 │      │  git commit                      │
 │      ▼                                  │
 │   ③ 本地仓库 .git 里的所有历史（档案柜）    │
 │                                        │
 └──────────┬──────────────▲──────────────┘
            │ git push     │ git pull
            ▼              │
 ┌──────────────── GitHub ────────────────┐
 │   ④ 远程仓库  网上那一份（保险箱）          │
 └────────────────────────────────────────┘
```

| 命令 | 搬运方向 | 意思 |
|---|---|---|
| `git add 文件` | ① → ② | 把改动放进纸箱 |
| `git commit -m "说明"` | ② → ③ | 封箱存档，拍一张快照 |
| `git push` | ③ → ④ | 上传到 GitHub |
| `git pull` | ④ → ③ → ① | 从 GitHub 取回最新的 |
| `git clone 网址` | ④ → 整个复制到本地 | 第一次下载项目 |
| `git status` | 只看不搬 | ① 和 ② 现在什么情况 |
| `git diff` | 只看不搬 | ① 里具体改了什么 |
| `git log --oneline` | 只看不搬 | ③ 里的历史快照 |

## 三个关键理解

**1. Git ≠ GitHub**
Git 是电脑上的工具（管 ①②③，不联网也能用）；GitHub 是网站（提供 ④ + fork / Issue / PR）。
Git 是相机，GitHub 是网上相册。

**2. commit = 整个项目的一张完整快照**

```
A ──▶ B ──▶ C ──▶ D   （最新）
```

每张都保留着，随时能回去 → 所以不怕改坏。

**3. 分支 = 贴在某张快照上的便利贴**

```
A ──▶ B ──▶ C            ← main
             └──▶ D      ← zoom-to-cursor（实验分支）
```

新建分支几乎零成本。**想试什么，先建分支**；改坏了切回 `main` 就行。

```bash
git switch -c 新分支名   # 新建并切换到新分支
git switch main          # 切回 main
git branch               # 看有哪些分支、现在在哪个
```

## fork 和 remote

- **fork**：在 GitHub 网站上把别人的 ④ 复制一份到你的账号下。不影响你的电脑。
- **remote**：本地 ③ 记住的"保险箱地址"，可以有多个：

```
origin → 原作者的仓库（pull 更新用）
mine   → 你 fork 的仓库（push 改动用）
```

```bash
git remote -v                      # 查看有哪些远程地址
git remote add mine 你的仓库网址     # 添加一个
```

## ⚠️ 会丢掉本地修改的命令（用前三思）

`git reset --hard`　·　`git checkout -- 文件`　·　`git restore 文件`　·　`git clean -f`
