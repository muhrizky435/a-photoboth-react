import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Photo from "./pages/Photo";
import Frame from "./pages/Frame";
import Editor from "./pages/Editor";
// import Album from "./pages/Album";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/editor" element={<Editor />} />
        {/* <Route path="/album" element={<Album />} /> */}

        {/* fallback → seperti Laravel fallback */}
        <Route path="*" element={<Landing />} />

      </Routes>
    </BrowserRouter>
  );
}
