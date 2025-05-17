// Анимация элементов при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('main > *');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 1s';
            el.style.opacity = '1';
        }, 300 + index * 200);
    });

    // Эффект для кнопок меню
    const menuItems = document.querySelectorAll('.sidebar a');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.textShadow = '0 0 10px #ff5555';
        });
        item.addEventListener('mouseleave', () => {
            item.style.textShadow = 'none';
        });
    });
});

// Анимация сетки с реверсом каждые 10 секунд
const grid = document.querySelector('.grid');
let isReversed = false;

function toggleAnimation() {
    isReversed = !isReversed;
    grid.style.animationDirection = isReversed ? 'reverse' : 'normal';
}

setInterval(toggleAnimation, 10000); // Меняем направление каждые 10 сек

document.addEventListener('DOMContentLoaded', () => {
    // Анимация загрузки
    const elements = document.querySelectorAll('main > *');
    elements.forEach((el, i) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s';
            el.style.opacity = '1';
        }, 100 * i);
    });

    // Меню
    const menuItems = document.querySelectorAll('.sidebar a');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.textShadow = '0 0 8px #ff5555';
        });
        item.addEventListener('mouseleave', () => {
            item.style.textShadow = 'none';
        });
    });

    // Сетка
    const grid = document.querySelector('.grid');
    let reverse = false;
    setInterval(() => {
        reverse = !reverse;
        grid.style.animationDirection = reverse ? 'reverse' : 'normal';
    }, 10000);
});

// Модальное окно для фото
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.photo-frame img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Слайдер
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 10000; // 6 секунд

    // Функция показа слайда
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Автоматическое переключение
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Навигация по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideTimer);
            showSlide(index);
            slideTimer = setInterval(nextSlide, slideInterval);
        });
    });

    // Запуск автоматического переключения
    let slideTimer = setInterval(nextSlide, slideInterval);

    // Пауза при наведении
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideTimer = setInterval(nextSlide, slideInterval);
    });

    // Инициализация первого слайда
    showSlide(0);
});
// Проверка прав администратора
const adminDoc = await getDoc(doc(db, "admins", user.uid));
if (adminDoc.exists()) {
    adminPanelBtn.style.display = 'block';
    console.log("Права администратора подтверждены"); // Добавьте для отладки
} else {
    console.log("Пользователь не является администратором"); // Добавьте для отладки
}
// Остальной существующий код...