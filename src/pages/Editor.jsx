import { useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { fabric } from "fabric";
import MainLayout from "../layouts/MainLayout";

const frames = import.meta.glob("../assets/frame-assets/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default"
});

export default function EditorPage() {
  const [params] = useSearchParams();
  const frameId = params.get("frame") || "";

  // Load File Frame 
  const frameUrl = ["png", "jpg", "jpeg"]
    .map(ext => frames[`../assets/frame-assets/${frameId}.${ext}`])
    .find(Boolean);

  if (!frameUrl) {
    console.error("FRAME TIDAK DITEMUKAN:", frameId);
  }

  useEffect(() => {

    // CONFIG
    const TEMPLATE_IMG = frameUrl;
    const INITIAL_W = 350, INITIAL_H = 800;

    const FRAME_SLOTS = {
      "1x3": [
        { x: 13, y: 47, width: 186, height: 120 },
        { x: 13, y: 192, width: 186, height: 120 },
        { x: 13, y: 344, width: 186, height: 120 },
      ],

      "1x4": [
        { x: 10, y: 25, width: 165, height: 90 },
        { x: 10, y: 115, width: 165, height: 90 },
        { x: 10, y: 210, width: 165, height: 90 },
        { x: 10, y: 300, width: 165, height: 90 },
      ],

      "2x2": [
        { x: 13, y: 40, width: 170, height: 110 },
        { x: 189, y: 40, width: 170, height: 110 },
        { x: 13, y: 172, width: 170, height: 110 },
        { x: 189, y: 172, width: 170, height: 110 },
      ],

      "2x3": [
        { x: 9, y: 21, width: 136, height: 100 },
        { x: 154, y: 21, width: 135, height: 100 },
        { x: 7, y: 140, width: 136, height: 100 },
        { x: 154, y: 140, width: 135, height: 100 },
        { x: 9, y: 250, width: 135, height: 100 },
        { x: 154, y: 250, width: 135, height: 100 },
      ],
    };

    let slots = [];
    let activeSlotIndex = 0;
    let slotImages = {}; // { slotId: fabric.Image }
    let slotBorders = []; // array of fabric.Rect overlays for visual active
    let originalFrameWidth = 0;
    let originalFrameHeight = 0;

    const canvas = new fabric.Canvas("fabricCanvas", {
      preserveObjectStacking: true,
      backgroundColor: null,
      enableRetinaScaling: true,
      selection: true
    });

    canvas.setWidth(INITIAL_W);
    canvas.setHeight(INITIAL_H);

    // Patch Fabric agar error width undefined tidak merusak eksekusi
    const originalFromURL = fabric.Image.fromURL;
    fabric.Image.fromURL = function(url, callback, options = {}) {
      try {
        return originalFromURL.call(this, url, callback, options);
      } catch (e) {
        console.warn("[IGNORED FABRIC ERROR]", e);
        return null;
      }
    };

    // PAGE LOAD
    const photos = JSON.parse(sessionStorage.getItem("capturedPhotos") || "[]");
    if (photos.length === 0) {
      alert("Foto belum ada, kembali ke halaman Photo.");
      window.location.href = "/photo";
      return;
    }

    // LOAD FRAME TEMPLATE
    async function loadTemplate() {
      canvas.clear();

      const cleanFrameId = (frameId || "")
        .toLowerCase()
        .replace(".png", "")
        .replace(/_.*$/, "")
        .trim();

      const rawSlots = FRAME_SLOTS[cleanFrameId] || FRAME_SLOTS["1x3"];

      fabric.Image.fromURL(TEMPLATE_IMG, (img) => {
        if (!img) {
          alert("Gagal memuat frame!");
          return;
        }

        originalFrameWidth = img.width;
        originalFrameHeight = img.height;

        canvas.setWidth(originalFrameWidth);
        canvas.setHeight(originalFrameHeight);

        img.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          hasBorders: false,
          hasControls: false,
          isFrame: true,
          originX: "left",
          originY: "top"
        });

        canvas.add(img);
        canvas.sendToBack(img);

        // Prepare slots array (with id starting at 1)
        slots = rawSlots.map((slot, i) => ({ id: i + 1, ...slot }));

        // create visual borders for every slot (non-evented so user can't pick them)
        slotBorders = slots.map((s) => {
          const r = new fabric.Rect({
            left: s.x,
            top: s.y,
            width: s.width,
            height: s.height,
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(255,255,255,0.0)",
            strokeWidth: 2,
            selectable: false,
            evented: false,
            rx: 4,
            ry: 4,
            originX: "left",
            originY: "top",
            hasControls: false,
            hasBorders: false,
            hovered: false,
          });
          canvas.add(r);
          return r;
        });

        // Ensure borders are above frame
        slotBorders.forEach((b) => b.bringToFront());
        // set initial active border visual
        highlightActiveBorder();

        // add photos to corresponding slots (map by index)
        photos.slice(0, slots.length).forEach((photo, i) => {
          addPhoto(photo, i);
        });

        canvas.renderAll();
      }, { crossOrigin: "Anonymous" });
    }

    loadTemplate();

    // helper: highlight active border UI
    function highlightActiveBorder() {
      slotBorders.forEach((b, idx) => {
        if (idx === activeSlotIndex) {
          b.set({ stroke: "#ff6fa3", strokeWidth: 3, opacity: 1 });
        } else {
          b.set({ stroke: "rgba(0,0,0,0.0)", strokeWidth: 1, opacity: 0.0 });
        }
      });
      canvas.renderAll();
      // update DOM Active Slot label
      document.getElementById("activeSlot").innerText =
        slots[activeSlotIndex]?.id || "-";
    }

    // TAMBAH PHOTO KE AREA SLOT
    function addPhoto(dataUrl, manualIndex = null) {
      const index = manualIndex !== null ? manualIndex : activeSlotIndex;
      if (!slots[index]) return;

      const slot = slots[index];

      fabric.Image.fromURL(dataUrl, (img) => {
        if (!img) return;

        // compute scaling so image covers the slot (cover behavior)
        const scale = Math.max(slot.width / img.width, slot.height / img.height);

        // create clip rect (absolutePositioned so it's respected regardless of group)
        const clip = new fabric.Rect({
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          absolutePositioned: true,
          originX: "left",
          originY: "top"
        });

        img.set({
          left: slot.x + (slot.width - img.width * scale) / 2,
          top: slot.y + (slot.height - img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          clipPath: clip,
          selectable: true,
          evented: true,
          hasBorders: true,
          hasControls: true,
          originX: "left",
          originY: "top",
          // custom property to map image -> slot id
          slotId: slot.id
        });

        canvas.add(img);

        // ensure image is above frame but below borders/stickers
        const objects = canvas.getObjects();
        const frameIndex = objects.findIndex((o) => o.isFrame);

        if (frameIndex !== -1) {
          img.moveTo(frameIndex);
        }

        // bring borders/front items later so image not overlap them
        slotBorders.forEach((b) => b.bringToFront());

        slotImages[slot.id] = img;

        // if the added photo corresponds to current active slot, select it
        if (index === activeSlotIndex) {
          canvas.setActiveObject(img);
        }

        canvas.renderAll();
      }, { crossOrigin: "Anonymous" });
    }

    // When user clicks/selects an object in canvas, sync activeSlotIndex
    canvas.on("selection:created", (e) => {
      const o = e.target;
      if (o && o.slotId) {
        // find slot index for this slotId
        const idx = slots.findIndex(s => s.id === o.slotId);
        if (idx !== -1 && idx !== activeSlotIndex) {
          activeSlotIndex = idx;
          highlightActiveBorder();
        }
      }
    });
    canvas.on("selection:updated", (e) => {
      const o = e.target;
      if (o && o.slotId) {
        const idx = slots.findIndex(s => s.id === o.slotId);
        if (idx !== -1 && idx !== activeSlotIndex) {
          activeSlotIndex = idx;
          highlightActiveBorder();
        }
      }
    });

    // STICKERS
    document.querySelectorAll(".stickerBtn")?.forEach((btn) => {
      btn.onclick = () => {
        const center = { x: canvas.width / 2, y: canvas.height / 2 };
        const fontSize = Math.max(34, Math.round(canvas.width * 0.07));

        const t = new fabric.Text(btn.innerText, {
          left: center.x,
          top: center.y,
          fontSize: fontSize,
          originX: "center",
          originY: "center",
          padding: 6,
        });

        canvas.add(t);
        t.bringToFront();
        canvas.setActiveObject(t);
        canvas.renderAll();
      };
    });

    document.getElementById("deleteSticker").onclick = () => {
      const obj = canvas.getActiveObject();
      if (obj && obj.type === "text") {
        canvas.remove(obj);
        canvas.renderAll();
      }
    };


    // FILTERS
    document.querySelectorAll(".filterBtn").forEach((btn) => {
      btn.onclick = () => {
        // operate on the image inside active slot first; otherwise activeObject fallback
        let obj = canvas.getActiveObject();
        if (!obj || obj.type !== "image") {
          // try slot image
          const s = slots[activeSlotIndex];
          obj = slotImages[s?.id] || null;
        }
        if (!obj || obj.type !== "image") return;

        obj.filters = [];
        const f = fabric.Image.filters;

        switch (btn.dataset.filter) {
          case "sepia":
            obj.filters.push(new f.Sepia());
            break;
          case "grayscale":
            obj.filters.push(new f.Grayscale());
            break;
          case "bright":
            obj.filters.push(new f.Brightness({ brightness: 0.25 }));
            break;
          case "soft":
            obj.filters.push(new f.Brightness({ brightness: 0.12 }));
            obj.filters.push(new f.Contrast({ contrast: -0.15 }));
            break;
          case "warm":
            obj.filters.push(
              new f.ColorMatrix({
                matrix: [
                  1.15, 0.05, 0.0, 0, 0,
                  0.05, 1.05, 0.0, 0, 0,
                  0.0, 0.0, 0.9, 0, 0,
                  0, 0, 0, 1, 0
                ]
              })
            );
            break;
          case "cool":
            obj.filters.push(
              new f.ColorMatrix({
                matrix: [
                  0.9, 0.0, 0.0, 0, 0,
                  0.0, 1.05, 0.05, 0, 0,
                  0.0, 0.05, 1.2, 0, 0,
                  0, 0, 0, 1, 0
                ]
              })
            );
            break;
          case "dreamy":
            obj.filters.push(new f.Blur({ blur: 0.15 }));
            obj.filters.push(new f.Brightness({ brightness: 0.15 }));
            obj.filters.push(new f.Noise({ noise: 25 }));
            break;

          default:
            obj.filters = [];
        }

        obj.applyFilters();
        canvas.renderAll();
      };
    });


    // SLIDERS
    const zoomSlider = document.getElementById("zoomSlider");
    zoomSlider.oninput = () => {
      const o = canvas.getActiveObject();
      if (!o) return;
      o.scaleX = o.scaleY = parseFloat(zoomSlider.value);
      o.setCoords();
      canvas.renderAll();
    };

    const rotateSlider = document.getElementById("rotateSlider");
    rotateSlider.oninput = () => {
      const o = canvas.getActiveObject();
      if (!o) return;
      o.angle = parseFloat(rotateSlider.value);
      o.setCoords();
      canvas.renderAll();
    };

    document.getElementById("posX").oninput = (e) => {
      const o = canvas.getActiveObject();
      if (!o) return;
      o.left = parseFloat(e.target.value);
      o.setCoords();
      canvas.renderAll();
    };

    document.getElementById("posY").oninput = (e) => {
      const o = canvas.getActiveObject();
      if (!o) return;
      o.top = parseFloat(e.target.value);
      o.setCoords();
      canvas.renderAll();
    };

    // FIT IMAGE (target slot image first)
    document.getElementById("fitBtn").onclick = () => {
      const s = slots[activeSlotIndex];
      if (!s) return;

      let obj = slotImages[s.id] || canvas.getActiveObject();
      if (!obj || obj.type !== "image") return;

      // compute scale so image covers the slot (cover)
      const scale = Math.max(s.width / obj.width, s.height / obj.height);

      // keep stacking position (do not change moveTo unless necessary)
      obj.set({
        scaleX: scale,
        scaleY: scale,
        left: s.x + (s.width - obj.width * scale) / 2,
        top: s.y + (s.height - obj.height * scale) / 2,
        angle: 0
      });

      obj.setCoords();

      // ensure image stays above frame
      const objects = canvas.getObjects();
      const frameIndex = objects.findIndex((o) => o.isFrame);
      if (frameIndex !== -1) {
        try {
          obj.moveTo(frameIndex - 1);
        } catch (e) {
          // ignore if moveTo fails
        }
      }

      // re-bring borders so overlay not hidden
      slotBorders.forEach((b) => b.bringToFront());

      canvas.renderAll();
    };


    // RESET (reset only the image in active slot)
    document.getElementById("resetBtn").onclick = () => {
      const s = slots[activeSlotIndex];
      if (!s) return;

      let obj = slotImages[s.id] || canvas.getActiveObject();
      if (!obj || obj.type !== "image") return;

      const scale = Math.max(s.width / obj.width, s.height / obj.height);

      obj.set({
        scaleX: scale,
        scaleY: scale,
        left: s.x + (s.width - obj.width * scale) / 2,
        top: s.y + (s.height - obj.height * scale) / 2,
        angle: 0
      });

      obj.setCoords();

      // ensure stacking order as above
      const objects = canvas.getObjects();
      const frameIndex = objects.findIndex((o) => o.isFrame);
      if (frameIndex !== -1) {
        try {
          obj.moveTo(frameIndex - 1);
        } catch (e) {}
      }

      slotBorders.forEach((b) => b.bringToFront());

      canvas.renderAll();
    };


    // DOWNLOAD 
    document.getElementById("downloadBtn").onclick = () => {
      // hide borders temporarily so they don't appear in export
      const prevBorderVis = slotBorders.map(b => ({ stroke: b.stroke, opacity: b.opacity }));
      slotBorders.forEach(b => b.set({ stroke: null, opacity: 0 }));

      canvas.renderAll();

      const dataURL = canvas.toDataURL({
        format: "png",
        multiplier: 2
      });

      // restore borders
      slotBorders.forEach((b, i) => b.set(prevBorderVis[i]));

      canvas.renderAll();

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `photobooth_${Date.now()}.png`;
      link.click();
    };

    // SAVE TO ALBUM
document.getElementById("saveAlbumBtn").onclick = () => {
  // sembunyikan border slot
  const prevBorderVis = slotBorders.map(b => ({
    stroke: b.stroke,
    opacity: b.opacity
  }));
  slotBorders.forEach(b => b.set({ stroke: null, opacity: 0 }));
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format: "png",
    multiplier: 2
  });

  // restore border
    slotBorders.forEach((b, i) => b.set(prevBorderVis[i]));
      canvas.renderAll();

      // ambil album lama
      const album = JSON.parse(localStorage.getItem("photoAlbum") || "[]");

      album.unshift({
        id: Date.now(),
        frame: frameId,
        image: dataURL,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("photoAlbum", JSON.stringify(album));

      alert("Foto berhasil disimpan ke Album 📸");

      // redirect ke halaman album
      window.location.href = "/album";
    };



    // SLOT SELECTOR
    function setActiveSlot(idx) {
      activeSlotIndex = ((idx % slots.length) + slots.length) % slots.length;
      // if slot has an image, select it on canvas
      const s = slots[activeSlotIndex];
      const img = slotImages[s.id];
      if (img) {
        canvas.setActiveObject(img);
      } else {
        // clear selection
        canvas.discardActiveObject();
      }
      highlightActiveBorder();
    }

    document.getElementById("slotNext").onclick = () =>
      setActiveSlot(activeSlotIndex + 1);

    document.getElementById("slotPrev").onclick = () =>
      setActiveSlot(activeSlotIndex - 1);


    // CLEANUP
    return () => {
      canvas.dispose();
    };
  }, []);


  // UI
  return (
    <MainLayout>
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center text-black py-14 px-10"
    >
      <div className="max-w-[1100px] w-full mx-auto grid grid-cols-1 xl:grid-cols-[650px_1fr] gap-10">

        {/* LEFT */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="font-bold text-xl text-pink-600 mb-4">
            Edit Your Photo
          </h2>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#fafafa] to-[#f0f3ff] border p-[22px] max-h-[700px]">
            <canvas id="fabricCanvas" width="250" height="800"></canvas>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <button id="fitBtn" className="py-2 rounded-xl bg-green-50 text-green-600 font-semibold">
              Fit
            </button>
            <button id="resetBtn" className="py-2 rounded-xl bg-pink-50 text-pink-600 font-semibold">
              Reset
            </button>
            <button id="saveAlbumBtn" className="py-2 rounded-xl bg-yellow-400 text-white font-semibold">
              Save to Album
            </button>
            <button id="downloadBtn" className="py-2 rounded-xl bg-indigo-500 text-white font-semibold">
              Download
            </button>
          </div>

          {/* SLIDERS */}
          <div className="mt-6 bg-gray-50 p-4 rounded-xl space-y-4">
            <div>
              <label>Zoom</label>
              <input id="zoomSlider" type="range" min="0.2" max="3" step="0.01" defaultValue="1" className="w-full"/>
            </div>
            <div>
              <label>Rotate</label>
              <input id="rotateSlider" type="range" min="-180" max="180" step="1" defaultValue="0" className="w-full"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Pos X</label>
                <input id="posX" type="range" min="-2000" max="2000" step="1" defaultValue="0" className="w-full"/>
              </div>
              <div>
                <label>Pos Y</label>
                <input id="posY" type="range" min="-2000" max="2000" step="1" defaultValue="0" className="w-full"/>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* FILTER PANEL */}
          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-lg text-pink-600 mb-3">Photo Filters</h3>

            <div className="grid grid-cols-4 gap-3">
              {["normal","sepia","gray","bright","soft","warm","cool","dreamy"].map(f => (
                <button
                  key={f}
                  className="filterBtn p-3 rounded-xl bg-gray-100 hover:bg-pink-50 text-center"
                  data-filter={f}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* STICKERS */}
          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-lg text-pink-600 mb-3">Add Stickers</h3>

            <div className="grid grid-cols-6 gap-2">
              {["🍒","💀","🔥","😎","😍","😭","🎉","🤩","👍","😱","😡","✨","🐣","🌈","🧋","✨","💖","🎀","🐻","⭐","🍓","🌸","💘","💫","🐼","🪽","🌙","💕","🧸","🤍","💐"]
                .map((e, i) => (
                <button key={i} className="stickerBtn bg-gray-100 p-3 rounded-xl border border-pink-200 hover:bg-pink-50">
                  {e}
                </button>
              ))}
            </div>

            <button id="deleteSticker" className="mt-4 w-full bg-pink-400 text-white py-2 rounded-xl">
              Hapus Sticker Terpilih
            </button>
          </div>

          {/* SLOT SELECTOR */}
          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold text-lg text-pink-600 mb-3">Photo Slots</h3>

            <div className="flex items-center gap-3">
              <button id="slotPrev" className="px-4 py-2 bg-pink-200 rounded-xl">
                Prev
              </button>
              <button id="slotNext" className="px-4 py-2 bg-purple-200 rounded-xl">
                Next
              </button>

              <div className="ml-auto text-sm text-pink-400">
                Active Slot: <span id="activeSlot" className="font-bold">1</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    </MainLayout>
  );
}
