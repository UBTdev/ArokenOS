document.addEventListener('DOMContentLoaded', () => {
    const masterVolume = document.getElementById('masterVolume');
    const allMedia = document.querySelectorAll('audio, video');

    // Функция для установки громкости
    function setVolume(volume) {
        allMedia.forEach(media => {
            media.volume = volume;
        });
    }

    // Загружаем громкость из localStorage или устанавливаем по умолчанию
    const savedVolume = localStorage.getItem('masterVolume');
    if (savedVolume !== null) {
        masterVolume.value = savedVolume;
        setVolume(savedVolume);
    } else {
        setVolume(masterVolume.value);
    }

    // Обработчик изменения слайдера
    masterVolume.addEventListener('input', () => {
        const volume = masterVolume.value;
        setVolume(volume);
        localStorage.setItem('masterVolume', volume);
    });

    // Наблюдатель за добавлением новых медиа-элементов в DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
                    node.volume = masterVolume.value;
                }
                // Также проверяем дочерние элементы, если был добавлен контейнер
                if (node.querySelectorAll) {
                    node.querySelectorAll('audio, video').forEach(media => {
                        media.volume = masterVolume.value;
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Функция для открытия окна настроек (если ее еще нет)
function openSettings() {
    const settingsWindow = document.getElementById('settingsWindow');
    if (settingsWindow) {
        settingsWindow.style.display = 'block';
    }
}

// Функция для закрытия окон (если ее еще нет)
function closeWindow(windowId) {
    const windowToClose = document.getElementById(windowId);
    if (windowToClose) {
        windowToClose.style.display = 'none';
    }
}