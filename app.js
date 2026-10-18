
"use strict";

(() => {
  const config = window.APP_CONFIG;
  if (!config) {
    console.error("APP_CONFIG is missing. Check config.js.");
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const TZ = config.timeZone || "Asia/Kolkata";
  const PREFIX = "madeEasyPortal";

  const el = {
    clock: $("#digitalClock"),
    date: $("#currentDate"),
    themeToggle: $("#themeToggle"),
    themeIcon: $("#themeIcon"),
    total: $("#totalClasses"),
    available: $("#availableClasses"),
    completed: $("#completedClasses"),
    progressPercent: $("#progressPercent"),
    overallProgress: $("#overallProgressBar"),
    todayFocus: $("#todayFocus"),
    playerHeading: $("#playerHeading"),
    sessionStatus: $("#sessionStatus"),
    placeholder: $("#playerPlaceholder"),
    videoContainer: $("#videoContainer"),
    video: $("#mainVideo"),
    liveBadge: $("#liveNowBadge"),
    loading: $("#videoLoading"),
    videoTitle: $("#currentVideoTitle"),
    videoMeta: $("#currentVideoMeta"),
    completeButton: $("#completeSessionButton"),
    playerMessage: $("#playerMessage"),
    completionNotice: $("#completionNoticeText"),
    search: $("#classSearch"),
    subjectFilter: $("#subjectFilter"),
    statusFilter: $("#statusFilter"),
    classList: $("#classList"),
    scheduleCount: $("#scheduleCount"),
    emptySchedule: $("#emptySchedule"),
    dailyPercent: $("#dailyPercent"),
    dailyRing: $("#dailyRingProgress"),
    dailyMessage: $("#dailyMessage"),
    dailyCheckbox: $("#dailyCompletionCheckbox"),
    resetDaily: $("#resetDailyButton"),
    cpqList: $("#cpqList"),
    toast: $("#toast")
  };

  let todayKey = getDateKey();
  let selectedClassId = null;
  let player = null;
  let toastTimer = null;
  let messageTimer = null;

  const state = {
    completed: loadJSON(`${PREFIX}:completed:${todayKey}`, []),
    dailyDone: loadJSON(`${PREFIX}:dailyDone:${todayKey}`, false),
    theme: loadJSON(`${PREFIX}:theme`, "dark")
  };

  function loadJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Could not save local data:", error);
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function zonedParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);

    return Object.fromEntries(
      parts.filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value])
    );
  }

  function getDateKey() {
    const parts = zonedParts();
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function getCurrentMinutes() {
    const parts = zonedParts();
    return Number(parts.hour) * 60 + Number(parts.minute);
  }

  function getScheduledMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function getSubject(subjectId) {
    return config.subjects.find((subject) => subject.id === subjectId);
  }

  function getClass(classId) {
    return config.classes.find((item) => item.id === classId);
  }

  function isCompleted(classId) {
    return state.completed.includes(classId);
  }

  function getClassStatus(item) {
    if (isCompleted(item.id)) return "completed";
    if (!item.available || !item.vimeoId) return "unavailable";

    return getCurrentMinutes() < getScheduledMinutes(item.scheduledTime)
      ? "scheduled"
      : "available";
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  }

  function updateClock() {
    const now = new Date();

    el.clock.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).format(now);

    el.date.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: TZ,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(now);

    const currentDateKey = getDateKey();

    if (currentDateKey !== todayKey) {
      todayKey = currentDateKey;
      state.completed = loadJSON(`${PREFIX}:completed:${todayKey}`, []);
      state.dailyDone = loadJSON(`${PREFIX}:dailyDone:${todayKey}`, false);
      selectedClassId = null;
      resetPlayer();
      renderClasses();
      updateStats();
    }

    renderClasses();
    updateStats();
    updateLiveBadge();
  }

  function populateSubjectFilter() {
    el.subjectFilter.innerHTML =
      '<option value="all">All subjects</option>' +
      config.subjects.map((subject) =>
        `<option value="${escapeHTML(subject.id)}">${escapeHTML(subject.name)}</option>`
      ).join("");
  }

  function renderClasses() {
    const searchTerm = el.search.value.trim().toLowerCase();
    const subjectId = el.subjectFilter.value;
    const statusFilter = el.statusFilter.value;

    const filtered = config.classes.filter((item) => {
      const subject = getSubject(item.subjectId);
      const status = getClassStatus(item);

      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        (subject && subject.name.toLowerCase().includes(searchTerm));

      const matchesSubject = subjectId === "all" || item.subjectId === subjectId;
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesSubject && matchesStatus;
    });

    el.scheduleCount.textContent =
      `${filtered.length} ${filtered.length === 1 ? "CLASS" : "CLASSES"}`;

    el.emptySchedule.classList.toggle("hidden", filtered.length > 0);

    el.classList.innerHTML = filtered.map((item) => {
      const subject = getSubject(item.subjectId);
      const status = getClassStatus(item);
      const selected = selectedClassId === item.id;

      const statusText = {
        available: "Available",
        scheduled: "Scheduled",
        completed: "Completed",
        unavailable: "Coming soon"
      }[status];

      const actionText = {
        available: "Open class",
        scheduled: "Starts at " + formatTime(item.scheduledTime),
        completed: "Review class",
        unavailable: "Coming soon"
      }[status];

      const disabled = status === "scheduled" || status === "unavailable";

      return `
        <article class="class-card ${selected ? "selected" : ""} ${status}">
          <div class="class-time">
            <strong>${escapeHTML(formatTime(item.scheduledTime))}</strong>
            <span>${escapeHTML(subject ? subject.shortName : "CLASS")}</span>
          </div>
          <div class="class-details">
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            <span class="class-status status-${status}">
              <span class="status-dot"></span>${statusText}
            </span>
          </div>
          <button class="class-action" type="button"
            data-open-class="${escapeHTML(item.id)}" ${disabled ? "disabled" : ""}>
            ${escapeHTML(actionText)}
          </button>
        </article>
      `;
    }).join("");
  }

  function updateStats() {
    const total = config.classes.length;
    const available = config.classes.filter((item) => {
      const status = getClassStatus(item);
      return status === "available" || status === "completed";
    }).length;

    const completed = state.completed.length;
    const percentage = total ? Math.round(completed / total * 100) : 0;

    el.total.textContent = total;
    el.available.textContent = available;
    el.completed.textContent = completed;
    el.progressPercent.textContent = percentage;
    el.overallProgress.style.width = `${percentage}%`;
    el.dailyPercent.textContent = `${percentage}%`;

    const circumference = 2 * Math.PI * 51;
    el.dailyRing.style.strokeDasharray = String(circumference);
    el.dailyRing.style.strokeDashoffset =
      String(circumference * (1 - percentage / 100));

    if (state.dailyDone) {
      el.dailyMessage.textContent = "Well done! You've completed your study for today.";
      el.todayFocus.textContent = "Daily goal achieved";
    } else if (completed > 0) {
      el.dailyMessage.textContent = "Good start. Keep going with your next session.";
      el.todayFocus.textContent = "Keep the momentum";
    } else {
      el.dailyMessage.textContent = "Start your first session today.";
      el.todayFocus.textContent = "Stay consistent";
    }

    el.dailyCheckbox.checked = state.dailyDone;
    el.completionNotice.textContent = state.dailyDone
      ? "Today's study has been marked complete on this device."
      : "Your progress is saved on this device.";
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2800);
  }

  function showPlayerMessage(message, duration = 6000) {
    el.playerMessage.textContent = message;
    el.playerMessage.classList.remove("hidden");
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => el.playerMessage.classList.add("hidden"), duration);
  }

  function resetPlayer() {
    if (player) {
      try {
        player.destroy();
      } catch (error) {
        console.warn("Player cleanup:", error);
      }
    }

    player = null;
    el.video.src = "about:blank";
    el.videoContainer.classList.add("hidden");
    el.placeholder.classList.remove("hidden");
    el.loading.classList.add("hidden");
    el.liveBadge.classList.add("hidden");
  }

  function updateLiveBadge() {
    const item = selectedClassId ? getClass(selectedClassId) : null;
    const isLive = Boolean(
      item &&
      !state.dailyDone &&
      getClassStatus(item) === "available" &&
      !el.videoContainer.classList.contains("hidden")
    );

    el.liveBadge.classList.toggle("hidden", !isLive);
  }

  async function openVideo(classId) {
    const item = getClass(classId);
    if (!item) return;

    const status = getClassStatus(item);

    if (status === "scheduled") {
      showToast(`This class starts at ${formatTime(item.scheduledTime)} IST.`);
      return;
    }

    if (status === "unavailable") {
      showToast("This class is coming soon. Add its Vimeo ID in config.js.");
      return;
    }

    if (state.dailyDone) {
      showToast("Reset today's completion if you want to open another class.");
      return;
    }

    selectedClassId = item.id;
    renderClasses();

    const subject = getSubject(item.subjectId);
    el.playerHeading.textContent = item.title;
    el.videoTitle.textContent = item.title;
    el.videoMeta.textContent =
      `${subject ? subject.name : "Class"} · ${formatTime(item.scheduledTime)} IST`;

    el.sessionStatus.textContent = "OPENING CLASS";
    el.sessionStatus.className = "status-pill status-opening";
    el.completeButton.disabled = false;
    el.completeButton.innerHTML = isCompleted(item.id)
      ? "<span>✓</span> Completed"
      : "<span>✓</span> Mark session complete";

    el.placeholder.classList.add("hidden");
    el.videoContainer.classList.remove("hidden");
    el.loading.classList.remove("hidden");
    el.playerMessage.classList.add("hidden");
    updateLiveBadge();

    if (player) {
      try {
        await player.destroy();
      } catch (error) {
        console.warn("Player cleanup:", error);
      }
      player = null;
    }

    // controls=0 requests that Vimeo hide its standard controls.
    const videoUrl =
      `https://player.vimeo.com/video/${encodeURIComponent(item.vimeoId)}` +
      "?title=0&byline=0&portrait=0&controls=0&dnt=1";

    el.video.src = videoUrl;

    if (!window.Vimeo || !window.Vimeo.Player) {
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "CLASSROOM";
      updateLiveBadge();
      return;
    }

    player = new window.Vimeo.Player(el.video);

    player.on("loaded", () => {
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "CLASS READY";
      el.sessionStatus.className = "status-pill status-available";
      updateLiveBadge();
    });

    player.on("play", () => {
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "IN SESSION";
      el.sessionStatus.className = "status-pill status-available";
      updateLiveBadge();
    });

    player.on("pause", () => {
      el.sessionStatus.textContent = "PAUSED";
      el.sessionStatus.className = "status-pill";
    });

    player.on("ended", () => {
      el.sessionStatus.textContent = "SESSION ENDED";
      el.sessionStatus.className = "status-pill";
    });

    player.on("error", () => {
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "PLAYER ERROR";
      el.sessionStatus.className = "status-pill status-error";
      showPlayerMessage(
        "The video could not be loaded. Check its Vimeo ID, privacy settings, and embed permissions."
      );
    });

    try {
      await player.ready();
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "CLASS READY";
      el.sessionStatus.className = "status-pill status-available";
      updateLiveBadge();
    } catch (error) {
      el.loading.classList.add("hidden");
      el.sessionStatus.textContent = "CHECK VIDEO";
      el.sessionStatus.className = "status-pill status-error";
      showPlayerMessage(
        "Check that the Vimeo video exists and allows embedding on your website."
      );
    }
  }

  function markSelectedClassComplete() {
    if (!selectedClassId) {
      showToast("Select a class first.");
      return;
    }

    if (isCompleted(selectedClassId)) {
      showToast("This session is already marked complete.");
      return;
    }

    state.completed.push(selectedClassId);
    saveJSON(`${PREFIX}:completed:${todayKey}`, state.completed);

    el.completeButton.innerHTML = "<span>✓</span> Completed";
    renderClasses();
    updateStats();
    showToast("Session marked complete. Keep it up!");
  }

  function setDailyCompletion(done) {
    state.dailyDone = done;
    saveJSON(`${PREFIX}:dailyDone:${todayKey}`, done);

    if (done) {
      resetPlayer();
      selectedClassId = null;
      el.playerHeading.textContent = "Today's study is complete";
      el.videoTitle.textContent = "Great work today!";
      el.videoMeta.textContent = "Come back tomorrow to continue your progress.";
      el.sessionStatus.textContent = "DAY COMPLETE";
      el.sessionStatus.className = "status-pill status-available";
      el.completeButton.disabled = true;
      el.completeButton.innerHTML = "<span>✓</span> Mark session complete";
      showToast("Today's study has been marked complete.");
    } else {
      el.playerHeading.textContent = "Your learning session";
      el.videoTitle.textContent = "No class selected";
      el.videoMeta.textContent = "Choose a class from the schedule.";
      el.sessionStatus.textContent = "SELECT A CLASS";
      el.sessionStatus.className = "status-pill";
      el.completeButton.disabled = true;
      showToast("Daily completion has been reset.");
    }

    renderClasses();
    updateStats();
    updateLiveBadge();
  }

  function renderCPQ() {
    el.cpqList.innerHTML = config.cpqResources.map((resource) => `
      <a class="cpq-item"
         href="${escapeHTML(resource.file)}"
         target="_blank" rel="noopener noreferrer">
        <span class="pdf-icon">PDF</span>
        <span class="cpq-copy">
          <strong>${escapeHTML(resource.title)}</strong>
          <small>${escapeHTML(resource.description)}</small>
        </span>
        <span class="cpq-arrow" aria-hidden="true">↗</span>
      </a>
    `).join("");
  }

  function applyTheme(theme) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    el.themeIcon.textContent = state.theme === "dark" ? "☼" : "☾";
    el.themeToggle.setAttribute(
      "aria-label",
      state.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    saveJSON(`${PREFIX}:theme`, state.theme);
  }

  function bindEvents() {
    el.themeToggle.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });

    el.search.addEventListener("input", renderClasses);
    el.subjectFilter.addEventListener("change", renderClasses);
    el.statusFilter.addEventListener("change", renderClasses);

    el.classList.add("class-list-delegated");
    el.classList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-open-class]");
      if (button && !button.disabled) {
        openVideo(button.dataset.openClass);
      }
    });

    el.completeButton.addEventListener("click", markSelectedClassComplete);
    el.dailyCheckbox.addEventListener("change", (event) => {
      setDailyCompletion(event.target.checked);
    });
    el.resetDaily.addEventListener("click", () => setDailyCompletion(false));
  }

  function initialise() {
    applyTheme(state.theme);
    populateSubjectFilter();
    renderCPQ();
    renderClasses();
    updateStats();
    updateClock();
    bindEvents();

    // Recheck availability and the clock every 15 seconds.
    setInterval(updateClock, 15000);
  }

  initialise();
})();
