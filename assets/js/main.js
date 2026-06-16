document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
          var duration = 1400;
          var start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var value = target * progress;
            el.textContent = value.toFixed(decimals) + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toFixed(decimals) + suffix;
            }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ---------- Back to top click ---------- */
  var backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusBox = document.getElementById("form-status");

    function setError(fieldName, message) {
      var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
      if (errorEl) errorEl.textContent = message || "";
    }

    function validate() {
      var valid = true;
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var message = form.elements["message"].value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        setError("name", "Merci d'indiquer votre nom complet.");
        valid = false;
      } else {
        setError("name", "");
      }

      if (!emailPattern.test(email)) {
        setError("email", "Merci d'indiquer une adresse email valide.");
        valid = false;
      } else {
        setError("email", "");
      }

      if (phone.length > 0 && phone.replace(/[^0-9]/g, "").length < 6) {
        setError("phone", "Numéro de téléphone invalide.");
        valid = false;
      } else {
        setError("phone", "");
      }

      if (message.length < 10) {
        setError("message", "Votre message doit contenir au moins 10 caractères.");
        valid = false;
      } else {
        setError("message", "");
      }

      return valid;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        statusBox.className = "form-status error";
        statusBox.textContent = "Merci de corriger les champs en rouge avant d'envoyer votre message.";
        return;
      }

      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var program = form.elements["program"] ? form.elements["program"].value : "";
      var message = form.elements["message"].value.trim();

      var subject = "Nouvelle demande BodyProject - " + name;
      var bodyLines = [
        "Nom : " + name,
        "Email : " + email,
        "Téléphone : " + (phone || "Non renseigné"),
        "Programme souhaité : " + (program || "Non précisé"),
        "",
        "Message :",
        message,
      ];
      var body = bodyLines.join("\n");

      var mailtoUrl =
        "mailto:ptgym@contevittorio.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailtoUrl;

      statusBox.className = "form-status success";
      statusBox.textContent =
        "Votre messagerie va s'ouvrir pour envoyer votre demande à ptgym@contevittorio.com. Si rien ne s'ouvre, écrivez-nous directement à cette adresse.";
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
