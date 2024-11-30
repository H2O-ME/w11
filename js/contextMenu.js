class DesktopContextMenu {
    constructor() {
        this.activeSubMenu = null;
        this.initializeContextMenu();
    }

    initializeContextMenu() {
        // 获取桌面元素
        const desktop = document.getElementById('desktop');
        if (!desktop) {
            console.error('Desktop element not found');
            return;
        }

        // 阻止默认右键菜单并显示自定义菜单
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showContextMenu(e.pageX, e.pageY);
        });

        // 点击其他区域关闭菜单
        document.addEventListener('click', (e) => {
            const menu = document.querySelector('.context-menu');
            const isClickInsideMenu = menu && menu.contains(e.target);
            if (!isClickInsideMenu) {
                this.hideContextMenu();
            }
        });

        // 按下 Esc 键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideContextMenu();
            }
        });
    }

    showContextMenu(x, y) {
        this.hideContextMenu(); // 先清除已存在的菜单
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        
        // 更新菜单项，添加图标
        menu.innerHTML = `
            <div class="menu-item" data-action="refresh">
                <span class="menu-icon">🔄</span>
                <span class="menu-text">刷新</span>
                <span class="shortcut">F5</span>
            </div>
            <div class="menu-separator"></div>
            <div class="menu-item" data-action="new">
                <span class="menu-icon">📄</span>
                <span class="menu-text">新建</span>
                <span class="menu-arrow">▶</span>
            </div>
            <div class="menu-separator"></div>
            <div class="menu-item" data-action="display">
                <span class="menu-icon">🖥️</span>
                <span class="menu-text">显示设置</span>
            </div>
            <div class="menu-item" data-action="personalize">
                <span class="menu-icon">🎨</span>
                <span class="menu-text">个性化</span>
            </div>
        `;

        // 调整菜单位置，确保不超出屏幕
        const menuWidth = 200; // 预设单宽度
        const menuHeight = 200; // 预设菜单高度
        
        // 确保菜单不会超出右边界
        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth;
        }
        
        // 确保菜单不会超出下边界
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight;
        }

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        document.body.appendChild(menu);
        this.setupMenuEvents(menu);
    }

    hideContextMenu() {
        // 清除主菜单
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // 清除所有子菜单
        const existingSubMenus = document.querySelectorAll('.context-submenu');
        existingSubMenus.forEach(submenu => {
            submenu.remove();
        });
    }

    setupMenuEvents(menu) {
        menu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const action = menuItem.dataset.action;
            if (!action) return;

            // 处理子菜单显示
            if (action === 'new') {
                e.stopPropagation(); // 阻止事件冒泡，防止主菜单关闭
                this.showNewMenu(menuItem);
                return;
            }

            // 处理其他菜单项点击
            switch (action) {
                case 'refresh':
                    window.location.reload();
                    break;
                case 'display':
                case 'personalize':
                    if (window.appManager && window.appManager.apps.get('settings')) {
                        window.appManager.apps.get('settings').launch();
                    }
                    break;
            }
            
            this.hideContextMenu();
        });

        // 添加鼠标悬停事件
        menu.addEventListener('mouseover', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const action = menuItem.dataset.action;
            if (action === 'new') {
                this.showNewMenu(menuItem);
            } else {
                // 如果鼠标移到其他菜单项，关闭子菜单
                this.hideSubMenu();
            }
        });
    }

    showNewMenu(parentItem) {
        this.hideSubMenu(); // 先清除现有子菜单

        const subMenu = document.createElement('div');
        subMenu.className = 'context-submenu';
        subMenu.innerHTML = `
            <div class="menu-item" data-action="new-folder">
                <span class="menu-icon">📁</span>
                <span class="menu-text">文件夹</span>
            </div>
            <div class="menu-item" data-action="new-text">
                <span class="menu-icon">📝</span>
                <span class="menu-text">文本文档</span>
            </div>
        `;

        const rect = parentItem.getBoundingClientRect();
        // 调整子菜单位置，确保不超出屏幕
        let left = rect.right;
        let top = rect.top;
        
        // 如果右侧空间不足，显示在左侧
        if (left + 200 > window.innerWidth) {
            left = rect.left - 200;
        }

        subMenu.style.left = `${left}px`;
        subMenu.style.top = `${top}px`;

        document.body.appendChild(subMenu);
        this.activeSubMenu = subMenu;

        // 为子菜单添加事件监听
        subMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const menuItem = e.target.closest('.menu-item');
            if (!menuItem) return;

            const action = menuItem.dataset.action;
            if (action) {
                this.handleNewMenuAction(action);
            }
            this.hideContextMenu();
        });

        // 子菜单鼠标移出事件
        subMenu.addEventListener('mouseleave', (e) => {
            // 检查鼠标是否移动到了主菜单
            const toElement = e.relatedTarget;
            if (!toElement?.closest('.context-menu')) {
                this.hideSubMenu();
            }
        });
    }

    hideSubMenu() {
        if (this.activeSubMenu) {
            this.activeSubMenu.remove();
            this.activeSubMenu = null;
        }
    }

    handleNewMenuAction(action) {
        switch (action) {
            case 'new-folder':
                console.log('Creating new folder');
                // 实现新建文件夹的逻辑
                break;
            case 'new-text':
                console.log('Creating new text document');
                // 实现新建文本文档的逻辑
                break;
        }
    }
} 