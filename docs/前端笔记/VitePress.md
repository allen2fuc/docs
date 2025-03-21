# VitePress

[官方网站](https://vitejs.cn/vitepress/)



## 安装

[参考官网](https://vitepress.dev/guide/getting-started)

1. 创建项目文件夹

   ```bash
   $ mkdir docs && cd docs
   ```

2. 将当前项目加入到`vitepress`

   ```bash
   $ npm add -D vitepress
   ```

3. 安装向导

   ```bash
   $ npx vitepress init
   ```

   ```ini
   ┌  Welcome to VitePress!
   │
   ◇  Where should VitePress initialize the config?
   │  ./docs
   │
   ◇  Site title:
   │  浪哩格朗
   │
   ◇  Site description:
   │  学海无涯苦作舟
   │
   ◇  Theme:
   │  Default Theme
   │
   ◇  Use TypeScript for config and theme files?
   │  Yes
   │
   ◇  Add VitePress npm scripts to package.json?
   │  Yes
   │
   └  Done! Now run npm run docs:dev and start writing.
   
   ```

   目录结构

   ```bash
   .
   ├── docs
   │   ├── .vitepress
   │   ├── api-examples.md
   │   ├── index.md
   │   └── markdown-examples.md
   ├── node_modules
   ├── package-lock.json
   └── package.json
   ```

4. 运行

   ```bash
   $ npm run docs:dev
   ```

   访问游览器：http://localhost:5173

## 部署

将项目部署在`github`上。

1. 创建`.gitignore`

   ```bash
   $ vim .gitignore
   ```
   ```bash
   /coverage
   /src/client/shared.ts
   /src/node/shared.ts
   *.log
   *.tgz
   .DS_Store
   .idea
   .temp
   .vite_opt_cache
   .vscode
   dist
   cache
   temp
   examples-temp
   node_modules
   packagfe
   pnpm-global
   TODOs.md
   *.timestamp-*.mjs
   ```

2. 在github上创建项目：https://github.com/xxx/docs.git


3.  初始化项目

   ```bash
   $ git init
   $ git add .
   $ git commit -m "first commit"
   $ git branch -M main
   $ git remote add origin https://github.com/xxx/docs.git
   $ git push -u origin main
   
   # 必要时拉去
   $ git pull origin main
   ```

4. 在`github`当前项目页面点击`Settings`，选择左边导航栏`Pages`，选择`Build and deployment`下的`Github Actions`, 点击`browse all workflows`，点击`set up a workflow yourself`，将`main.yml`修改为`deploy.yml`，然后粘贴以下内容：

   ```bash
   # 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
   #
   name: Deploy VitePress site to Pages
   
   on:
     # 在针对 `main` 分支的推送上运行。如果你
     # 使用 `master` 分支作为默认分支，请将其更改为 `master`
     push:
       branches: [main]
   
     # 允许你从 Actions 选项卡手动运行此工作流程
     workflow_dispatch:
   
   # 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write
   
   # 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
   # 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
   concurrency:
     group: pages
     cancel-in-progress: false
   
   jobs:
     # 构建工作
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
           with:
             fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
         # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
         # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: npm # 或 pnpm / yarn
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Install dependencies
           run: npm ci # 或 pnpm install / yarn install / bun install
         - name: Build with VitePress
           run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: docs/.vitepress/dist
   
     # 部署工作
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       name: Deploy
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

5. 访问你的网页地址：https://xxx.github.io/example-vitepress/

6. 自定义domain

   > [!CAUTION]
   >
   > 这里有个坑，如果只部署在github上，使用github的页面打开，则需要指定`base`属性，绑定到domain后需要把base删除。

   1. 在`https://github.com/xxx/example-vitepress/settings/pages`页面的`Custom domain`输入框内输入：docs.xxx.xxx

   2. 在域名提供商中新增一条记录，然后需要等待5～30分钟左右。
      1. 主机记录：docs
      2. 记录类型：CNAME
      3. 线路类型：默认
      4. 记录值：xxx.github.io.



## 配置

### 目录规划

```bash
$ mkdir docs/前端笔记

$ mkdir docs/后端笔记

$ mkdir docs/All-In-One

$ mkdir docs/私人笔记
```
