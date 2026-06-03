# 中国象棋教学软件

一款在 Windows 10 上运行的单机中国象棋教学软件，包含规则讲解、人机对战和双人对战功能。

## 功能特性

- 📚 **规则讲解**：详细介绍象棋的基本规则和各棋子的走法
- 🤖 **人机对战**：三种难度的 AI 对手（简单、中等、困难）
- 👥 **双人对战**：本地双人对战模式
- ↩️ **悔棋功能**：支持悔棋操作
- 🔄 **重新开始**：随时可以重新开始游戏

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React (图标库)

## 安装和运行

### 前置要求

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn

### 安装依赖

在项目目录下运行：

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

然后在浏览器中访问显示的地址（通常是 `http://localhost:5173` 或 `http://localhost:3000`）

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
中国象棋/
├── src/
│   ├── components/
│   │   └── ChessBoard.tsx    # 棋盘组件
│   ├── pages/
│   │   ├── MainMenu.tsx      # 主菜单页面
│   │   ├── Rules.tsx         # 规则讲解页面
│   │   ├── AIGame.tsx        # 人机对战页面
│   │   └── VsGame.tsx        # 双人对战页面
│   ├── types/
│   │   └── chess.ts          # 象棋相关类型定义
│   ├── utils/
│   │   └── chessLogic.ts     # 象棋游戏核心逻辑
│   ├── App.tsx               # 应用主组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 游戏规则

### 棋子说明

- 帅（将）：只能在九宫内移动，每次一格
- 仕（士）：只能在九宫内沿斜线移动
- 相（象）：走田字，不能过河，有塞象眼规则
- 馬：走日字，有蹩马腿规则
- 車：走直线，无格数限制
- 炮：走法同車，吃子需跳一个棋子
- 兵（卒）：过河前只能前进，过河后可左右移动，不能后退

### 胜负判定

- 将死对方帅（将）获胜
- 对方无子可走时获胜
