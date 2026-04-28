// 1. Барлық элементтерді тауып аламыз
let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginform = document.querySelector('.login-form-container');
let formclose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');

// 2. Скролл кезінде менюді жабу (бірақ іздеуге кедергі жасамайтындай)
window.onscroll = () =>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

// 3. Мобильді меню (Burger menu)
menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

// 5. Логин формасын ашу және жабу
formBtn.addEventListener('click', () => {
    loginform.classList.add('active');
});

formclose.addEventListener('click', () => {
    loginform.classList.remove('active');
});

// --- ЛОГИН ЛОГИКАСЫ (Валидация және атты шығару) ---
let loginSubmitBtn = document.querySelector('#login-submit-btn');

if(loginSubmitBtn) {
    loginSubmitBtn.onclick = (e) => {
        e.preventDefault();

        let emailInput = document.querySelector('.login-form-container input[type="email"]');
        let passwordInput = document.querySelector('.login-form-container input[type="password"]');

        if(emailInput.value === "" || passwordInput.value === "") {
            alert('Өтініш, пошта мен құпиясөзді толтырыңыз!');
            return;
        }

        // Атты алу және иконканы өзгерту
        let username = emailInput.value.split('@')[0];

        // Иконканы өшіріп, орнына атыңды жазу
        formBtn.classList.remove('fas', 'fa-user');
        formBtn.innerHTML = username;
        formBtn.style.fontSize = "1.6rem";
        formBtn.style.fontWeight = "bold";
        formBtn.style.color = "var(--orange)";

        loginform.classList.remove('active');
        alert('Қош келдіңіз, ' + username + '!');
    }
}

// --- 2. СЛАЙДЕРЛЕРДІ БАПТАУ ---

var homeSwiper = new Swiper(".home-slider", {
    loop: true,
    effect: "fade",
    grabCursor: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
});

// Пікірлер слайдері (swiperReview деп атадық)
var swiperReview = new Swiper(".review-slider", {
    spaceBetween: 20,
    loop: false,
    grabCursor: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
});

var brandSwiper = new Swiper(".brand-slider", {
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
    breakpoints: {
        450: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
    },
});

// --- 3. ПІКІР ҚОСУ ЖӘНЕ ЖҰЛДЫЗШАЛАР ЛОГИКАСЫ ---

const starElements = document.querySelectorAll('#input-stars i');
const starInput = document.querySelector('#star-value');
const reviewForm = document.querySelector('#add-review-form');
const reviewWrapper = document.querySelector('#review-wrapper');

// Жұлдызшаларды таңдау
starElements.forEach(star => {
    star.onclick = () => {
        const index = star.getAttribute('data-index');
        starInput.value = index;

        starElements.forEach(s => {
            if(s.getAttribute('data-index') <= index) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    };
});

// Жазып жатқанда слайдерді тоқтату
const userNameInput = document.querySelector('#user-name');
const userReviewInput = document.querySelector('#user-review');

if(userNameInput && userReviewInput) {
    [userNameInput, userReviewInput].forEach(input => {
        input.onfocus = () => swiperReview.autoplay.stop();
        input.onblur = () => swiperReview.autoplay.start();
    });
}

// Форманы жіберу (Submit)
if(reviewForm) {
    reviewForm.onsubmit = (e) => {
        e.preventDefault();

        let name = userNameInput.value;
        let text = userReviewInput.value;
        let rating = starInput.value;

        let starsHTML = '';
        for(let i = 0; i < 5; i++){
            starsHTML += (i < rating) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }

        let newSlide = document.createElement('div');
        newSlide.classList.add('swiper-slide', 'slide');
        newSlide.innerHTML = `
            <div class="box">
                <img src="images/pic-default.png" alt="">
                <h3>${name}</h3>
                <p>${text}</p>
                <div class="stars">${starsHTML}</div>
            </div>
        `;

        let formSlide = reviewForm.closest('.swiper-slide');
        reviewWrapper.insertBefore(newSlide, formSlide);

        // Жаңарту (Осы жерде swiperReview деп жаздық)
        swiperReview.update();
        let newIndex = Array.from(reviewWrapper.children).indexOf(newSlide);
        swiperReview.slideTo(newIndex);

        reviewForm.reset();
        starElements.forEach(s => s.classList.remove('active'));
        starInput.value = 5;
        alert('Керемет! Пікіріңіз қосылды.');
    };
}

// --- БАҒАНЫ ЕСЕПТЕУ ЖӘНЕ ОПЛАТА БӨЛІМІ ---

const bookingForm = document.querySelector('.book form');
const placeInput = document.querySelector('.book input[type="text"]');
const guestInput = document.querySelector('.book input[type="number"]');
const dateArriveInput = document.querySelectorAll('.book input[type="date"]')[0];
const dateLeaveInput = document.querySelectorAll('.book input[type="date"]')[1];
const phoneInput = document.getElementById('phone-input'); // HTML-де id="phone-input" болуы шарт!
const bookBtn = document.querySelector('.book .btn');

const tourPrices = {
    "мумбай": 2500,
    "токио": 2900,
    "париж": 4000,
    "сидней": 2800,
    "мысыр": 2800,
    "hawaii": 3000
};

function calculateTotal() {
    if (!placeInput.value || !guestInput.value) return;

    let place = placeInput.value.toLowerCase().trim();
    let guests = parseInt(guestInput.value) || 0;

    let start = new Date(dateArriveInput.value);
    let end = new Date(dateLeaveInput.value);
    let days = 1;

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        let diff = end.getTime() - start.getTime();
        days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days <= 0) days = 1;
    }

    let basePrice = tourPrices[place] || 2900;
    let extraPrice = 0;

    if (days > 3 && days <= 10) {
        extraPrice = (days - 3) * 100;
    } else if (days > 10) {
        extraPrice = 700 + (days - 10) * 200;
    }

    if (guests > 0) {
        let total = (basePrice + extraPrice) * guests;
        bookBtn.value = `Брондау (Жалпы: $${total})`;
    } else {
        bookBtn.value = `Қазір брондау`;
    }
}

// Пакеттерден толтыру
document.querySelectorAll('.packages .box .btn').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        let cityName = btn.parentElement.querySelector('h3').innerText;
        placeInput.value = cityName;
        window.location.href = '#book';
        calculateTotal();
    };
});

// Өзгерістерді тыңдау
[placeInput, guestInput, dateArriveInput, dateLeaveInput].forEach(input => {
    if (input) {
        input.addEventListener('input', calculateTotal);
    }
});

// ФОРМАНЫ ЖІБЕРУ ЖӘНЕ ОПЛАТА ШЫҒАРУ
if (bookingForm) {
    bookingForm.onsubmit = (e) => {
        e.preventDefault();

        let managerNumber = "77756582861";
        let clientPhone = phoneInput ? phoneInput.value : "Жазылмаған";
        let finalPrice = bookBtn.value;

        let message = `Жаңа брондау!%0A` +
                      `📍 Қайда: ${placeInput.value}%0A` +
                      `👥 Адам саны: ${guestInput.value}%0A` +
                      `📞 Клиент тел: ${clientPhone}%0A` +
                      `💰 ${finalPrice}`;

        // 1. WhatsApp-ты ашу
        window.open(`https://wa.me/${managerNumber}?text=${message}`, '_blank');

        // 2. ОПЛАТА ТЕРЕЗЕСІН ШЫҒАРУ (Осы жері өшіп қалған еді)
        Swal.fire({
            title: 'Өтініш қабылданды!',
            html: `
                <div style="text-align: left; font-size: 1.6rem;">
                    <p>✅ Менеджер жақын арада хабарласады.</p>
                    <p>💳 Төлемді <b>Kaspi Gold</b> арқылы жасауға болады:</p>
                    <a href="https://kaspi.kz/pay/_перевод" target="_blank"
                       style="display:block; background:#f14635; color:white; padding:1.2rem; text-align:center; border-radius:.5rem; text-decoration:none; margin-top:1.5rem; font-weight:bold; font-size:1.4rem;">
                       Kaspi-мен төлеу
                    </a>
                </div>`,
            icon: 'success',
            confirmButtonText: 'Жабу',
            confirmButtonColor: '#f39c12'
        });

        bookingForm.reset();
        bookBtn.value = `Қазір брондау`;
    };
}