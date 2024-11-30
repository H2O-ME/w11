class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 1000;
        this.initTaskbar();
    }

    initTaskbar() {
        let runningApps = document.getElementById('running-apps');
        if (!runningApps) {
            runningApps = document.createElement('div');
            runningApps.id = 'running-apps';
            const taskbar = document.getElementById('taskbar');
            if (taskbar) {
                taskbar.insertBefore(runningApps, taskbar.firstChild);
            }
        }
    }

    createWindow(config) {
        const windowId = 'window-' + Date.now();
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = windowId;
        
        windowEl.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">${config.title || 'Window'}</div>
                <div class="window-controls">
                    <button type="button" class="minimize" data-action="minimize">─</button>
                    <button type="button" class="maximize" data-action="maximize">□</button>
                    <button type="button" class="close" data-action="close">×</button>
                </div>
            </div>
            <div class="window-content"></div>
        `;

        document.getElementById('desktop').appendChild(windowEl);
        
        const windowInfo = {
            element: windowEl,
            config: config,
            minimized: false,
            maximized: false,
            taskbarItem: null
        };
        
        this.windows.set(windowId, windowInfo);
        
        Object.assign(windowEl.style, {
            width: (config.width || 800) + 'px',
            height: (config.height || 600) + 'px',
            left: Math.max(0, Math.random() * (window.innerWidth - (config.width || 800))) + 'px',
            top: Math.max(0, Math.random() * (window.innerHeight - (config.height || 600))) + 'px'
        });

        this.setupWindowControls(windowEl);
        this.makeWindowDraggable(windowEl);
        this.addToTaskbar(windowId, config);
        this.focusWindow(windowId);
        
        return windowEl;
    }

    setupWindowControls(windowEl) {
        const controls = windowEl.querySelector('.window-controls');
        const windowId = windowEl.id;

        controls.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            e.stopPropagation();
            const action = button.dataset.action;

            switch (action) {
                case 'minimize':
                    this.minimizeWindow(windowId);
                    break;
                case 'maximize':
                    this.toggleMaximize(windowId);
                    break;
                case 'close':
                    this.closeWindow(windowId);
                    break;
            }
        });
    }

    minimizeWindow(windowId) {
        const windowInfo = this.windows.get(windowId);
        if (!windowInfo) return;
        
        windowInfo.element.style.display = 'none';
        windowInfo.minimized = true;
        if (windowInfo.taskbarItem) {
            windowInfo.taskbarItem.classList.add('minimized');
        }
    }

    toggleMaximize(windowId) {
        const windowInfo = this.windows.get(windowId);
        if (!windowInfo) return;
        
        if (!windowInfo.maximized) {
            // 保存原始大小和位置
            windowInfo.originalSize = {
                width: windowInfo.element.style.width,
                height: windowInfo.element.style.height,
                top: windowInfo.element.style.top,
                left: windowInfo.element.style.left
            };
            
            // 最大化
            windowInfo.element.style.top = '0';
            windowInfo.element.style.left = '0';
            windowInfo.element.style.width = '100%';
            windowInfo.element.style.height = 'calc(100vh - 48px)';
            windowInfo.element.style.borderRadius = '0';
            
        } else {
            // 还原
            Object.assign(windowInfo.element.style, windowInfo.originalSize);
            windowInfo.element.style.borderRadius = '8px';
        }
        
        windowInfo.maximized = !windowInfo.maximized;
    }

    closeWindow(windowId) {
        const windowInfo = this.windows.get(windowId);
        if (!windowInfo) return;
        
        windowInfo.element.remove();
        if (windowInfo.taskbarItem) {
            windowInfo.taskbarItem.remove();
        }
        this.windows.delete(windowId);
    }

    addToTaskbar(windowId, config) {
        const windowInfo = this.windows.get(windowId);
        if (!windowInfo) return;

        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.innerHTML = `
            <span class="taskbar-icon">${config.icon || '🪟'}</span>
            <span class="taskbar-title">${config.title || 'Window'}</span>
        `;
        
        taskbarItem.addEventListener('click', () => {
            if (windowInfo.minimized) {
                this.restoreWindow(windowId);
            } else if (windowInfo.element.style.display !== 'none') {
                this.minimizeWindow(windowId);
            } else {
                this.restoreWindow(windowId);
            }
        });

        const runningApps = document.getElementById('running-apps');
        if (runningApps) {
            runningApps.appendChild(taskbarItem);
            windowInfo.taskbarItem = taskbarItem;
        }
    }

    restoreWindow(windowId) {
        const windowInfo = this.windows.get(windowId);
        if (!windowInfo) return;
        
        windowInfo.element.style.display = '';
        windowInfo.minimized = false;
        if (windowInfo.taskbarItem) {
            windowInfo.taskbarItem.classList.remove('minimized');
        }
        this.focusWindow(windowId);
    }

    makeWindowDraggable(windowEl) {
        const titlebar = windowEl.querySelector('.window-titlebar');
        let startX, startY, startLeft, startTop;
        let isDragging = false;

        const handleMouseDown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            const rect = windowEl.getBoundingClientRect();
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            
            this.focusWindow(windowEl.id);
            
            // 添加临时事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            // 防止文本选择
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // 确保窗口不会完全移出视口
            const maxX = window.innerWidth - windowEl.offsetWidth;
            const maxY = window.innerHeight - windowEl.offsetHeight;
            
            windowEl.style.left = `${Math.min(Math.max(0, newLeft), maxX)}px`;
            windowEl.style.top = `${Math.min(Math.max(0, newTop), maxY)}px`;
        };

        const handleMouseUp = () => {
            isDragging = false;
            // 移除临时事件监听器
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        titlebar.addEventListener('mousedown', handleMouseDown);
    }

    focusWindow(windowId) {
        this.windows.forEach((info, id) => {
            if (id === windowId) {
                info.element.style.zIndex = ++this.zIndex;
                info.element.classList.add('active');
            } else {
                info.element.classList.remove('active');
            }
        });
    }
}

// 创建全局窗口管理器实例
const windowManager = new WindowManager(); 