const STORAGE_KEY = "swarrow-miyagawa-hidden-slides";
const SLIDE_BASE_WIDTH = 1280;
const SLIDE_BASE_HEIGHT = 720;
const PRINT_TARGET_WIDTH_PX = (289 / 25.4) * 96;
const PRINT_TARGET_HEIGHT_PX = ((289 * 9) / 16 / 25.4) * 96;
const PRESENTATION_VIEWPORT_GAP = 32;

const body = document.body;
const slides = Array.from(document.querySelectorAll(".slide"));
const tocList = document.querySelector("[data-toc-list]");
const toolbar = document.querySelector(".deck-toolbar");
const settingsPanel = document.querySelector("[data-settings-panel]");
const settingsList = document.querySelector("[data-settings-list]");

let hiddenIds = new Set(loadHiddenIds());
let slideshowActive = false;
let activeSlideId = null;
let slideshowScrollY = 0;

const slideMeta = slides.map((slide, index) => {
  const title = slide.dataset.navTitle
    ?? slide.querySelector(".slide__title")?.textContent.trim()
    ?? `スライド ${index + 1}`;
  return { id: slide.id, title, slide };
});

buildTocList();
buildSettingsList();
applyVisibility();
syncSlideMetrics();

toolbar?.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "settings") {
    openSettings();
  }

  if (action === "slideshow") {
    closeSettings();
    enterSlideshow();
  }

  if (action === "export-pdf") {
    closeSettings();
    exportPdf();
  }
});

settingsPanel?.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "close-settings") {
    closeSettings();
  }

  if (action === "show-all") {
    hiddenIds.clear();
    saveHiddenIds();
    applyVisibility();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (slideshowActive) {
      exitSlideshow();
      return;
    }

    if (!settingsPanel.hidden) {
      closeSettings();
    }
  }

  if (!slideshowActive) return;

  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    moveSlide(1);
  }

  if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    moveSlide(-1);
  }
});

document.addEventListener("fullscreenchange", () => {
  if (slideshowActive && !document.fullscreenElement) {
    exitSlideshow({ skipFullscreenExit: true });
  }
});

window.addEventListener("beforeprint", () => {
  closeSettings();
  if (slideshowActive) {
    exitSlideshow();
  }
  syncSlideMetrics();
  body.classList.add("is-printing");
});

window.addEventListener("afterprint", () => {
  body.classList.remove("is-printing");
});

window.addEventListener("resize", () => {
  syncSlideMetrics();
});

window.addEventListener("hashchange", () => {
  if (!slideshowActive) return;
  const targetId = location.hash.replace("#", "");
  if (targetId && !hiddenIds.has(targetId)) {
    activeSlideId = targetId;
    updateSlideshowView();
  }
});

function buildSettingsList() {
  if (!settingsList) return;

  settingsList.innerHTML = "";

  slideMeta.forEach((meta) => {
    const item = document.createElement("label");
    item.className = "settings-panel__item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = meta.id;
    checkbox.checked = !hiddenIds.has(meta.id);
    checkbox.addEventListener("change", () => toggleSlide(meta.id, checkbox));

    const text = document.createElement("span");
    text.className = "settings-panel__item-text";

    const title = document.createElement("span");
    title.className = "settings-panel__item-title";
    title.textContent = meta.title;

    text.append(title);
    item.append(checkbox, text);
    settingsList.append(item);
  });
}

function buildTocList() {
  if (!tocList) return;

  tocList.innerHTML = "";

  slideMeta.forEach((meta) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${meta.id}`;
    link.textContent = meta.title;
    item.append(link);
    tocList.append(item);
  });
}

function toggleSlide(id, checkbox) {
  const visibleCount = getVisibleSlides().length;

  if (!checkbox.checked && visibleCount <= 1) {
    checkbox.checked = true;
    window.alert("少なくとも1ページは表示してください。");
    return;
  }

  if (checkbox.checked) {
    hiddenIds.delete(id);
  } else {
    hiddenIds.add(id);
  }

  saveHiddenIds();
  applyVisibility();
}

function applyVisibility() {
  syncSlideVisibility();
  syncSlideMetrics();

  tocList?.querySelectorAll("a").forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const item = link.closest("li");
    if (id && item) {
      item.hidden = hiddenIds.has(id);
    }
  });

  settingsList?.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = !hiddenIds.has(input.value);
  });

  if (!slideshowActive) return;

  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) {
    exitSlideshow();
    return;
  }

  if (!activeSlideId || hiddenIds.has(activeSlideId)) {
    activeSlideId = visibleSlides[0].id;
  }

  updateSlideshowView();
}

function getVisibleSlides() {
  return slides.filter((slide) => !hiddenIds.has(slide.id));
}

function openSettings() {
  if (!settingsPanel) return;
  settingsPanel.hidden = false;
  body.classList.add("has-settings");
}

function closeSettings() {
  if (!settingsPanel) return;
  settingsPanel.hidden = true;
  body.classList.remove("has-settings");
}

function enterSlideshow() {
  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) return;

  syncSlideMetrics();
  slideshowActive = true;
  slideshowScrollY = window.scrollY;
  activeSlideId = getCurrentSlideId({ preferHash: false }) ?? visibleSlides[0].id;
  body.classList.add("is-slideshow");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  updateSlideshowView();

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitSlideshow(options = {}) {
  if (!slideshowActive) return;

  slideshowActive = false;
  body.classList.remove("is-slideshow");
  slides.forEach((slide) => slide.classList.remove("is-active"));
  syncSlideVisibility();

  if (activeSlideId) {
    const activeSlide = document.getElementById(activeSlideId);
    activeSlide?.scrollIntoView({ block: "start", behavior: "auto" });
  } else {
    window.scrollTo({ top: slideshowScrollY, left: 0, behavior: "auto" });
  }

  if (!options.skipFullscreenExit && document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

function moveSlide(delta) {
  if (!slideshowActive) return;

  const visibleSlides = getVisibleSlides();
  const currentIndex = visibleSlides.findIndex((slide) => slide.id === activeSlideId);
  const nextIndex = Math.min(Math.max(currentIndex + delta, 0), visibleSlides.length - 1);
  activeSlideId = visibleSlides[nextIndex].id;
  updateSlideshowView();
}

function updateSlideshowView() {
  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) return;

  let currentIndex = visibleSlides.findIndex((slide) => slide.id === activeSlideId);
  if (currentIndex === -1) currentIndex = 0;

  activeSlideId = visibleSlides[currentIndex].id;

  slides.forEach((slide) => {
    slide.classList.toggle("is-active", slide.id === activeSlideId);
  });
  syncSlideVisibility();

  const meta = slideMeta.find((entry) => entry.id === activeSlideId);
  if (meta) {
    document.title = `${meta.title} | SwarrowCall 営業資料`;
  }

  history.replaceState(null, "", `#${activeSlideId}`);
}

function getCurrentSlideId(options = {}) {
  const preferHash = options.preferHash ?? true;

  if (preferHash) {
    const hashId = location.hash.replace("#", "");
    if (hashId && !hiddenIds.has(hashId)) {
      return hashId;
    }
  }

  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) return null;

  const threshold = window.scrollY + window.innerHeight * 0.35;
  let currentSlide = visibleSlides[0];

  visibleSlides.forEach((slide) => {
    if (slide.offsetTop <= threshold) {
      currentSlide = slide;
    }
  });

  return currentSlide.id;
}

function loadHiddenIds() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHiddenIds() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...hiddenIds]));
}

function syncSlideVisibility() {
  slides.forEach((slide) => {
    const userHidden = hiddenIds.has(slide.id);
    const slideshowHidden = slideshowActive && slide.id !== activeSlideId;
    slide.hidden = userHidden || slideshowHidden;
  });
}

function syncSlideMetrics() {
  const slideshowViewportWidth = Math.max(window.innerWidth - PRESENTATION_VIEWPORT_GAP, 320);
  const slideshowViewportHeight = Math.max(window.innerHeight - PRESENTATION_VIEWPORT_GAP, 180);
  const slideshowScale = Math.min(
    slideshowViewportWidth / SLIDE_BASE_WIDTH,
    slideshowViewportHeight / SLIDE_BASE_HEIGHT,
  );
  const printScale = Math.min(
    PRINT_TARGET_WIDTH_PX / SLIDE_BASE_WIDTH,
    PRINT_TARGET_HEIGHT_PX / SLIDE_BASE_HEIGHT,
  );

  body.style.setProperty("--slideshow-scale", `${slideshowScale}`);
  body.style.setProperty("--print-scale", `${printScale}`);
}

function openPrintDialog() {
  syncSlideMetrics();
  window.print();
}

async function inlineAllImages(element) {
  const imgs = element.querySelectorAll("img");
  const backups = [];
  for (const img of imgs) {
    if (img.src.startsWith("data:")) continue;
    const origSrc = img.src;
    let dataUrl = null;

    // Strategy 1: fetch + FileReader
    try {
      const resp = await fetch(origSrc);
      const blob = await resp.blob();
      dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch { /* continue to fallback */ }

    // Strategy 2: canvas drawImage (works if already loaded same-origin)
    if (!dataUrl && img.complete && img.naturalWidth > 0) {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        dataUrl = c.toDataURL();
      } catch { /* continue to fallback */ }
    }

    // Strategy 3: reload with crossOrigin + cache buster
    if (!dataUrl) {
      try {
        const tmp = new Image();
        tmp.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          tmp.onload = resolve;
          tmp.onerror = reject;
          tmp.src = origSrc + (origSrc.includes("?") ? "&" : "?") + "_t=" + Date.now();
        });
        const c = document.createElement("canvas");
        c.width = tmp.naturalWidth;
        c.height = tmp.naturalHeight;
        c.getContext("2d").drawImage(tmp, 0, 0);
        dataUrl = c.toDataURL();
      } catch { /* give up on this image */ }
    }

    if (dataUrl) {
      backups.push({ img, origSrc });
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = dataUrl;
      });
    }
  }
  return backups;
}

function restoreImages(backups) {
  for (const { img, origSrc } of backups) {
    img.src = origSrc;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load: " + src));
    document.head.appendChild(s);
  });
}

async function exportPdf() {
  const btn = toolbar?.querySelector('[data-action="export-pdf"]');
  if (btn) {
    btn.textContent = "出力中…";
    btn.disabled = true;
  }

  try {
    if (window.location.protocol === "file:") {
      window.alert(
        "Finder から直接開いたページでは、ブラウザの制約でPDF画像化に失敗します。印刷ダイアログから PDF 保存を行ってください。",
      );
      openPrintDialog();
      return;
    }

    // Load libraries on demand if not already loaded
    // Use html2canvas-pro (fixes tainted-canvas bug in original html2canvas)
    if (!window._html2canvasFn) {
      if (typeof window.html2canvas === "undefined" || !window.html2canvas.default) {
        await loadScript("https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js");
      }
      window._html2canvasFn =
        typeof window.html2canvas === "function"
          ? window.html2canvas
          : window.html2canvas?.default;
    }
    const renderToCanvas = window._html2canvasFn;

    if (!window.jspdf) {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    }
    const { jsPDF } = window.jspdf;
    const visibleSlides = getVisibleSlides();
    if (!visibleSlides.length) return;

    body.classList.add("is-exporting-pdf");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [SLIDE_BASE_WIDTH, SLIDE_BASE_HEIGHT],
      hotfixes: ["px_scaling"],
    });

    for (let i = 0; i < visibleSlides.length; i++) {
      const slide = visibleSlides[i];

      // Force slide to render at base dimensions without zoom
      const origStyle = slide.getAttribute("style") || "";
      const origHidden = slide.hidden;
      const origDisplay = window.getComputedStyle(slide).display || "block";
      let imgBackups = [];
      slide.style.cssText = `
        display: ${origDisplay} !important;
        position: fixed !important;
        top: 0; left: 0;
        width: ${SLIDE_BASE_WIDTH}px !important;
        min-height: ${SLIDE_BASE_HEIGHT}px !important;
        height: ${SLIDE_BASE_HEIGHT}px !important;
        zoom: 1 !important;
        margin: 0 !important;
        z-index: 99999;
        overflow: hidden;
      `;
      slide.hidden = false;

      let canvas;
      try {
        // Wait for layout
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

        // Convert images to base64 to avoid tainted canvas
        imgBackups = await inlineAllImages(slide);

        canvas = await renderToCanvas(slide, {
          width: SLIDE_BASE_WIDTH,
          height: SLIDE_BASE_HEIGHT,
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: slide.classList.contains("slide--cover") ? "#092045" : "#ffffff",
          logging: false,
        });
      } finally {
        restoreImages(imgBackups);
        if (origStyle) {
          slide.setAttribute("style", origStyle);
        } else {
          slide.removeAttribute("style");
        }
        slide.hidden = origHidden;
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_BASE_WIDTH, SLIDE_BASE_HEIGHT);
    }

    // Restore visibility
    syncSlideVisibility();

    pdf.save("SwarrowCall営業資料.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
    syncSlideVisibility();
    const message = err instanceof Error ? err.message : String(err);

    if (/tainted canvases may not be exported/i.test(message)) {
      window.alert(
        "PDF画像化に失敗しました。ローカル画像を含むため、ブラウザが canvas の書き出しを拒否しています。印刷ダイアログを開くので、「Save as PDF」で保存してください。",
      );
      openPrintDialog();
      return;
    }

    window.alert(
      "PDF出力に失敗しました。印刷ダイアログを開くので、「Save as PDF」で保存してください。\n\n詳細: "
        + message,
    );
    openPrintDialog();
  } finally {
    body.classList.remove("is-exporting-pdf");
    if (btn) {
      btn.textContent = "PDF出力";
      btn.disabled = false;
    }
  }
}
