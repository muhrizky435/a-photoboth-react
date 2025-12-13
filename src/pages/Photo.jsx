import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function PhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // get URL param ?frame=...
  const params = new URLSearchParams(location.search);
  const frameParam = params.get("frame") || "";

  // deteksi berapa kali foto dari frame yang dipilih
  const frameType = (() => {
    if (frameParam.startsWith("1x3")) return "1x3";
    if (frameParam.startsWith("1x4")) return "1x4";
    if (frameParam.startsWith("2x3")) return "2x3";
    if (frameParam.startsWith("2x2")) return "2x2";
    return "unknown";
  })();

  // tentukan jumlah foto yang diambil
  const maxPhotos = {
    "1x3": 3,
    "1x4": 4,
    "2x3": 6,
    "2x2": 4,
  }[frameType] || 3;

  //  REFS 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownBoxRef = useRef(null);
  const countdownRef = useRef(null);

  //  STATE 
  const [photos, setPhotos] = useState([]);
  const [useFront, setUseFront] = useState(true);
  const [mirrorOn, setMirrorOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [delay, setDelay] = useState(3);

  //  START CAMERA 
  async function startCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useFront ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.style.transform = mirrorOn ? "scaleX(-1)" : "none";
      }
    } catch (e) {
      console.error(e);
      alert("Tidak dapat mengakses kamera.");
    }
  }

  // start camera on load and when switching camera/mirror
  useEffect(() => {
    startCamera();
  }, [useFront, mirrorOn]);

  //  COUNTDOWN 
  function runCountdown(seconds) {
    return new Promise(resolve => {
      if (!countdownBoxRef.current) return resolve();

      countdownRef.current.textContent = seconds;
      countdownBoxRef.current.classList.remove("hidden");

      let s = seconds;

      const timer = setInterval(() => {
        s--;
        if (s <= 0) {
          clearInterval(timer);
          countdownBoxRef.current.classList.add("hidden");
          resolve();
        } else {
          countdownRef.current.textContent = s;
          countdownRef.current.style.transform = "scale(1.05)";
          setTimeout(() => {
            countdownRef.current.style.transform = "scale(1)";
          }, 150);
        }
      }, 1000);
    });
  }

  //  CAPTURE 
  function captureOne() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (mirrorOn) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const data = canvas.toDataURL("image/png");
    setPhotos(prev => [...prev, data].slice(0, maxPhotos));
  }

  //  TAKE PHOTO SEQUENCE 
  async function handleTakePhoto() {
    if (photos.length >= maxPhotos) return;

    await runCountdown(delay);
    captureOne();
  }

  //  RESET 
  function resetPhotos() {
    setPhotos([]);
  }

  function retakeLast() {
    setPhotos(prev => prev.slice(0, -1));
  }

  //  CONTINUE TO EDITOR 
  function goToEditor() {
    if (photos.length === 0) {
      alert("Ambil minimal 1 foto.");
      return;
    }
    sessionStorage.setItem("capturedPhotos", JSON.stringify(photos));
    console.log(JSON.parse(sessionStorage.getItem("capturedPhotos")));
    
    navigate(`/editor?frame=${frameParam}`);
  }

  //  UPLOAD
  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = e => {
      const files = Array.from(e.target.files).slice(0, maxPhotos);
      const readers = files.map(f => new Promise(res => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(f);
      }));

      Promise.all(readers).then(imgs => {
        setPhotos(prev => [...prev, ...imgs].slice(0, maxPhotos));
      });
    };

    input.click();
  }


  // Render UI
  return (
    <MainLayout>
      <div className="w-full bg-linear-to-b from-white to-purple-50 py-8 px-20">
        <div className="max-w-7xl mx-auto">

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-full shadow-md p-1">
              <button className="px-6 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 hover:-translate-x-1 transition">
                Camera
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 rounded-full text-pink-500 font-semibold hover:bg-pink-100 hover:translate-x-1 transition"
              >
                Upload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* LEFT SETTINGS */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl border border-pink-300 p-5 shadow-lg">
                <h3 className="font-bold text-pink-400 text-lg mb-3">Camera Settings</h3>

                <div className="p-4 bg-purple-50 rounded-xl border border-pink-200 mb-4 text-center">
                  <p className="text-xs text-gray-600">Selected Frame</p>
                  <p className="font-bold text-pink-700">Frame {frameParam}</p>
                  <p className="text-xs text-gray-600">{maxPhotos} photos needed</p>
                </div>

                <label className="text-sm font-semibold text-pink-400 block mb-2">Delay</label>
                <select
                  className="w-full p-2 rounded-lg border border-pink-200 text-gray-700 mb-4"
                  value={delay}
                  onChange={e => setDelay(Number(e.target.value))}
                >
                  <option value="3">3 Seconds</option>
                  <option value="5">5 Seconds</option>
                  <option value="7">7 Seconds</option>
                </select>

                <button
                  onClick={() => setUseFront(p => !p)}
                  className="w-full p-3 rounded-lg bg-pink-600 text-white mb-3 hover:bg-pink-500 hover:-translate-y-2 transition"
                >
                  {useFront ? "Front Camera" : "Back Camera"}
                </button>

                <button
                  onClick={() => setMirrorOn(m => !m)}
                  className="w-full p-3 rounded-lg border border-pink-300 text-pink-500 hover:scale-105 transition"
                >
                  {mirrorOn ? "Mirror On" : "Mirror Off"}
                </button>

                <div className="mt-4 text-sm font-medium text-pink-400">
                  <button
                    className="mt-2 px-3 py-2 rounded-md border border-pink-200 text-pink-500"
                    onClick={() => alert("Effects — ditambahkan di halaman editor.")}
                  >
                    Show Effects
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER CAMERA */}
            <div className="md:col-span-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-300 relative">

                {/* countdown overlay */}
                <div ref={countdownBoxRef} className="absolute inset-0 z-30 hidden flex items-center justify-center">
                  <div ref={countdownRef} className="countdown-text text-bold text-2xl">3</div>
                </div>

                {/* camera */}
                <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ paddingTop: "75%" }}>
                  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hidden"></canvas>
                </div>

                {/* take btn */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleTakePhoto}
                    className={`px-8 py-3 rounded-full bg-pink-600 text-white hover:scale-105 transition ${
                      photos.length >= maxPhotos ? "opacity-50" : ""
                    }`}
                  >
                    📸 Take Photos ({maxPhotos - photos.length} remaining)
                  </button>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <div className="flex gap-3">
                    <button onClick={retakeLast} className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-200 hover:scale-105 transition">
                      Retake Last
                    </button>
                    <button onClick={resetPhotos} className="px-3 py-2 bg-white border border-pink-200 rounded-xl text-pink-500 hover:bg-pink-100 hover:scale-105 transition">
                      Reset Photos
                    </button>
                  </div>

                  <button onClick={goToEditor} className="px-4 py-2 bg-pink-300 text-pink-800 rounded-lg">
                    Complete {photos.length}/{maxPhotos} Photos
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl p-5 border border-pink-300 shadow-lg h-full flex flex-col">

                {/* header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-pink-500">Photos</h3>
                    <p className="text-xs text-gray-600">Your collection</p>
                  </div>
                  <div className="text-pink-600 font-bold">{photos.length}/{maxPhotos}</div>
                </div>

                {/* progress */}
                <div className="mt-4">
                  <div className="w-full bg-gray-100 h-3 rounded-full">
                    <div
                      className="h-3 bg-pink-400 rounded-full"
                      style={{ width: `${(photos.length / maxPhotos) * 100}%` }}
                    />
                  </div>
                </div>

                {/* thumb */}
                <div
                  className={`
                    mt-5 grid gap-4 flex-1
                    ${
                      photos.length <= 3 
                        ? "grid-cols-1"                           // 1–3 foto → memanjang
                        : "grid-cols-2"                           // 4+ → 2 kolom
                    }
                  `}
                >
                  {photos.length === 0 ? (
                    <div className="w-full h-48 border-2 border-dashed border-pink-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">📷 No Photos Yet</div>
                    </div>
                  ) : (
                    photos.map((p, i) => (
                      <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                        
                        {/* FIX ukuran gambar */}
                        <div className="w-full h-32 sm:h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img 
                            src={p}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        <div className="p-2 text-center text-sm">#{i + 1}</div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={resetPhotos}
                  className="mt-4 w-full py-3 border border-pink-300 rounded-xl hover:bg-pink-100 hover:scale-105 transition text-pink-500"
                >
                  Reset Photos
                </button>
                <button
                  onClick={goToEditor}
                  className="w-full py-3 bg-pink-600 rounded-xl hover:bg-pink-700 hover:translate-x-3 transition text-white mt-3"
                >
                  Continue to Editing -&gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
