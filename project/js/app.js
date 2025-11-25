const osName = "ArokenOS '98";
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#OS-Name').forEach(el => {
        el.textContent = osName;
    })
    openMainMenu();
    welcomeWindow();
});

// =============== STARTUP Windows start ==================

// main menu
function openMainMenu() {
    const content = `
    <div class="pixel-art">
      <div class="pixel-title">${osName}</div>
      
      <div>▓▓▓▒▒▒ RECEPTION ▒▒▒▓▓▓</div>
    </div>

    <div class="menu-buttons">
      <button class="pixel-btn" onclick="startTutorial()">
        ▶ ОБУЧЕНИЕ.EXE
      </button>
      <button class="pixel-btn" onclick="startGame()">
        ▶ ИГРАТЬ.EXE
      </button>
      <button class="pixel-btn" onclick="showAbout()">
        ▶ ОБО_МНЕ.TXT
      </button>
      <button class="pixel-btn donate-btn" onclick="openDonate()">
        💰 ДОНАТ.DAT
      </button>
    </div>

    <div class="copyright">
      © 1998 KHRUSHCHEV Corp. All rights reserved.<br>
      System: ${osName}/95 Compatible
    </div>
  `;

    createWindow(`${osName} — Главное меню`, content, {
        width: 640,
        height: 480,
        icon: './../img/icons/computer_explorer_2k-5.png'
    });
}


// welcome Window

function welcomeWindow() {
    const content = `
            <div class="window-content text-document hi-info">
                <div class="text-document__inner">
                    <p><strong>${osName} v1.0</strong></p>
                    <p>Вашему вниманию представлен симулятор ОС, сделанный по образу и подобию легендарной Windows 98
                    </p>
                    <br>
                    <p>Это <b title="SPA - Single Page Application"><span class="info-link">SPA</span></b>, полностью
                        масштабируемое и адаптивное.</p>
                    <br>
                    <p><b>Разработано с использованием:</b></p>
                    <p>• HTML5</p>
                    <p>• CSS3</p>
                    <p>• И чистом JavaScript</p>
                    <br>
                    <p>Перетаскивайте и закрывайте окна, проходите по <a href="#aboutStoryline"
                            class="info-link">сюжетной линии</a>, либо свободно капайтесь где душе угодно. Всё в ваших
                        руках!</p>
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

    createWindow(`${osName} — Добро пожаловать!`, content, {
        width: 440,
        height: 480,
        icon: './../img/icons/msg_information-2.png'
    });
}


// =============== STARTUP Windows end ==================


// Система перетаскивания окон
class WindowManager {
    constructor() {
        this.draggedWindow = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zIndex = 10;
        this.init();
    }

    init() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {
        // Проверяем, нажали ли на заголовок окна
        const titleBar = e.target.closest('.title-bar');
        if (!titleBar) return;

        const window = titleBar.closest('.window');
        if (!window) return;

        this.bringToFront(window);
        this.startDragging(window, e);
    }

    handleMouseMove(e) {
        if (!this.draggedWindow) return;

        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;

        // Ограничиваем перемещение в пределах экрана
        const maxX = window.innerWidth - this.draggedWindow.offsetWidth;
        const maxY = window.innerHeight - 100; // Учитываем панель задач

        this.draggedWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.draggedWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }

    handleMouseUp() {
        if (this.draggedWindow) {
            this.draggedWindow.classList.remove('dragging');
            this.draggedWindow = null;
        }
    }

    startDragging(window, e) {
        this.draggedWindow = window;
        this.draggedWindow.classList.add('dragging');

        const rect = window.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        // Отключаем выделение текста при перетаскивании
        e.preventDefault();
    }

    bringToFront(window) {
        this.zIndex++;
        window.style.zIndex = this.zIndex;
        window.classList.add('active');

        // Убираем активный класс у других окон
        document.querySelectorAll('.window').forEach(otherWindow => {
            if (otherWindow !== window) {
                otherWindow.classList.remove('active');
            }
        });
    }
}

// win manager 
const windowManager = new WindowManager();

// date and time update
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('clock').textContent = time;
}

setInterval(updateClock, 1000);
updateClock();

// menu functions
// function openAboutInfo() {
//     createWindow('Настройки', 'Информация о ArokenOS<br>Графика: 640x480<br>Разработчик: <a href="https://t.me/VLADIMIRNABOKOV">KHRUSHCHEV</a>');
// }
// js/apps.js — одна функция на все 50 приложений


const loadedScripts = {};
function loadScript(url) {
    if (loadedScripts[url]) {
        return Promise.resolve(); // Already loaded or loading
    }

    loadedScripts[url] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            delete loadedScripts[url];
            reject(new Error(`Не удалось загрузить скрипт: ${url}`));
        };
        document.head.appendChild(script);
    });
    return loadedScripts[url];
}


async function openApp(appName) {
    try {
        const response = await fetch(`apps/${appName}.json`);
        if (!response.ok) throw new Error('Файл не найден');

        const app = await response.json();

        const win = createWindow(
            app.title || 'Без названия',
            app.content || 'Пусто...',
            {
                width: app.width || 500,
                height: app.height || 400,
                icon: app.icon
            }
        );

        if (appName === 'doom') {
            const contentElement = win.querySelector('.window-content');
            if (contentElement) {
                contentElement.style.padding = '0';
                contentElement.style.overflow = 'hidden';
                contentElement.innerHTML = ''; 

                const iframe = document.createElement('iframe');
                iframe.src = 'doom.html'; 
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';

                contentElement.appendChild(iframe);
            }
        }

        // freelance-simulator
        if (appName === 'freelance-simulator') {
            const contentElement = win.querySelector('.window-content');
            if (contentElement) {
                contentElement.style.padding = '0';
                contentElement.style.overflow = 'hidden';
                contentElement.innerHTML = ''; // Очищаем содержимое

                const iframe = document.createElement('iframe');
                iframe.src = 'freelance-simulator.html'; 
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';

                contentElement.appendChild(iframe);
            }
        }


    } catch (err) {
        createWindow('Ошибка 404', `Приложение "${appName}" не найдено<br><br>Ошибка: ${err.message}`);
    }




}

function startTutorial() {
    createWindow('Обучение', '📚 Добро пожаловать в обучение!<br><br>• Используйте мышь для выбора<br>• Читайте диалоги внимательно<br>• Принимайте решения');
}

function startGame() {
    createWindow('Новелла', '🎮 Запуск новеллы...<br><br>Глава 1: Начало<br>Вы просыпаетесь в незнакомой комнате...');
}

function showAbout() {
    createWindow('О программе', '👨‍💻 Разработчик: Ваше имя<br>Версия: 1.0 (1998)<br>Лицензия: Freeware<br><br>Спасибо за игру!');
}

function openDonate() {
    createWindow('Поддержка', '💰 Поддержите разработку!<br><br>Если вам нравится игра,<br>вы можете сделать пожертвование.');
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'none';
    }
}
function expandWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window && !window.classList.contains('expanded')) {
        window.style.width = '100vw';
        window.style.height = '100vw';
        window.style.top = '0';
        window.style.left = '0';
        window.classList.add('expanded');
    } else if (window && window.classList.contains('expanded')) {
        window.style.width = '300px';
        window.style.height = 'auto';
        window.style.top = '100px';
        window.style.left = '100px';
        window.classList.remove('expanded');
    }
}

// function openMyComputer() {
//     createWindow('Мой компьютер', '🖥️ Дисководы:<br><br>C:\\ Системный диск (1.2GB свободно)<br>D:\\ Игры (800MB свободно)<br>E:\\ CD-ROM');
// }

// function openRecycleBin() {
//     createWindow('Корзина', '🗑️ Корзина пуста.<br><br>Общий размер: 0 байт');
// }

// function openNotepad() {
//     createWindow('Блокнот', '📄 Новый документ - Блокнот<br><br>Сегодня прекрасный день для создания новеллы!<br><br>Идеи для сюжета:<br>- Таинственный лес<br>- Загадочный город<br>- Космическое приключение');
// }

// Двойной клик по иконкам на рабочем столе
let lastClickTime = 0;
let lastClickedIcon = null;

document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', function (e) {
        const now = Date.now();
        const DOUBLE_CLICK_DELAY = 400; // миллисекунд — как в настоящей Windows

        // Снимаем выделение со всех
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));

        // Выделяем текущую
        this.classList.add('selected');

        // Проверяем — это двойной клик?
        if (lastClickedIcon === this && now - lastClickTime < DOUBLE_CLICK_DELAY) {
            const appName = this.dataset.app;
            openApp(appName); // ← твоя функция из предыдущего сообщения!

            // Сбрасываем, чтобы не срабатывало трижды
            lastClickTime = 0;
        } else {
            lastClickTime = now;
            lastClickedIcon = this;
        }
    });
});



function toggleStartMenu() {
    alert('[Start Menu]\nПрограммы\nДокументы\nНастройки\nСправка\nВыполнить...\nЗавершение работы...');
}

function toggleVolumeControl() {
    const masterVolumeBtn = document.getElementById('master-volume');
    if (!masterVolumeBtn) return;

    masterVolumeBtn.classList.toggle('master-volume--open');

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

// ========================= ALERT CONTROLS LINE =========================
function volumeHelpAlertClose() {
    const volumeHelpAlert = document.querySelector('.master-volume__help-alert');
    volumeHelpAlert.classList.add('master-volume__help-alert--closed');
    localStorage.setItem('volumeHelpAlertClosed', 'true');
}
document.addEventListener('DOMContentLoaded', () => {
    const volumeHelpAlert = document.querySelector('.master-volume__help-alert');
    let isClosed = localStorage.getItem('volumeHelpAlertClosed')
    if (isClosed === 'true') {
        volumeHelpAlert.classList.add('master-volume__help-alert--closed');
    }
});


// ========================= ALERT CONTROLS LINE =========================
// =======================================================================


// create new window func
let windowCounter = 0;

function createWindow(title, content, options = {}) {
    windowCounter++;
    const id = `win_${Date.now()}_${windowCounter}`;

    const width = options.width || 500;
    const height = options.height || 400;
    const icon = options.icon || 'icons/app.png';

    // Центрируем с небольшим смещением
    const left = 50 + (windowCounter * 40) % 400;
    const top = 50 + (windowCounter * 30) % 300;

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
  `;

    // Сохраняем оригинальный размер для кнопки "восстановить"
    win.dataset.origWidth = width;
    win.dataset.origHeight = height;
    win.dataset.origLeft = left;
    win.dataset.origTop = top;

    win.innerHTML = `
    <div class="title-bar">
      <div class="title-icon"><img src="${icon}" width="16" height="16"></div>
      <div class="title-text">${title}</div>
      <div class="window-controls">
        <div class="control-btn minimize-btn">_</div>
        <div class="control-btn maximize-btn" onclick="toggleMaximize('${id}')">□</div>
        <div class="control-btn close-btn" onclick="closeWindow('${id}')">×</div>
      </div>
    </div>
    <div class="window-content">${content}</div>
  `;

    document.querySelector('.desktop').appendChild(win);

    // Анимация появления
    requestAnimationFrame(() => {
        win.style.opacity = '1';
        win.style.transform = 'translateY(0)';
    });

    windowManager.bringToFront(win);
    return win;
}

// Закрытие окна — удаляем из DOM
function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.opacity = '0';
        win.style.transform = 'scale(0.9)';
        setTimeout(() => win.remove(), 200);
    }
}

// Развернуть/свернуть окно
function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        // Возвращаем оригинальный размер
        win.classList.remove('maximized');
        win.style.width = win.dataset.origWidth + 'px';
        win.style.height = win.dataset.origHeight + 'px';
        win.style.left = win.dataset.origLeft + 'px';
        win.style.top = win.dataset.origTop + 'px';
        win.style.top = win.dataset.origTop + 'px';
    } else {
        // Сохраняем текущие координаты как оригинальные (на случай повторного открытия)
        win.dataset.origLeft = win.offsetLeft;
        win.dataset.origTop = win.offsetTop;
        win.dataset.origWidth = win.offsetWidth;
        win.dataset.origHeight = win.offsetHeight;

        win.classList.add('maximized');
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 28px)'; // учитываем панель задач
        win.style.left = '0';
        win.style.top = '0';
    }
}

// write text animation
document.addEventListener('DOMContentLoaded', function () {

    // const title = document.querySelector('.pixel-title');
    // const text = title.textContent;
    // title.textContent = '';

    // let i = 0;
    // function typeWriter() {
    //     if (i < text.length) {
    //         title.textContent += text.charAt(i);
    //         i++;
    //         setTimeout(typeWriter, 100);
    //     }
    // }
    // typeWriter();

    // animate document title 

    // const originalTitle = document.title;  if you want to use document title in html doc.
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

});

// PROLADER ANIMATION EP
let isAudioUnlocked = false;

function unlockAudioAndPlayStartup() {
    if (isAudioUnlocked) return;
    isAudioUnlocked = true;

    // Разблокируем AudioContext (если используешь Web Audio API)
    if (window.audioContext && audioContext.state !== 'running') {
        audioContext.resume();
    }

    // Play startup sound
    const startup = new Audio('./../audio/systemSounds/microsoft-windows-98-startup.mp3');
    startup.volume = 0.5;
    startup.play().catch(() => console.log("sound play blocked"));

}

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('win98-bootloader');
    const fill = document.getElementById('progress-fill');

    if (!loader) return;

    let progress = 0;
    const duration = 8000;
    // const interval = 700;
    const interval = 10;

    const timer = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress > 100) progress = 100;
        fill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(timer);

            // alert
            loader.innerHTML += `
        <div class="boot-hint">
          Нажмите ENTER, или на экран, чтобы войти в ArokenOS
        </div>
      `;

            const activate = () => {
                unlockAudioAndPlayStartup();
                loader.style.opacity = '0';
                loader.style.transform = 'scale(0.95)';
                setTimeout(() => loader.remove(), 600);


                document.removeEventListener('click', activate);
                document.removeEventListener('touchstart', activate);
                document.removeEventListener('keydown', activate);
            };

            document.addEventListener('click', activate, { once: true });
            document.addEventListener('touchstart', activate, { once: true });
            document.addEventListener('keydown', activate, { once: true });
        }
    }, interval);
});