/* =========================================================
   MADE EASY - PRO
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {

  currentSection:
    "home",

  videoClass:
    null

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ =
  selector =>
    document.querySelector(selector);


const $$ =
  selector =>
    [...document.querySelectorAll(selector)];


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeSite
);


function initializeSite() {

  setupNavigation();

  setupCPQ();

  setupVideo();

  setupCustomVideoControls();

  setupTheme();

  setupButtons();

  renderEverything();

  updateClock();

  setInterval(
    updateClock,
    1000
  );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

  renderStats();

  renderHome();

  renderAllClasses();

  renderSchedule();

  renderCPQ();

}


/* =========================================================
   DATE / TIME
========================================================= */

function getNow() {

  return new Date();

}


function parseTime(
  timeString
) {

  if (!timeString) {

    return new Date();

  }


  const parts =
    String(timeString)
      .split(":")
      .map(Number);


  const hours =
    Number.isFinite(parts[0])
      ? parts[0]
      : 0;


  const minutes =
    Number.isFinite(parts[1])
      ? parts[1]
      : 0;


  const date =
    new Date();


  date.setHours(
    hours,
    minutes,
    0,
    0
  );


  return date;

}


function formatTime(
  timeString
) {

  if (!timeString) {

    return "—";

  }


  const parts =
    String(timeString)
      .split(":")
      .map(Number);


  const hours =
    parts[0] || 0;


  const minutes =
    parts[1] || 0;


  const suffix =
    hours >= 12
      ? "PM"
      : "AM";


  const displayHour =
    hours % 12 || 12;


  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;

}


function getTodayLabel() {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      year:
        "numeric"
    }
  ).format(
    getNow()
  );

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

  const now =
    getNow();


  const day =
    $("#clockDay");


  const time =
    $("#clockTime");


  if (day) {

    day.textContent =
      now.toLocaleDateString(
        "en-IN",
        {
          weekday:
            "short",

          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric"
        }
      );

  }


  if (time) {

    time.textContent =
      now.toLocaleTimeString(
        "en-IN",
        {
          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",

          hour12:
            true
        }
      );

  }


  renderStats();

  renderHome();

}


/* =========================================================
   CLASS STATUS
========================================================= */

function getClassStatus(
  classItem
) {

  if (
    !classItem ||
    !classItem.available ||
    !classItem.videoFile
  ) {

    return {

      type:
        "unavailable",

      label:
        "Video unavailable"

    };

  }


  const now =
    getNow();


  const scheduled =
    parseTime(
      classItem.scheduledTime
    );


  if (
    now < scheduled
  ) {

    return {

      type:
        "scheduled",

      label:
        `Scheduled for ${formatTime(
          classItem.scheduledTime
        )}`

    };

  }


  return {

    type:
      "available",

    label:
      "LIVE / AVAILABLE"

  };

}


/* =========================================================
   CLASS COLLECTIONS
========================================================= */

function getAvailableClasses() {

  return (
    SITE_CONFIG.classes ||
    []
  ).filter(
    item =>
      getClassStatus(item).type !==
      "unavailable"
  );

}


function getPlayableClasses() {

  return (
    SITE_CONFIG.classes ||
    []
  ).filter(
    item =>
      getClassStatus(item).type ===
      "available"
  );

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStats() {

  const classes =
    Array.isArray(
      SITE_CONFIG.classes
    )
      ? SITE_CONFIG.classes
      : [];


  const available =
    getAvailableClasses();


  const upcoming =
    classes
      .filter(
        item =>
          getClassStatus(item).type ===
          "scheduled"
      )
      .sort(
        (a, b) =>
          parseTime(a.scheduledTime) -
          parseTime(b.scheduledTime)
      )[0];


  const classCount =
    $("#classCount");


  const availableCount =
    $("#availableCount");


  const nextClass =
    $("#nextClass");


  const heroDate =
    $("#heroDate");


  if (classCount) {

    classCount.textContent =
      classes.length;

  }


  if (availableCount) {

    availableCount.textContent =
      available.length;

  }


  if (nextClass) {

    nextClass.textContent =
      upcoming
        ? formatTime(
            upcoming.scheduledTime
          )
        : "—";

  }


  if (heroDate) {

    heroDate.textContent =
      getTodayLabel();

  }

}


/* =========================================================
   FEATURE CARD
========================================================= */

function createFeatureCard(
  classItem,
  large = false
) {

  const status =
    getClassStatus(
      classItem
    );


  if (
    status.type ===
    "unavailable"
  ) {

    return "";

  }


  const live =
    status.type ===
    "available";


  return `

    <article
      class="feature-card ${large ? "large" : ""}"
    >

      <div>

        <div class="feature-top">

          <span class="subject-tag">
            ${escapeHTML(
              classItem.subject
            )}
          </span>


          ${
            live
              ? `
                <span class="live-badge">
                  <span></span>
                  LIVE
                </span>
              `
              : `
                <span class="subject-tag">
                  UPCOMING
                </span>
              `
          }

        </div>


        <h3>
          ${escapeHTML(
            classItem.title
          )}
        </h3>


        <p>
          ${escapeHTML(
            classItem.description ||
            ""
          )}
        </p>

      </div>


      <div class="card-footer">

        <span class="time-label">

          ${
            live
              ? "Available now"
              : `Starts at ${formatTime(
                  classItem.scheduledTime
                )}`
          }

        </span>


        ${
          live
            ? `
              <button
                class="watch-btn"
                type="button"
                data-video-id="${escapeHTML(
                  classItem.id
                )}"
              >
                Watch class →
              </button>
            `
            : `
              <button
                class="watch-btn disabled"
                type="button"
                disabled
              >
                Scheduled
              </button>
            `
        }

      </div>

    </article>

  `;

}


/* =========================================================
   CLASS CARD
========================================================= */

function createClassCard(
  classItem
) {

  const status =
    getClassStatus(
      classItem
    );


  const available =
    status.type ===
    "available";


  const scheduled =
    status.type ===
    "scheduled";


  return `

    <article class="class-card">


      ${
        available
          ? `
            <div
              class="card-thumb"
              data-video-id="${escapeHTML(
                classItem.id
              )}"
            >

              <div class="play-symbol">
                ▶
              </div>

            </div>
          `
          : scheduled
            ? `
              <div class="card-thumb">

                <div
                  class="play-symbol"
                  style="opacity:.35"
                >
                  ◷
                </div>

              </div>
            `
            : ""
      }


      <div class="class-body">


        <span class="subject-tag">

          ${escapeHTML(
            classItem.subject
          )}

        </span>


        <h3>

          ${escapeHTML(
            classItem.title
          )}

        </h3>


        <p>

          ${escapeHTML(
            classItem.description ||
            ""
          )}

        </p>


        <div class="status-line">

          <span
            class="status-dot ${
              scheduled
                ? "warn"
                : available
                  ? ""
                  : "off"
            }"
          ></span>


          ${escapeHTML(
            status.label
          )}

        </div>


      </div>

    </article>

  `;

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

  const featured =
    $("#featuredGrid");


  const classGrid =
    $("#classGrid");


  const available =
    getAvailableClasses()
      .slice(0, 3);


  if (featured) {

    featured.innerHTML =
      available.length
        ? available
            .map(
              (item, index) =>
                createFeatureCard(
                  item,
                  index === 0
                )
            )
            .join("")
        : `
          <div class="empty-state">
            No classes are currently available.
          </div>
        `;

  }


  if (classGrid) {

    const classes =
      SITE_CONFIG.classes ||
      [];


    classGrid.innerHTML =
      classes.length
        ? classes
            .map(
              createClassCard
            )
            .join("")
        : `
          <div class="empty-state">
            No classes configured.
          </div>
        `;

  }


  attachVideoTriggers();

}


/* =========================================================
   ALL CLASSES
========================================================= */

function renderAllClasses() {

  const container =
    $("#allClassGrid");


  if (!container) {

    return;

  }


  const classes =
    SITE_CONFIG.classes ||
    [];


  container.innerHTML =
    classes.length
      ? classes
          .map(
            createClassCard
          )
          .join("")
      : `
        <div class="empty-state">
          No classes configured.
        </div>
      `;


  attachVideoTriggers();

}


/* =========================================================
   VIDEO TRIGGERS
========================================================= */

function attachVideoTriggers() {

  $$("[data-video-id]")
    .forEach(
      element => {

        element.onclick =
          function () {

            const id =
              element.dataset.videoId;


            openVideo(id);

          };

      }
    );

}


/* =========================================================
   SCHEDULE
========================================================= */

function renderSchedule() {

  const container =
    $("#scheduleList");


  if (!container) {

    return;

  }


  const classes =
    SITE_CONFIG.classes ||
    [];


  container.innerHTML =
    classes
      .slice()
      .sort(
        (a, b) =>
          parseTime(a.scheduledTime) -
          parseTime(b.scheduledTime)
      )
      .map(
        item => {

          const status =
            getClassStatus(item);


          let statusText =
            "Video unavailable";


          let statusColor =
            "var(--muted)";


          if (
            status.type ===
            "scheduled"
          ) {

            statusText =
              `Scheduled for ${formatTime(
                item.scheduledTime
              )}`;

            statusColor =
              "var(--yellow)";

          }


          if (
            status.type ===
            "available"
          ) {

            statusText =
              "● Live / Available";

            statusColor =
              "var(--green)";

          }


          return `

            <div class="schedule-item">


              <div class="schedule-time">

                ${formatTime(
                  item.scheduledTime
                )}

              </div>


              <div class="schedule-info">

                <h3>
                  ${escapeHTML(
                    item.title
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    item.subject
                  )}
                </p>

              </div>


              <div
                class="schedule-status"
                style="color:${statusColor}"
              >

                ${escapeHTML(
                  statusText
                )}

              </div>


            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   CPQ SETUP
========================================================= */

function setupCPQ() {

  const openButton =
    $("#cpqOpen");


  const closeButton =
    $("#cpqClose");


  const backdrop =
    $("#drawerBackdrop");


  if (openButton) {

    openButton.onclick =
      openCPQ;

  }


  if (closeButton) {

    closeButton.onclick =
      closeCPQ;

  }


  if (backdrop) {

    backdrop.onclick =
      closeCPQ;

  }

}


/* =========================================================
   CPQ RENDER
========================================================= */

function renderCPQ() {

  const container =
    $("#cpqSubjects");


  if (!container) {

    return;

  }


  const subjects =
    SITE_CONFIG.cpq ||
    [];


  container.innerHTML =
    subjects
      .map(
        (subject, index) => `

          <div
            class="cpq-subject"
            data-index="${index}"
          >

            <button
              class="cpq-subject-header"
              type="button"
            >

              <span>
                ${escapeHTML(
                  subject.subject
                )}
              </span>

              <span>
                ⌄
              </span>

            </button>


            <div class="cpq-sets">

              ${
                (subject.sets || [])
                  .map(
                    set => `

                      <div class="cpq-set">

                        <span class="cpq-set-name">

                          ${escapeHTML(
                            set.name
                          )}

                        </span>


                        <div class="cpq-actions">

                          <button
                            class="small-btn"
                            type="button"
                            ${
                              set.pdf
                                ? ""
                                : "disabled"
                            }
                            data-pdf="${
                              escapeHTML(
                                set.pdf ||
                                ""
                              )
                            }"
                          >
                            Open PDF
                          </button>

                        </div>

                      </div>

                    `
                  )
                  .join("")
              }

            </div>

          </div>

        `
      )
      .join("");


  $$(".cpq-subject-header")
    .forEach(
      button => {

        button.onclick =
          function () {

            const parent =
              button.closest(
                ".cpq-subject"
              );


            if (parent) {

              parent.classList.toggle(
                "expanded"
              );

            }

          };

      }
    );


  $$(".small-btn[data-pdf]")
    .forEach(
      button => {

        button.onclick =
          function () {

            openResource(
              button.dataset.pdf
            );

          };

      }
    );

}


/* =========================================================
   CPQ OPEN / CLOSE
========================================================= */

function openCPQ() {

  const drawer =
    $("#cpqDrawer");


  const backdrop =
    $("#drawerBackdrop");


  if (drawer) {

    drawer.classList.add(
      "open"
    );

  }


  if (backdrop) {

    backdrop.classList.add(
      "open"
    );

  }


  document.body.style.overflow =
    "hidden";

}


function closeCPQ() {

  const drawer =
    $("#cpqDrawer");


  const backdrop =
    $("#drawerBackdrop");


  if (drawer) {

    drawer.classList.remove(
      "open"
    );

  }


  if (backdrop) {

    backdrop.classList.remove(
      "open"
    );

  }


  if (
    !$("#videoModal") ||
    !$("#videoModal").classList.contains(
      "open"
    )
  ) {

    document.body.style.overflow =
      "";

  }

}


/* =========================================================
   VIDEO SETUP
========================================================= */

function setupVideo() {

  const closeButton =
    $("#videoClose");


  const modal =
    $("#videoModal");


  const backdrop =
    modal
      ? modal.querySelector(
          ".modal-backdrop"
        )
      : null;


  if (closeButton) {

    closeButton.onclick =
      closeVideo;

  }


  if (backdrop) {

    backdrop.onclick =
      closeVideo;

  }


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeVideo();

        closeCPQ();

      }

    }
  );

}


/* =========================================================
   OPEN VIDEO
========================================================= */

function openVideo(
  classId
) {

  const classItem =
    SITE_CONFIG.classes.find(
      item =>
        String(item.id) ===
        String(classId)
    );


  if (!classItem) {

    showToast(
      "Class not found."
    );

    return;

  }


  const status =
    getClassStatus(
      classItem
    );


  if (
    status.type ===
    "scheduled"
  ) {

    showToast(
      status.label
    );

    return;

  }


  if (
    status.type !==
    "available"
  ) {

    showToast(
      "This video is not available."
    );

    return;

  }


  if (!classItem.videoFile) {

    showToast(
      "Video is not available yet."
    );

    return;

  }


  const video =
    $("#mainVideo");


  const modal =
    $("#videoModal");


  if (!video || !modal) {

    return;

  }


  state.videoClass =
    classItem;


  const title =
    $("#videoTitle");


  const meta =
    $("#videoMeta");


  const badge =
    $("#videoLiveBadge");


  const overlay =
    $("#videoOverlay");


  const statusText =
    $("#videoStatus");


  const progress =
    $("#videoProgress");


  /* -------------------------------------------------------
     UPDATE INFORMATION
  ------------------------------------------------------- */

  if (title) {

    title.textContent =
      classItem.title;

  }


  if (meta) {

    meta.textContent =
      `${classItem.subject} • ${formatTime(
        classItem.scheduledTime
      )}`;

  }


  if (badge) {

    badge.style.display =
      "inline-flex";

    badge.textContent =
      "● LIVE";

  }


  if (overlay) {

    overlay.style.display =
      "block";

  }


  if (statusText) {

    statusText.textContent =
      "Loading class...";

  }


  if (progress) {

    progress.value =
      0;

    progress.style.setProperty(
      "--progress",
      "0%"
    );

  }


  /* -------------------------------------------------------
     STOP CURRENT VIDEO
  ------------------------------------------------------- */

  video.pause();


  /* -------------------------------------------------------
     THIS IS THE ACTUAL VIDEO LOADING
  ------------------------------------------------------- */

  video.src =
    classItem.videoFile;


  video.load();


  /* -------------------------------------------------------
     OPEN VIDEO MODAL
  ------------------------------------------------------- */

  modal.classList.add(
    "open"
  );


  document.body.style.overflow =
    "hidden";


  /* -------------------------------------------------------
     PLAY
  ------------------------------------------------------- */

  video.play()
    .then(
      () => {

        if (statusText) {

          statusText.textContent =
            "Playing";

        }

      }
    )
    .catch(
      () => {

        if (statusText) {

          statusText.textContent =
            "Press Play to start";

        }

      }
    );

}


/* =========================================================
   CLOSE VIDEO
========================================================= */

function closeVideo() {

  const video =
    $("#mainVideo");


  const modal =
    $("#videoModal");


  const progress =
    $("#videoProgress");


  if (video) {

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.load();

  }


  if (modal) {

    modal.classList.remove(
      "open"
    );

  }


  if (progress) {

    progress.value =
      0;

    progress.style.setProperty(
      "--progress",
      "0%"
    );

  }


  state.videoClass =
    null;


  document.body.style.overflow =
    "";

}


/* =========================================================
   CUSTOM VIDEO CONTROLS
========================================================= */

function setupCustomVideoControls() {

  const video =
    $("#mainVideo");


  if (!video) {

    return;

  }


  const wrap =
    video.closest(
      ".video-wrap"
    );


  if (!wrap) {

    return;

  }

  let controlsTimer;

function showVideoControls() {
  wrap.classList.add("show-video-controls");

  clearTimeout(controlsTimer);

  controlsTimer = setTimeout(() => {
    if (!video.paused) {
      wrap.classList.remove("show-video-controls");
    }
  }, 2500);
}

function keepVideoControlsVisible() {
  wrap.classList.add("show-video-controls");
  clearTimeout(controlsTimer);
}


wrap.addEventListener("mousemove", showVideoControls);
wrap.addEventListener("mouseenter", showVideoControls);

wrap.addEventListener("mouseleave", () => {
  if (!video.paused) {
    clearTimeout(controlsTimer);

    controlsTimer = setTimeout(() => {
      wrap.classList.remove("show-video-controls");
    }, 1200);
  }
});

wrap.addEventListener("click", keepVideoControlsVisible);

  const controls =
    $(".custom-video-controls");


  const progress =
    $("#videoProgress");


  const playButton =
    $("#playPauseBtn");


  const muteButton =
    $("#muteBtn");


  const volumeSlider =
    $("#volumeSlider");


  const fullscreenButton =
    $("#fullscreenBtn");


  if (!controls) {

    return;

  }


  /* -------------------------------------------------------
     PLAY / PAUSE
  ------------------------------------------------------- */

  if (playButton) {

    playButton.onclick =
      function () {

        if (
          video.paused
        ) {

          video.play()
            .catch(
              error =>
                console.log(
                  "Play error:",
                  error
                )
            );

        } else {

          video.pause();

        }

      };

  }


  /* -------------------------------------------------------
     CLICK VIDEO
  ------------------------------------------------------- */

  video.addEventListener(
    "click",
    event => {

      if (
        event.target !==
        video
      ) {

        return;

      }


      if (
        video.paused
      ) {

        video.play()
          .catch(
            () => {}
          );

      } else {

        video.pause();

      }

    }
  );


 
/////////////////////////Play //////////////////////////////////////

  video.addEventListener("play", () => {
  if (playButton) playButton.textContent = "❚❚";
  showVideoControls();
});


/////////////////////////Pause //////////////////////////////////////

video.addEventListener("pause", () => {
  if (playButton) playButton.textContent = "▶";
  keepVideoControlsVisible();
});

  /* -------------------------------------------------------
     MUTE
  ------------------------------------------------------- */

  function updateMuteIcon() {

    if (!muteButton) {

      return;

    }


    muteButton.textContent =
      video.muted ||
      video.volume === 0
        ? "🔇"
        : "🔊";

  }


  if (muteButton) {

    muteButton.onclick =
      function () {

        video.muted =
          !video.muted;

        updateMuteIcon();

      };

  }


  /* -------------------------------------------------------
     VOLUME
  ------------------------------------------------------- */

  if (volumeSlider) {

    volumeSlider.oninput =
      function () {

        const volume =
          Number(
            volumeSlider.value
          );


        video.volume =
          volume;


        video.muted =
          volume === 0;


        updateMuteIcon();

      };

  }


  /* -------------------------------------------------------
     VIDEO METADATA
  ------------------------------------------------------- */

  video.addEventListener(
    "loadedmetadata",
    () => {

      if (progress) {

        progress.value =
          0;

        progress.style.setProperty(
          "--progress",
          "0%"
        );

      }

    }
  );


  /* -------------------------------------------------------
     UPDATE PROGRESS
  ------------------------------------------------------- */

  video.addEventListener(
    "timeupdate",
    () => {

      if (
        !progress ||
        !Number.isFinite(
          video.duration
        ) ||
        video.duration <= 0
      ) {

        return;

      }


      const percent =
        (
          video.currentTime /
          video.duration
        ) * 100;


      progress.value =
        percent;


      progress.style.setProperty(
        "--progress",
        `${percent}%`
      );

    }
  );


  /* -------------------------------------------------------
     SEEK VIDEO
  ------------------------------------------------------- */

  if (progress) {

    progress.oninput =
      function () {

        if (
          !Number.isFinite(
            video.duration
          ) ||
          video.duration <= 0
        ) {

          return;

        }


        const percent =
          Number(
            progress.value
          );


        video.currentTime =
          (
            percent /
            100
          ) *
          video.duration;


        progress.style.setProperty(
          "--progress",
          `${percent}%`
        );

      };

  }


  /* -------------------------------------------------------
     FULLSCREEN
  ------------------------------------------------------- */

  if (fullscreenButton) {

    fullscreenButton.onclick =
      async function () {

        try {

          if (
            !document.fullscreenElement
          ) {

            await wrap.requestFullscreen();

          } else {

            await document.exitFullscreen();

          }

        } catch (error) {

          console.error(
            "Fullscreen error:",
            error
          );

        }

      };

  }


  /* -------------------------------------------------------
     VIDEO ENDED
  ------------------------------------------------------- */

  video.addEventListener(
    "ended",
    () => {

      if (playButton) {

        playButton.textContent =
          "▶";

      }


      if (progress) {

        progress.value =
          100;

        progress.style.setProperty(
          "--progress",
          "100%"
        );

      }


      const status =
        $("#videoStatus");


      if (status) {

        status.textContent =
          "Session completed";

      }

    }
  );


  updateMuteIcon();

}


/* =========================================================
   RESOURCES
========================================================= */

function openResource(
  file
) {

  if (!file) {

    showToast(
      "PDF is not available."
    );

    return;

  }


  window.open(
    file,
    "_blank",
    "noopener,noreferrer"
  );

}


window.openResource =
  openResource;


window.openVideo =
  openVideo;


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  $$(".nav-item[data-section]")
    .forEach(
      button => {

        button.onclick =
          function () {

            switchSection(
              button.dataset.section
            );

          };

      }
    );

}


function switchSection(
  section
) {

  const target =
    document.getElementById(
      section
    );


  if (!target) {

    return;

  }


  state.currentSection =
    section;


  $$(".content-section")
    .forEach(
      element => {

        element.classList.toggle(
          "hidden",
          element.id !==
          section
        );

      }
    );


  $$(".nav-item")
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.section ===
          section
        );

      }
    );


  if (
    section ===
    "classes"
  ) {

    renderAllClasses();

  }


  if (
    section ===
    "schedule"
  ) {

    renderSchedule();

  }


  window.scrollTo({
    top:
      0,

    behavior:
      "smooth"
  });

}


/* =========================================================
   BUTTONS
========================================================= */

function setupButtons() {

  const continueButton =
    $("#continueBtn");


  if (continueButton) {

    continueButton.onclick =
      function () {

        const playable =
          getPlayableClasses();


        if (
          playable.length
        ) {

          openVideo(
            playable[0].id
          );

        } else {

          showToast(
            "No class is currently available."
          );

        }

      };

  }


  const heroCPQ =
    $("#heroCpq");


  if (heroCPQ) {

    heroCPQ.onclick =
      openCPQ;

  }

}


/* =========================================================
   THEME
========================================================= */

function setupTheme() {

  const toggle =
    $("#themeToggle");


  if (!toggle) {

    return;

  }


  const saved =
    localStorage.getItem(
      "me-theme"
    );


  if (
    saved ===
    "light"
  ) {

    document.body.classList.add(
      "light"
    );

    toggle.textContent =
      "☀";

  } else {

    document.body.classList.remove(
      "light"
    );

    toggle.textContent =
      "☾";

  }


  toggle.onclick =
    function () {

      document.body.classList.toggle(
        "light"
      );


      const light =
        document.body.classList.contains(
          "light"
        );


      toggle.textContent =
        light
          ? "☀"
          : "☾";


      localStorage.setItem(
        "me-theme",
        light
          ? "light"
          : "dark"
      );

    };

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer =
  null;


function showToast(
  message
) {

  const toast =
    $("#toast");


  if (!toast) {

    return;

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2500
    );

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   END
========================================================= */
