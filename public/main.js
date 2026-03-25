/* ════════════════════════════════════════════════════
   ABDULLA HANI — PORTFOLIO  |  main.js
   Handles: cursor · nav scroll · reveal · photo upload · feedback form
════════════════════════════════════════════════════ */

/* ── 1. Custom Cursor ─────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Ring lags behind for smooth trailing effect
  function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale dot on interactive elements
  document.addEventListener("mouseover", (e) => {
    const tag = e.target.tagName;
    const isInteractive = ["A", "BUTTON", "INPUT", "TEXTAREA", "LABEL"].includes(tag);
    dot.style.transform = isInteractive
      ? `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(2.2)`
      : `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
})();


/* ── 2. Navigation — scroll state + mobile toggle ── */
(function initNav() {
  const nav    = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links  = nav.querySelector(".nav-links");

  // Sticky style on scroll
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Mobile menu toggle
  if (toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      links.classList.toggle("open");
    });
  }

  // Close mobile menu when a link is clicked
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      links.classList.remove("open");
    });
  });
})();


/* ── 3. Scroll Reveal ─────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();



/* ── 5. Feedback Form → POST /api/feedback ────────── */
(function initFeedbackForm() {
  const submitBtn  = document.getElementById("submitBtn");
  const responseEl = document.getElementById("responseMsg");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", async () => {
    const name    = document.getElementById("f-name").value.trim();
    const email   = document.getElementById("f-email").value.trim();
    const message = document.getElementById("f-msg").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showResponse("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showResponse("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        showResponse(data.message || "Message sent — thank you!", "success");
        // Clear fields on success
        document.getElementById("f-name").value    = "";
        document.getElementById("f-email").value   = "";
        document.getElementById("f-msg").value     = "";
      } else {
        showResponse(data.error || "Something went wrong. Try again.", "error");
      }
    } catch (err) {
      showResponse("Could not reach the server. Check your connection.", "error");
    }

    setLoading(false);
  });

  // ── Helpers ──────────────────────────────────────

  function showResponse(text, type) {
    responseEl.textContent = text;
    responseEl.className   = "response-msg " + type;
  }

  function setLoading(isLoading) {
    submitBtn.disabled     = isLoading;
    submitBtn.textContent  = isLoading ? "Sending…" : "Send Message";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
