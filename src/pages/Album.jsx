import React from "react";
import MainLayout from "../layouts/MainLayout";

export default function Album() {
  const album = JSON.parse(localStorage.getItem("photoAlbum") || "[]");

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-pink-600">
                My Album
              </h1>
              <p className="text-gray-500 mt-1">
                Semua hasil edit fotomu tersimpan di sini ✨
              </p>
            </div>

            <span className="text-sm bg-pink-100 text-pink-600 px-4 py-1 rounded-full font-semibold">
              {album.length} Foto
            </span>
          </div>

          {/* EMPTY STATE */}
          {album.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-24">
              <div className="text-6xl mb-4">📷</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                Album Masih Kosong
              </h2>
              <p className="text-gray-500 max-w-sm">
                Setelah kamu selesai edit foto dan klik <b>Simpan ke Album</b>,
                hasilnya akan muncul di sini.
              </p>
            </div>
          )}

          {/* GRID ALBUM */}
          {album.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {album.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <img
                        src={item.image}
                        alt="Album"
                        className="w-full max-h-80 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>  

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-end">
                    <div className="w-full p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <p className="text-xs text-white">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="p-3 text-xs text-gray-400 bg-white">
                    {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
