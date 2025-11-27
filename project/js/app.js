
const osName = "ArokenOS '98";

// Главный объект приложения
const ArokenOS = {
    windowCounter: 0,
    loadedScripts: {},
    isAudioUnlocked: false,

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setOSName();
            this.initWindowManager();
            this.initClock();
            // this.imitStartMenuIcons();
            this.initDesktopIcons();
            this.initVolumeAlert();
            this.initPreloader();
            this.welcomeWindow();
        });
    },

    // Установка имени ОС во всех элементах
    setOSName() {
        document.querySelectorAll('#OS-Name').forEach(el => {
            el.textContent = osName;
        });
    },

    // Инициализация менеджера окон
    initWindowManager() {
        this.windowManager = new WindowManager();
    },

    // Обновление времени
    initClock() {
        function updateClock() {
            const now = new Date();
            const time = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const clockElement = document.getElementById('clock');
            if (clockElement) {
                clockElement.textContent = time;
            }
        }

        setInterval(updateClock, 1000);
        updateClock();
    },
    // start menu
    // imitStartMenuIcons() {
    //     const startMenuIcons = document.querySelectorAll('.menu-item');
    //     startMenuIcons.forEach(item => {
    //         if (!item.id == 'start-icon') return;
    //         item.addEventListener('click', (e) => {
    //             const appName = e.target.dataset.app;
    //             ArokenOS.openApp(appName);
    //         })
    //     })
    //     console.log('sctipt hase been inited')
    // },
    

    // Обработчики для иконок рабочего стола
    initDesktopIcons() {
        let lastClickTime = 0;
        let lastClickedIcon = null;

        document.querySelectorAll('#desktop-icon').forEach(icon => {
            icon.addEventListener('click', function (e) {
                e.stopPropagation();
                const now = Date.now();
                const DOUBLE_CLICK_DELAY = 400;

                // Снимаем выделение со всех
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));

                // Выделяем текущую
                this.classList.add('selected');

                // Проверяем двойной клик
                if (lastClickedIcon === this && now - lastClickTime < DOUBLE_CLICK_DELAY) {
                    const appName = this.dataset.app;
                    ArokenOS.openApp(appName);

                    lastClickTime = 0;
                    lastClickedIcon = null;
                } else {
                    lastClickTime = now;
                    lastClickedIcon = this;
                }
            });
        }
        );


        // Снятие выделения при клике вне иконок
        document.querySelector('.desktop').addEventListener('click', function (e) {
            if (e.target === this) {
                document.querySelectorAll('.desktop-icon.selected').forEach(icon => {
                    icon.classList.remove('selected');
                    icon.classList.remove('focused');
                });
                lastClickedIcon = null;
            }
        });
    },

    // Управление уведомлением о громкости
    initVolumeAlert() {
        document.addEventListener('DOMContentLoaded', () => {
            const volumeHelpAlert = document.querySelector('.master-volume__help-alert');
            const isClosed = localStorage.getItem('volumeHelpAlertClosed');
            if (isClosed === 'true' && volumeHelpAlert) {
                volumeHelpAlert.classList.add('master-volume__help-alert--closed');
            }
        });
    },

    // Прелоадер
    initPreloader() {
        const loader = document.getElementById('win98-bootloader');
        if (!loader) return;

        const fill = document.getElementById('progress-fill');
        let progress = 0;
        const duration = 8000;
        const interval = 10;

        const timer = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress > 100) progress = 100;
            if (fill) fill.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(timer);

                loader.innerHTML += `
                    <div class="boot-hint">
                        Нажмите ENTER, или на экран, чтобы войти в ArokenOS
                    </div>
                `;

                const activate = () => {
                    this.unlockAudioAndPlayStartup();
                    loader.style.opacity = '0';
                    loader.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (loader.parentNode) {
                            loader.parentNode.removeChild(loader);
                        }
                    }, 600);

                    document.removeEventListener('click', activate);
                    document.removeEventListener('touchstart', activate);
                    document.removeEventListener('keydown', activate);
                };

                document.addEventListener('click', activate, { once: true });
                document.addEventListener('touchstart', activate, { once: true });
                document.addEventListener('keydown', activate, { once: true });
            }
        }, interval);
    },

    // Разблокировка аудио
    unlockAudioAndPlayStartup() {
        if (this.isAudioUnlocked) return;
        this.isAudioUnlocked = true;

        if (window.audioContext && audioContext.state !== 'running') {
            audioContext.resume();
        }

        const startup = new Audio('./../audio/systemSounds/microsoft-windows-98-startup.mp3');
        startup.volume = 0.5;
        startup.play().catch(() => console.log("Sound play blocked"));
    },

    // Загрузка скриптов
    async loadScript(url) {
        if (this.loadedScripts[url]) {
            return Promise.resolve();
        }

        this.loadedScripts[url] = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => {
                delete this.loadedScripts[url];
                reject(new Error(`Не удалось загрузить скрипт: ${url}`));
            };
            document.head.appendChild(script);
        });

        return this.loadedScripts[url];
    },

    // Открытие приложения
    async openApp(appName) {
        try {
            document.body.classList.add('loading-cursor');
            const response = await fetch(`apps/${appName}.json`);
            if (!response.ok) throw new Error('Файл не найден');

            const app = await response.json();
            await new Promise(resolve => setTimeout(resolve, 2000));
            document.body.classList.remove('loading-cursor');

            const win = this.createWindow(
                app.title || 'Без названия',
                app.content || 'Пусто...',
                {
                    width: app.width || 500,
                    height: app.height || 400,
                    icon: app.icon
                }
            );



            // Приложения для открытия в iframe
            const iframeApps = [
                'doom',
                'freelance-simulator',
                'support',
                'live-on-credit',
                'internet-explorer',
                'minecraft'
            ];

            if (iframeApps.includes(appName)) {
                const contentElement = win.querySelector('.window-content');
                if (contentElement) {
                    contentElement.style.padding = '0';
                    contentElement.style.overflow = 'hidden';
                    contentElement.innerHTML = '';

                    const iframe = document.createElement('iframe');
                    iframe.src = `${appName}.html`;
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = 'none';

                    contentElement.appendChild(iframe);
                }
            }

        } catch (err) {
            this.createWindow('Ошибка 404', `Приложение "${appName}" не найдено<br><br>Ошибка: ${err.message}`);
        }
    },


    // Создание окна
    createWindow(title, content, options = {}) {
        this.windowCounter++;
        const id = `win_${Date.now()}_${this.windowCounter}`;

        const width = options.width || 500;
        const height = options.height || 400;
        const icon = options.icon || 'icons/app.png';

        const left = 50 + (this.windowCounter * 40) % 400;
        const top = 50 + (this.windowCounter * 30) % 300;

        const win = document.createElement('div');
        win.className = 'window';
        win.id = id;
        win.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${left}px;
            top: ${top}px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.2s, transform 0.2s;
            min-width: 200px;
            min-height: 150px;
        `;

        // Сохраняем оригинальные параметры
        win.dataset.origWidth = width;
        win.dataset.origHeight = height;
        win.dataset.origLeft = left;
        win.dataset.origTop = top;

        win.innerHTML = `
            <div class="title-bar">
                <div class="title-icon"><img src="${icon}" width="16" height="16" alt="${title}"></div>
                <div class="title-text">${title}</div>
                <div class="window-controls">
                    <div class="control-btn minimize-btn">_</div>
                    <div class="control-btn maximize-btn" onclick="ArokenOS.toggleMaximize('${id}')">□</div>
                    <div class="control-btn close-btn" onclick="ArokenOS.closeWindow('${id}')">×</div>
                </div>
            </div>
            <div class="window-content">${content}</div>
            <!-- Элементы для изменения размера -->
            <div class="resize-handle resize-n"></div>
            <div class="resize-handle resize-e"></div>
            <div class="resize-handle resize-s"></div>
            <div class="resize-handle resize-w"></div>
            <div class="resize-handle resize-ne"></div>
            <div class="resize-handle resize-se"></div>
            <div class="resize-handle resize-sw"></div>
            <div class="resize-handle resize-nw"></div>
        `;

        document.querySelector('.desktop').appendChild(win);

        // Анимация появления
        requestAnimationFrame(() => {
            win.style.opacity = '1';
            win.style.transform = 'translateY(0)';
        });

        this.windowManager.bringToFront(win);
        return win;
    },



    // Закрытие окна с удалением из DOM
    closeWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.opacity = '0';
            win.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (win.parentNode) {
                    win.parentNode.removeChild(win);
                }
            }, 200);
        }
    },

    // Развернуть/свернуть окно
    toggleMaximize(id) {
        const win = document.getElementById(id);
        if (!win) return;

        if (win.classList.contains('maximized')) {
            // Возвращаем оригинальный размер
            win.classList.remove('maximized');
            win.style.width = win.dataset.origWidth + 'px';
            win.style.height = win.dataset.origHeight + 'px';
            win.style.left = win.dataset.origLeft + 'px';
            win.style.top = win.dataset.origTop + 'px';
            win.style.resize = 'both';
        } else {
            // Сохраняем текущие координаты
            win.dataset.origLeft = win.offsetLeft;
            win.dataset.origTop = win.offsetTop;
            win.dataset.origWidth = win.offsetWidth;
            win.dataset.origHeight = win.offsetHeight;

            win.classList.add('maximized');
            win.style.width = '100vw';
            win.style.height = 'calc(100vh - 28px)';
            win.style.left = '0';
            win.style.top = '0';
            win.style.resize = 'none';
        }
    },

    // Окно приветствия
    welcomeWindow() {
        const content = `
            <div class="window-content text-document hi-info">
                <div class="text-document__inner">
                    <p><strong>${osName} v1.0</strong></p>
                    <p>Вашему вниманию представлен симулятор ОС, сделанный по образу и подобию легендарной Windows 98</p>
                    <br>
                    <p>Это <b title="SPA - Single Page Application"><span class="info-link">SPA</span></b>, полностью масштабируемое и адаптивное.</p>
                    <br>
                    <p><b>Разработано с использованием:</b></p>
                    <p>• HTML5</p>
                    <p>• CSS3</p>
                    <p>• И чистом JavaScript</p>
                    <br>
                    <p>Перетаскивайте и закрывайте окна, проходите по <a href="#aboutStoryline" class="info-link">сюжетной линии</a>, либо свободно капайтесь где душе угодно. Всё в ваших руках!</p>
                    <br>
                    <p><b> Приятного времяпровождения!</b></p>
                    <br><br><br>
                    <b>Cюжетная линия:</b>
                    <p id="aboutStoryline">
                        Чтобы начать сюжетную линию, обратите внимание на рабочий стол и нажмите на кнопку
                        <i>"ОБУЧЕНИЕ.EXE"</i>. Там вы узнаете всю необходимую информацию.
                    </p>
                </div>
            </div>
        `;

        this.createWindow(`${osName} — Добро пожаловать!`, content, {
            width: 440,
            height: 480,
            icon: './../img/icons/msg_information-2.png'
        });
    }
};

// Система перетаскивания и изменения размера окон
class WindowManager {
    constructor() {
        this.draggedWindow = null;
        this.resizingWindow = null;
        this.resizeDirection = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.zIndex = 10;
        this.init();
    }

    init() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {
        // Проверяем изменение размера
        const resizeHandle = e.target.closest('.resize-handle');
        if (resizeHandle) {
            this.startResizing(resizeHandle, e);
            return;
        }

        // Проверяем перетаскивание за заголовок
        const titleBar = e.target.closest('.title-bar');
        if (!titleBar) return;

        const window = titleBar.closest('.window');
        if (!window) return;

        this.bringToFront(window);
        this.startDragging(window, e);
    }

    handleMouseMove(e) {
        if (this.draggedWindow) {
            this.handleDragging(e);
        } else if (this.resizingWindow) {
            this.handleResizing(e);
        }
    }

    handleMouseUp() {
        if (this.draggedWindow) {
            this.draggedWindow.classList.remove('dragging');
            this.draggedWindow = null;
        }

        if (this.resizingWindow) {
            this.resizingWindow.classList.remove('resizing');
            this.resizingWindow = null;
            this.resizeDirection = null;
            document.body.style.cursor = 'default';
        }
    }

    // Перетаскивание окна
    startDragging(window, e) {
        this.draggedWindow = window;
        this.draggedWindow.classList.add('dragging');

        const rect = window.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        e.preventDefault();
    }

    handleDragging(e) {
        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;

        const maxX = window.innerWidth - this.draggedWindow.offsetWidth;
        const maxY = window.innerHeight - 100;

        this.draggedWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.draggedWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }

    // Изменение размера окна
    startResizing(handle, e) {
        const window = handle.closest('.window');
        if (!window) return;

        this.resizingWindow = window;
        this.resizeDirection = handle.className.replace('resize-handle ', '');
        this.resizingWindow.classList.add('resizing');

        const rect = window.getBoundingClientRect();
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startLeft = rect.left;
        this.startTop = rect.top;

        // Устанавливаем курсор в зависимости от направления
        document.body.style.cursor = this.getResizeCursor(this.resizeDirection);

        e.preventDefault();
        e.stopPropagation();
    }

    handleResizing(e) {
        if (!this.resizingWindow) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;

        const minWidth = 200;
        const minHeight = 150;

        // Обрабатываем изменение размера в зависимости от направления
        switch (this.resizeDirection) {
            case 'resize-e':
                newWidth = Math.max(minWidth, this.startWidth + deltaX);
                break;
            case 'resize-w':
                newWidth = Math.max(minWidth, this.startWidth - deltaX);
                newLeft = this.startLeft + deltaX;
                break;
            case 'resize-s':
                newHeight = Math.max(minHeight, this.startHeight + deltaY);
                break;
            case 'resize-n':
                newHeight = Math.max(minHeight, this.startHeight - deltaY);
                newTop = this.startTop + deltaY;
                break;
            case 'resize-se':
                newWidth = Math.max(minWidth, this.startWidth + deltaX);
                newHeight = Math.max(minHeight, this.startHeight + deltaY);
                break;
            case 'resize-sw':
                newWidth = Math.max(minWidth, this.startWidth - deltaX);
                newHeight = Math.max(minHeight, this.startHeight + deltaY);
                newLeft = this.startLeft + deltaX;
                break;
            case 'resize-ne':
                newWidth = Math.max(minWidth, this.startWidth + deltaX);
                newHeight = Math.max(minHeight, this.startHeight - deltaY);
                newTop = this.startTop + deltaY;
                break;
            case 'resize-nw':
                newWidth = Math.max(minWidth, this.startWidth - deltaX);
                newHeight = Math.max(minHeight, this.startHeight - deltaY);
                newLeft = this.startLeft + deltaX;
                newTop = this.startTop + deltaY;
                break;
        }

        // Применяем изменения
        this.resizingWindow.style.width = newWidth + 'px';
        this.resizingWindow.style.height = newHeight + 'px';
        this.resizingWindow.style.left = newLeft + 'px';
        this.resizingWindow.style.top = newTop + 'px';

        // Обновляем оригинальные размеры
        this.resizingWindow.dataset.origWidth = newWidth;
        this.resizingWindow.dataset.origHeight = newHeight;
    }

    getResizeCursor(direction) {
        const cursors = {
            'resize-n': 'n-resize',
            'resize-e': 'e-resize',
            'resize-s': 's-resize',
            'resize-w': 'w-resize',
            'resize-ne': 'ne-resize',
            'resize-se': 'se-resize',
            'resize-sw': 'sw-resize',
            'resize-nw': 'nw-resize'
        };
        return cursors[direction] || 'default';
    }

    bringToFront(window) {
        this.zIndex++;
        window.style.zIndex = this.zIndex;
        window.classList.add('active');

        document.querySelectorAll('.window').forEach(otherWindow => {
            if (otherWindow !== window) {
                otherWindow.classList.remove('active');
            }
        });
    }
}

// Глобальные функции для HTML атрибутов
function toggleStartMenu() {
    alert('[Start Menu]\nПрограммы\nДокументы\nНастройки\nСправка\nВыполнить...\nЗавершение работы...');
}

function toggleVolumeControl() {
    const masterVolumeBtn = document.getElementById('master-volume');
    if (masterVolumeBtn) {
        masterVolumeBtn.classList.toggle('master-volume--open');
    }
}

function volumeHelpAlertClose() {
    const volumeHelpAlert = document.querySelector('.master-volume__help-alert');
    if (volumeHelpAlert) {
        volumeHelpAlert.classList.add('master-volume__help-alert--closed');
        localStorage.setItem('volumeHelpAlertClosed', 'true');
    }
}


const desktop = document.querySelector('.desktop');
const desktopIcons = document.querySelectorAll('.desktop-icon');

function unfocusAllIcons() {
    desktopIcons.forEach(icon => icon.classList.remove('focused'));
}

desktopIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
        event.stopPropagation();
        unfocusAllIcons();
        icon.classList.add('focused');
    });
});

// Снятие выделения при клике вне иконок
// const desktopIcons
document.addEventListener('click', function (e) {
    e.stopImmediatePropagation
    // e.target - это элемент, по которому кликнули.
    // Если это сам рабочий стол, то снимаем выделение.
    if (e.target !== desktopIcons) {
        document.querySelectorAll('.desktop-icon.selected').forEach(icon => {
            icon.classList.remove('selected');
            icon.classList.remove('focused');
        });
        lastClickedIcon = null; // Сбрасываем последнюю кликнутую иконку
    }
});

    const originalTitle = osName;
    document.title = 'loading...';
    setTimeout(() => {
        document.title = '';
        let titleIndex = 0;
        let titleLength = originalTitle.length;
        function animateTitle() {
            if (titleIndex <= titleLength) {
                document.title += originalTitle.charAt(titleIndex);
                titleIndex++;
                setTimeout(animateTitle, 200);
            }
        }
        animateTitle()
    }, 8000);


// Инициализация приложения
ArokenOS.init();