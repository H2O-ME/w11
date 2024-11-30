class System {
    constructor() {
        this.initializeSystem();
        this.initializeTaskbar();
        this.initializeContextMenu();
    }

    initializeSystem() {
        // 初始化任务栏
        this.initTaskbar();
        // 初始化时钟
        this.initClock();
        // 启动时钟更新
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    initTaskbar() {
        const taskbar = document.getElementById('taskbar');
        if (!taskbar) {
            const taskbarEl = document.createElement('div');
            taskbarEl.id = 'taskbar';
            taskbarEl.innerHTML = `
                <div id="start-button">
                    <span>🪟</span>
                </div>
                <div id="running-apps"></div>
                <div id="system-tray">
                    <span class="time"></span>
                </div>
            `;
            document.body.appendChild(taskbarEl);
        }
    }

    initClock() {
        const timeElement = document.querySelector('#system-tray .time');
        if (!timeElement) {
            const systemTray = document.getElementById('system-tray');
            if (systemTray) {
                const timeSpan = document.createElement('span');
                timeSpan.className = 'time';
                systemTray.appendChild(timeSpan);
            }
        }
    }

    updateClock() {
        const timeElement = document.querySelector('#system-tray .time');
        if (timeElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    initializeContextMenu() {
        // 确保在DOM加载完成后初始化右键菜单
        window.addEventListener('load', () => {
            if (!this.contextMenu) {
                this.contextMenu = new DesktopContextMenu();
                console.log('Context menu created'); // 调试信息
            }
        });
    }

    initializeTaskbar() {
        // 更新时间
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // 初始化开始按钮
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                // 开始菜单功能
                console.log('Start menu clicked');
            });
        }

        // 初始化运行中的应用
        this.runningApps = document.getElementById('running-apps');
    }

    addTaskbarItem(app) {
        const item = document.createElement('div');
        item.className = 'taskbar-item';
        item.innerHTML = `
            <img src="${app.icon}" alt="${app.title}">
        `;
        
        item.addEventListener('click', () => {
            // 处理任务栏项目点击
            if (app.window) {
                if (app.window.classList.contains('minimized')) {
                    app.window.classList.remove('minimized');
                }
                app.window.focus();
            }
        });

        this.runningApps.appendChild(item);
        return item;
    }
}

// 创建系统实例
window.addEventListener('DOMContentLoaded', () => {
    window.system = new System();
}); 