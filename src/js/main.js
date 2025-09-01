import "../css/style.css";
import Swiper from "swiper";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  class App {
    constructor() {
      this.header = document.querySelector(".header");
      this.workSection = document.querySelector(".work");
      this.steps = document.querySelector(".steps");
      this.logo = document.querySelector(".logo-element");
      this.achievementNumbers = document.querySelectorAll(".achievements__number");
      this.portfolioContent = document.querySelector(".portfolio__content");
      this.reviewsContent = document.querySelector(".reviews__content");
      this.body = document.querySelector("body");

      this.initSwiper();
      this.initListeners();
      this.initObservers();
      this.initPhoneMask();
    }

    initSwiper() {
      if (document.querySelector(".team__swiper.swiper")) {
        new Swiper(".team__swiper.swiper", {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: { nextEl: ".swiper-button-next--team", prevEl: ".swiper-button-prev--team" },
          breakpoints: { 991.98: { spaceBetween: 20, slidesPerView: 3 } },
          pagination: { el: ".swiper-pagination--team", clickable: true, dynamicBullets: true },
        });
      }

      if (document.querySelector(".partners__swiper.swiper")) {
        new Swiper(".partners__swiper.swiper", {
          slidesPerView: 2,
          spaceBetween: 20,
          navigation: { nextEl: ".swiper-button-next--partners", prevEl: ".swiper-button-prev--partners" },
          breakpoints: { 991.98: { spaceBetween: 20, slidesPerView: 3 } },
          pagination: { el: ".swiper-pagination--partners", clickable: true, dynamicBullets: true },
        });
      }

      if (document.querySelector(".portfolio__swiper.swiper")) {
        const swiperElement = new Swiper(".portfolio__swiper.swiper", {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: { nextEl: ".swiper-button-next--portfolio", prevEl: ".swiper-button-prev--portfolio" },
          breakpoints: { 991.98: { spaceBetween: 20, slidesPerView: 2 } },
          lazy: true, // Увімкнення лінивого завантаження
          preloadImages: false, // Не завантажувати всі зображення відразу
          watchSlidesVisibility: true,
          autoplay: {
            // Правильний варіант
            delay: 3000, // Автоперемикання кожні 3 секунди
            disableOnInteraction: true, // Автоплей не вимикається при взаємодії
          },
          pagination: { el: ".swiper-pagination--portfolio", clickable: true, dynamicBullets: true },
        });
        // Зупинка автоплей при наведенні
        this.portfolioContent.addEventListener("mouseenter", () => swiperElement.autoplay.stop());

        // Відновлення автоплей при знятті курсору
        this.portfolioContent.addEventListener("mouseleave", () => swiperElement.autoplay.start());
      }

      if (document.querySelector(".reviews__swiper.swiper")) {
        const swiperElement = new Swiper(".reviews__swiper.swiper", {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: { nextEl: ".swiper-button-next--reviews", prevEl: ".swiper-button-prev--reviews" },
          breakpoints: { 991.98: { spaceBetween: 20, slidesPerView: 3 } },
          autoplay: {
            // Правильний варіант
            delay: 3000, // Автоперемикання кожні 3 секунди
            disableOnInteraction: true, // Автоплей не вимикається при взаємодії
          },
          pagination: { el: ".swiper-pagination--reviews", clickable: true, dynamicBullets: true },
        });

        // Зупинка автоплей при наведенні
        this.reviewsContent.addEventListener("mouseenter", () => swiperElement.autoplay.pause());

        // Відновлення автоплей при знятті курсору
        this.reviewsContent.addEventListener("mouseleave", () => swiperElement.autoplay.start());
      }
    }

    createObserver(target, callback, threshold = 0.5) {
      if (!target) return;

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback(entry.target);
              observer.unobserve(entry.target); // Спостерігаємо тільки один раз
            }
          });
        },
        { threshold }
      );

      observer.observe(target);
    }
    initObservers() {
      // Спостерігач для блоку з кроками
      this.createObserver(this.workSection, () => this.activateSteps(), 0.4);

      // Спостерігач для логотипу
      this.createObserver(this.logo, (el) => el.classList.add("in-view"), 0.5);

      this.createObserver(document.querySelector(".achievements__info"), () => this.animateNumbers(), 0.15);
    }

    anchorHandler(e) {
      try {
        const menu = document.querySelector("header .menu__body");
        const v = 0.2;
        if (menu.classList.contains("active")) {
          this.toggleMenu();
        }
        const w = window.pageYOffset;

        const blockId = e.getAttribute("href").substring(1),
          scrollTarget = document.getElementById(blockId),
          t = scrollTarget.getBoundingClientRect().top;
        let start = null;

        requestAnimationFrame(step);

        function step(time) {
          if (start == null) start = time;

          let progress = time - start,
            r = t < 0 ? Math.max(w - progress / v, w + t) : Math.min(w + progress / v, w + t);

          window.scrollTo(0, r);

          if (r != w + t) {
            requestAnimationFrame(step);
          } else {
            location.hash = "#" + blockId;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    initPhoneMask() {
      try {
        let input = document.querySelector(".form__input--phone");
        let codeInput = document.querySelector("#country_code");

        if (!input) return;

        // Ініціалізація intl-tel-input
        let iti = window.intlTelInput(input, {
          initialCountry: "ua",
          separateDialCode: true,
          placeholderNumberType: "none",
          placeholder: "",
        });

        let mask;

        function updateMask() {
          let itiUtils = window.intlTelInput.utils; // Отримуємо утиліти

          let countryData = iti.getSelectedCountryData();
          if (!countryData) return;

          // Отримуємо приклад номера для країни
          let exampleNumber = itiUtils.getExampleNumber(countryData.iso2, false, itiUtils.numberFormat.INTERNATIONAL);

          let numberWithoutDialCode = exampleNumber.replace(new RegExp(`^\\+${countryData.dialCode}\\s*`), "");

          // Створюємо маску для IMask
          let maskPattern = numberWithoutDialCode
            .replace(/\s+/g, "-") // Заміняємо пробіли на дефіси
            .replace(/\d/g, "0");

          if (mask) mask.destroy(); // Видаляємо стару маску
          mask = window.IMask(input, {
            mask: maskPattern,
            lazy: false,
          }); // Створюємо нову маску
          codeInput.value = countryData.dialCode;
        }

        // Оновлюємо маску при зміні країни
        input.addEventListener("countrychange", updateMask);

        // Викликаємо після ініціалізації
        setTimeout(updateMask, 500);
      } catch (error) {
        console.error("Помилка в телефонній масці:", error);
      }
    }

    animateNumbers() {
      this.achievementNumbers.forEach((el) => {
        let target = parseInt(el.getAttribute("data-target"));
        let isYears = el.getAttribute("data-target").includes("15"); // Якщо це "років", додаємо текст
        let step = Math.ceil(target / 100); // Крок анімації
        let count = 0;

        let interval = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          el.textContent = isYears ? `${count} років` : count + "+";
        }, 30);
      });
    }

    initListeners() {
      try {
        window.addEventListener("click", (e) => {
          if (e.target.closest(".header__burger")) {
            this.toggleMenu();
          }
          if (e.target.closest(".anchor")) {
            e.preventDefault();
            this.anchorHandler(e.target);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    toggleMenu() {
      document.querySelector(".header__burger").classList.toggle("active");
      document.querySelector("header .menu__body").classList.toggle("active");
      document.body.classList.toggle("body--lock");
    }
    activateSteps() {
      try {
        this.steps.classList.add("active");
      } catch (error) {
        console.log(error);
      }
    }
  }

  new App();
});
