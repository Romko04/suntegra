import "../css/style.css";
import Swiper from "swiper";
import "swiper/css";

import "../components/quis/quis.js";

document.addEventListener("DOMContentLoaded", () => {
  class App {
    constructor() {
      this.header = document.querySelector(".header");

      this.initSwiper();
      this.initListeners();
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
  }

  new App();
});
