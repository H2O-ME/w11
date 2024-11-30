class ApplicationManager {
    constructor() {
        this.apps = new Map();
        this.registerDefaultApps();
    }

    registerDefaultApps() {
        // 计算器应用
        this.registerApp('calculator', {
            title: '计算器',
            icon: 'picture/可执行文件.png', // 使用本地图标
            width: 320,
            height: 480,
            launch: () => {
                const window = windowManager.createWindow({
                    title: '计算器',
                    icon: 'picture/可执行文件.png',
                    width: 320,
                    height: 480
                });
                
                const content = window.querySelector('.window-content');
                content.innerHTML = `
                    <div class="calculator">
                        <input type="text" class="calc-display" readonly value="0">
                        <div class="calc-buttons">
                            <button>C</button><button>±</button><button>%</button><button>÷</button>
                            <button>7</button><button>8</button><button>9</button><button>×</button>
                            <button>4</button><button>5</button><button>6</button><button>-</button>
                            <button>1</button><button>2</button><button>3</button><button>+</button>
                            <button class="wide">0</button><button>.</button><button>=</button>
                        </div>
                    </div>
                `;
                
                new Calculator(content.querySelector('.calculator'));
            }
        });

        // 设置应用
        this.registerApp('settings', {
            title: '设置',
            icon: 'picture/设置.png',
            width: 800,
            height: 600,
            launch: () => {
                const window = windowManager.createWindow({
                    title: '设置',
                    icon: 'picture/设置.png',
                    width: 800,
                    height: 600
                });
                
                const content = window.querySelector('.window-content');
                content.innerHTML = `
                    <div class="settings-app">
                        <div class="settings-sidebar">
                            <div class="settings-item active">
                                <img src="picture/设置.png" class="icon">
                                <span>系统</span>
                            </div>
                            <div class="settings-item">
                                <img src="picture/图片.png" class="icon">
                                <span>个性化</span>
                            </div>
                        </div>
                        <div class="settings-main">
                            <h2>系统设置</h2>
                            <div class="settings-section">
                                <h3>关于</h3>
                                <p>Web Windows 11</p>
                                <p>版本: 1.0.0</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // 文件管理器
        this.registerApp('files', {
            title: '文件',
            icon: 'picture/文件夹.png',
            width: 800,
            height: 600,
            launch: () => {
                const window = windowManager.createWindow({
                    title: '文件',
                    icon: 'picture/文件夹.png',
                    width: 800,
                    height: 600
                });
                
                const content = window.querySelector('.window-content');
                content.innerHTML = `
                    <div class="file-explorer">
                        <div class="file-sidebar">
                            <div class="file-item">
                                <img src="picture/文档.png" class="icon">
                                <span>文档</span>
                            </div>
                            <div class="file-item">
                                <img src="picture/图片.png" class="icon">
                                <span>图片</span>
                            </div>
                            <div class="file-item">
                                <img src="picture/音乐.png" class="icon">
                                <span>音乐</span>
                            </div>
                            <div class="file-item">
                                <img src="picture/视频.png" class="icon">
                                <span>视频</span>
                            </div>
                            <div class="file-item">
                                <img src="picture/下载文件夹.png" class="icon">
                                <span>下载</span>
                            </div>
                        </div>
                        <div class="file-main">
                            <div class="file-toolbar">
                                <button class="toolbar-btn">
                                    <img src="picture/全选.png" class="icon" title="全选">
                                </button>
                                <button class="toolbar-btn">
                                    <img src="picture/全不选.png" class="icon" title="取消选择">
                                </button>
                                <div class="address-bar">
                                    <img src="picture/文件夹.png" class="icon">
                                    <span>文档</span>
                                </div>
                            </div>
                            <div class="file-list">
                                <div class="file-item">
                                    <img src="picture/文档.png" class="icon">
                                    <span>文档1.txt</span>
                                </div>
                                <div class="file-item">
                                    <img src="picture/文档.png" class="icon">
                                    <span>文档2.txt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }

    registerApp(id, config) {
        this.apps.set(id, config);
        this.createDesktopIcon(id, config);
    }

    createDesktopIcon(id, config) {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.innerHTML = `
            <img src="${config.icon}" class="icon" alt="${config.title}">
            <span class="title">${config.title}</span>
        `;
        
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault();
            try {
                config.launch();
            } catch (error) {
                console.error(`启动应用 ${config.title} 时发生错误:`, error);
            }
        });

        icon.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectIcon(icon);
        });

        // 添加到桌面图标容器
        const desktopIcons = document.getElementById('desktop-icons');
        if (desktopIcons) {
            desktopIcons.appendChild(icon);
        }
    }

    selectIcon(icon) {
        document.querySelectorAll('.desktop-icon').forEach(i => {
            i.classList.remove('selected');
        });
        icon.classList.add('selected');
    }
}

// 初始化应用管理器
const appManager = new ApplicationManager(); 