// Квіз-попап логіка
(function () {
  function initCasePopups() {
    const moreBtns = document.querySelectorAll(".popup__btn[data-popup]");

    let popup = null;

    moreBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const attribute = btn.getAttribute("data-popup");
        popup = document.querySelector(attribute);

        e.preventDefault();
        popup.classList.add("active");
        document.body.classList.add("body--lock");

        // Close popup on click outside or on close button
        if (popup) {
          popup.addEventListener("click", (e) => {
            if (e.target.closest(".popup__close") || !e.target.closest(".popup__content")) {
              popup.classList.remove("active");
              document.body.classList.remove("body--lock");
            }
          });
        }
      });
    });
  }

  initCasePopups();

  const popup = document.querySelector(".popup--quis");
  if (!popup) return;

  const form = popup.querySelector(".quis-form");
  const steps = Array.from(form.querySelectorAll(".quis__step"));
  const stepsWrap = form.querySelector(".quis__steps");
  const thanks = form.querySelector(".quis__thanks");
  let currentStep = 0;
  let isAnimating = false;

  function setStepsHeight() {
    const active = steps.find((s) => s.classList.contains("quis__step--active"));
    if (active) {
      stepsWrap.style.height = active.offsetHeight + "px";
    }
  }

  function showStep(idx) {
    if (isAnimating) return;
    const prevStep = steps[currentStep];
    if (prevStep && prevStep.classList.contains("quis__step--active")) {
      prevStep.classList.remove("quis__step--active");
      prevStep.classList.add("quis__step--leaving");
      isAnimating = true;
      setTimeout(() => {
        prevStep.classList.remove("quis__step--leaving");
        steps[idx].classList.add("quis__step--active");
        setStepsHeight();
        isAnimating = false;
      }, 150);
    } else {
      steps[idx].classList.add("quis__step--active");
      setStepsHeight();
    }
    thanks.style.display = "none";
    currentStep = idx;
  }

  function showThanks() {
    const title = popup.querySelector(".quis__title");

    title.style.display = "none";
    steps.forEach((step) => step.classList.remove("quis__step--active", "quis__step--leaving"));
    thanks.style.display = "flex";
    stepsWrap.style.height = "auto";
  }

  // Далі
  form.addEventListener("click", function (e) {
    if (e.target.classList.contains("quis__next")) {
      e.preventDefault();
      // Валідація для radio
      const activeStep = steps[currentStep];
      const radios = activeStep.querySelectorAll('input[type="radio"]');
      if (radios.length) {
        let checked = false;
        radios.forEach((r) => {
          if (r.checked) checked = true;
        });
        if (!checked) {
          activeStep.classList.add("quis__step--error");
          return;
        } else {
          activeStep.classList.remove("quis__step--error");
        }
      }
      if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    }
    // Назад
    if (e.target.classList.contains("quis__prev")) {
      e.preventDefault();
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    }
  });

  // Відправка форми (імітація для CF7)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Тут можна додати інтеграцію з CF7 через AJAX, якщо потрібно
    showThanks();

    setTimeout(() => {
      popup.classList.remove("active");
      document.body.classList.remove("body--lock");
      // Показати попап подяки, якщо є
    }, 4000);
  });

  // Початковий стан
  steps.forEach((step, i) => {
    step.classList.remove("quis__step--active", "quis__step--leaving");
    if (i === 0) step.classList.add("quis__step--active");
  });

  setStepsHeight();
  thanks.style.display = "none";

  // Підлаштовувати висоту при ресайзі
  window.addEventListener("resize", setStepsHeight);
})();
