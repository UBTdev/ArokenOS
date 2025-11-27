
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
document.querySelector('.desktop').addEventListener('click', function (e) {
    // e.target - это элемент, по которому кликнули.
    // Если это сам рабочий стол, то снимаем выделение.
    if (e.target === this) {
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