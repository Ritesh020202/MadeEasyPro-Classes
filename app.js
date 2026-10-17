
/* MADE EASY — PRO | Vanilla JavaScript, GitHub Pages friendly */
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const state = {
    section: "home",
    videoClass: null,
    player: null,
    toastTimer: null,
    idleTimer: null
  };

  const todayKey = () => {
    const d = new Date();
    return `mepro-completed-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };

  const timeNow = () => new Date();

  const formatTime = (value) => {
    const [h, m] = value.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const isCompletedToday = () =>
    localStorage.getItem(todayKey()) === "yes";

  const markCompleted = () => {
    localStorage.setItem(todayKey(), "yes");
    updateDailyCompletion();
    renderStats();
    showToast("Today's session marked complete. Keep going!");
  };

  function classState(c) {
    if (!c.available || !String(c.vimeoId || "").trim()) {
      return "unavailable";
    }

    const [h, m] = c.scheduledTime.split(":").map(Number);
    const scheduled = new Date();
    scheduled.setHours(h, m, 0, 0);

    return timeNow() < scheduled ? "scheduled" : "available";
  }

  function statusLabel(c) {
    const s = classState(c);

    if (s === "available") {
      return '<span class="status-dot"></span> Available now';
    }

    if (s === "scheduled") {
      return `<span class="status-dot warn"></span> Scheduled · ${formatTime(c.scheduledTime)}`;
    }

    return '<span class="status-dot off"></span> Video not configured';
  }

  function classCard(c) {
    const status = classState(c);
    const playable = status === "available";
    const canSchedule = status === "scheduled";

    return `<article class="class-card">
      <button class="card-thumb ${playable ? "playable" : ""}"
        ${playable ? `data-play="${escapeHTML(c.id)}"` : "disabled"}
        aria-label="${playable ? "Watch" : "Class"} ${escapeHTML(c.title)}">
        <span class="thumb-index">${escapeHTML(c.subjectId || "ME").toUpperCase()}</span>
        <span class="play-symbol">${playable ? "▶" : canSchedule ? "◷" : "—"}</span>
        <span class="thumb-caption">${playable ? "WATCH SESSION" : canSchedule ? "UPCOMING CLASS" : "COMING SOON"}</span>
      </button>

      <div class="class-body">
        <div class="card-kicker">${escapeHTML(c.subject)}</div>
        <h3>${escapeHTML(c.title)}</h3>
        <p>${escapeHTML(c.description)}</p>
        <div class="status-line">${statusLabel(c)}</div>
        <div class="class-card-bottom">
          <span>${formatTime(c.scheduledTime)}</span>
          ${playable ? `<button class="mini-link" data-play="${escapeHTML(c.id)}">Open class ↗</button>` : ""}
        </div>
      </div>
    </article>`;
  }

  function featureCard(c, large = false) {
    const status = classState(c);

    return `<article class="feature-card ${large ? "feature-large" : ""}">
      <div class="feature-top">
        <span class="subject-tag">${escapeHTML(c.subject)}</span>
        <span class="live-badge ${status !== "available" ? "upcoming" : ""}">
          <i></i>${status === "available" ? "AVAILABLE" : status === "scheduled" ? "UPCOMING" : "IN PREPARATION"}
        </span>
      </div>

      <div>
        <div class="feature-number">${escapeHTML(c.id.toUpperCase())}</div>
        <h3>${escapeHTML(c.title)}</h3>
        <p>${escapeHTML(c.description)}</p>
      </div>

      <div class="card-footer">
        <span>${status === "available" ? "Ready when you are" : `Starts at ${formatTime(c.scheduledTime)}`}</span>
        ${status === "available"
          ? `<button class="watch-btn" data-play="${escapeHTML(c.id)}">Watch class <span>→</span></button>`
          : `<span class="scheduled-label">Scheduled</span>`}
      </div>
    </article>`;
  }

  function renderHome() {
    const usable = SITE_CONFIG.classes.filter(
      c => classState(c) !== "unavailable"
    );

    $("#featuredGrid").innerHTML = usable.length
      ? usable.slice(0, 2).map((c, i) => featureCard(c, i === 0)).join("")
      : '<div class="empty-state">Add classes and Vimeo IDs in config.js to begin.</div>';

    $("#classGrid").innerHTML =
      SITE_CONFIG.classes.slice(0, 3).map(classCard).join("");
  }

  function renderAllClasses() {
    const q = ($("#classSearch")?.value || "").trim().toLowerCase();
    const subject = $("#subjectFilter")?.value || "all";

    const list = SITE_CONFIG.classes.filter(c =>
      (subject === "all" || c.subjectId === subject) &&
      `${c.title} ${c.subject} ${c.description}`.toLowerCase().includes(q)
    );

    $("#allClassGrid").innerHTML = list.length
      ? list.map(classCard).join("")
      : '<div class="empty-state">No classes match your search.</div>';
  }

  function renderSchedule() {
    $("#scheduleList").innerHTML = [...SITE_CONFIG.classes]
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
      .map(c => {
        const s = classState(c);

        return `<div class="schedule-row">
          <div class="schedule-time">${formatTime(c.scheduledTime)}</div>
          <div class="schedule-detail">
            <span>${escapeHTML(c.subject)}</span>
            <strong>${escapeHTML(c.title)}</strong>
            <small>${escapeHTML(c.description)}</small>
          </div>
          <div class="schedule-status ${s}">
            ${s === "available" ? "● Available now" : s === "scheduled" ? "Scheduled" : "Not configured"}
          </div>
        </div>`;
      }).join("");
  }

  function renderCPQ() {
    $("#cpqSubjects").innerHTML = (SITE_CONFIG.cpq || [])
      .map(subject => `<section class="cpq-subject">
        <button class="cpq-subject-header" type="button" aria-expanded="false">
          <span>${escapeHTML(subject.subject)}</span>
          <span class="chevron">⌄</span>
        </button>

        <div class="cpq-sets">
          ${(subject.sets || []).map(set => `
            <div class="cpq-set">
              <span class="cpq-set-name">${escapeHTML(set.name)}</span>
              <button class="small-btn" data-resource="${escapeHTML(set.pdf)}">Open PDF ↗</button>
            </div>
          `).join("")}
        </div>
      </section>`)
      .join("");

    $$(".cpq-subject-header").forEach(btn => {
      btn.addEventListener("click", () => {
        const parent = btn.closest(".cpq-subject");
        parent.classList.toggle("expanded");

        btn.setAttribute(
          "aria-expanded",
          parent.classList.contains("expanded") ? "true" : "false"
        );
      });
    });
  }

  function renderStats() {
    $("#statTotal").textContent = SITE_CONFIG.classes.length;

    $("#statAvailable").textContent =
      SITE_CONFIG.classes.filter(c => classState(c) === "available").length;

    $("#statSubjects").textContent =
      new Set(SITE_CONFIG.classes.map(c => c.subjectId)).size;

    $("#statProgress").textContent =
      isCompletedToday() ? "100%" : "0%";
  }

  function updateDailyCompletion() {
    const checked = isCompletedToday();

    $("#dailyComplete").checked = checked;

    $("#completionLabel").textContent = checked
      ? "Today's session is complete"
      : "Mark today's session complete";

    $("#dailyMessage").textContent = checked
      ? "You have already completed your session today. Keep going!"
      : "Small, steady effort builds lasting mastery.";

    $("#dailyComplete").disabled = checked;
  }

  function updateClock() {
    const d = timeNow();

    $("#clockDay").textContent = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    $("#clockTime").textContent = d.toLocaleTimeString("en-IN", {
      hour12: true
    });

    renderStats();
    renderHome();
    renderSchedule();
    renderAllClasses();
  }

  function switchSection(section) {
    state.section = section;

    $$(".content-section").forEach(el => {
      el.classList.toggle("hidden", el.id !== section);
    });

    $$(".nav-item[data-section]").forEach(el => {
      el.classList.toggle("active", el.dataset.section === section);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCPQ() {
    $("#cpqDrawer").classList.add("open");
    $("#drawerBackdrop").classList.add("open");
    $("#cpqDrawer").setAttribute("aria-hidden", "false");
  }

  function closeCPQ() {
    $("#cpqDrawer").classList.remove("open");
    $("#drawerBackdrop").classList.remove("open");
    $("#cpqDrawer").setAttribute("aria-hidden", "true");
  }

  function showToast(message) {
    const t = $("#toast");
    t.textContent = message;
    t.classList.add("show");

    clearTimeout(state.toastTimer);

    state.toastTimer = setTimeout(() => {
      t.classList.remove("show");
    }, 2600);
  }

  function resetProgressIdle() {
    $("#progressWrap").classList.remove("idle-hidden");

    clearTimeout(state.idleTimer);

    state.idleTimer = setTimeout(() => {
      $("#progressWrap").classList.add("idle-hidden");
    }, 2500);
  }

  function setProgress(percent) {
    const p = Math.max(0, Math.min(100, percent || 0));

    $("#videoProgress").style.width = `${p}%`;
    $("#progressText").textContent = `${Math.round(p)}%`;
  }

  function destroyPlayer() {
    clearTimeout(state.idleTimer);

    if (state.player) {
      try {
        state.player.unload();
      } catch (_) {}

      state.player = null;
    }

    $("#mainVideo").src = "about:blank";
    $("#videoModal").classList.remove("open");
    $("#progressWrap").classList.remove("idle-hidden");

    setProgress(0);
  }

  function openVideo(id) {
    const c = SITE_CONFIG.classes.find(item => item.id === id);

    if (!c || classState(c) !== "available") {
      showToast("This class is not available yet.");
      return;
    }

    if (!/^\d+$/.test(String(c.vimeoId || ""))) {
      showToast("Add a valid Vimeo video ID in config.js.");
      return;
    }

    if (state.player) {
      try {
        state.player.unload();
      } catch (_) {}

      state.player = null;
    }

    state.videoClass = c;

    $("#videoTitle").textContent = c.title;
    $("#videoMeta").textContent =
      `${c.subject} · Scheduled ${formatTime(c.scheduledTime)}`;

    $("#videoStatus").textContent = "RECORDED CLASSROOM";
    $("#videoFooterStatus").textContent =
      "Vimeo session · Progress updates while playing";

    $("#videoModal").classList.add("open");
    $("#videoPlaceholder").classList.remove("hidden");

    $("#mainVideo").src =
      `https://player.vimeo.com/video/${encodeURIComponent(c.vimeoId)}?title=0&byline=0&portrait=0&dnt=1`;

    resetProgressIdle();

    if (window.Vimeo && window.Vimeo.Player) {
      state.player = new Vimeo.Player($("#mainVideo"));

      state.player.ready()
        .then(() => $("#videoPlaceholder").classList.add("hidden"))
        .catch(() => showToast(
          "Vimeo could not load this video. Check its privacy settings."
        ));

      state.player.on("timeupdate", data => {
        if (data.duration) setProgress(data.percent * 100);
      });

      state.player.on("play", () => {
        $("#videoFooterStatus").textContent =
          "Now playing · Progress updates automatically";

        resetProgressIdle();
      });

      state.player.on("pause", () => {
        $("#videoFooterStatus").textContent =
          "Paused · Resume when ready";

        resetProgressIdle();
      });

      state.player.on("ended", () => {
        setProgress(100);

        $("#videoFooterStatus").textContent =
          "Session finished · Well done";

        showToast(
          "Class finished. Mark today's session complete when ready."
        );
      });

      state.player.on("error", () => {
        $("#videoFooterStatus").textContent =
          "Video unavailable · Check Vimeo privacy and embed settings";
      });
    } else {
      $("#videoPlaceholder").classList.add("hidden");
    }
  }

  function openResource(file) {
    if (!file) {
      showToast("This PDF has not been configured yet.");
      return;
    }

    window.open(file, "_blank", "noopener,noreferrer");
  }

  document.addEventListener("click", e => {
    const play = e.target.closest("[data-play]");

    if (play) {
      openVideo(play.dataset.play);
      return;
    }

    const resource = e.target.closest("[data-resource]");

    if (resource) {
      openResource(resource.dataset.resource);
      return;
    }

    const nav = e.target.closest("[data-section]");

    if (nav) {
      switchSection(nav.dataset.section);
      return;
    }

    const go = e.target.closest("[data-go]");

    if (go) {
      switchSection(go.dataset.go);
      return;
    }
  });

  $("#cpqOpen").addEventListener("click", openCPQ);
  $("#heroCpq").addEventListener("click", openCPQ);
  $("#cpqClose").addEventListener("click", closeCPQ);
  $("#drawerBackdrop").addEventListener("click", closeCPQ);
  $("#videoClose").addEventListener("click", destroyPlayer);

  $("#videoModal").addEventListener("click", e => {
    if (e.target === $("#videoModal")) destroyPlayer();
  });

  $("#continueBtn").addEventListener("click", () => {
    const c = SITE_CONFIG.classes.find(
      x => classState(x) === "available"
    );

    c
      ? openVideo(c.id)
      : showToast("No class is available right now. Check the schedule.");
  });

  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");

    const light = document.body.classList.contains("light");

    $("#themeToggle").textContent = light ? "☀" : "☾";

    localStorage.setItem("me-theme", light ? "light" : "dark");
  });

  $("#dailyComplete").addEventListener("change", e => {
    if (e.target.checked) markCompleted();
  });

  $("#markWatched").addEventListener("click", markCompleted);

  $("#classSearch").addEventListener("input", renderAllClasses);
  $("#subjectFilter").addEventListener("change", renderAllClasses);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCPQ();
      destroyPlayer();
    }
  });

  ["mousemove", "pointerdown", "keydown", "touchstart"].forEach(event => {
    $("#videoFrame").addEventListener(event, resetProgressIdle, {
      passive: true
    });
  });

  if (localStorage.getItem("me-theme") === "light") {
    document.body.classList.add("light");
    $("#themeToggle").textContent = "☀";
  }

  const subjectFilter = $("#subjectFilter");

  const subjectOptions = [
    ...new Map(SITE_CONFIG.classes.map(c => [c.subjectId, c.subject])).entries()
  ];

  subjectFilter.insertAdjacentHTML(
    "beforeend",
    subjectOptions.map(([id, name]) =>
      `<option value="${escapeHTML(id)}">${escapeHTML(name)}</option>`
    ).join("")
  );

  $("#yearNow").textContent = new Date().getFullYear();

  renderCPQ();
  updateDailyCompletion();
  updateClock();

  setInterval(updateClock, 30000);
})();
