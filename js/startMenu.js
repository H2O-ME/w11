class StartMenu {
    constructor() {
        this.createStartMenu();
        this.isVisible = false;
    }

    createStartMenu() {
        const menu = document.createElement('div');
        menu.id = 'start-menu';
        menu.className = 'start-menu hidden';
        
        menu.innerHTML = `
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input type="text" placeholder="搜索应用和文件">
            </div>
            <div class="pinned-apps">
                <h3>固定的应用</h3>
                <div class="app-grid">
                    <div class="app-item">🧮 计算器</div>
                    <div class="app-item">⚙️ 设置</div>
                    <div class="app-item">📁 文件</div>
                    <div class="app-item">🌐 浏览器</div>
                    <div class="app-item">📝 记事本</div>
                    <div class="app-item">🎮 游戏</div>
                </div>
            </div>
            <div class="recommended">
                <h3>推荐</h3>
                <div class="recent-files">
                    <div class="recent-item">📄 最近的文档1</div>
                    <div class="recent-item">📄 最近的文档2</div>
                </div>
            </div>
            <div class="start-footer">
                <div class="user-profile">👤 用户</div>
                <div class="power-button">⏻ 电源</div>
            </div>
        `;
        
        document.body.appendChild(menu);
        this.menu = menu;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => {
            this.toggleMenu();
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && 
                !document.getElementById('start-button').contains(e.target)) {
                this.hideMenu();
            }
        });

        // 为开始菜单中的应用添加点击事件
        this.menu.querySelectorAll('.app-item').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.textContent.split(' ')[1];
                this.launchApp(appName);
                this.hideMenu();
            });
        });
    }

    toggleMenu() {
        this.isVisible ? this.hideMenu() : this.showMenu();
    }

    showMenu() {
        this.menu.classList.remove('hidden');
        this.isVisible = true;
    }

    hideMenu() {
        this.menu.classList.add('hidden');
        this.isVisible = false;
    }

    launchApp(appName) {
        // 通过应用管理器启动应用
        const appId = appName.toLowerCase();
        const app = appManager.apps.get(appId);
        if (app) {
            app.launch();
        }
    }
} 