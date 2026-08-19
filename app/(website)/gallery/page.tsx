const GALLERY = [
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80",
  "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
];

export default function GalleryPage() {
  return (
    <div className="bg-[#F5F5F3]">
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-white/50">Our work speaks for itself.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {GALLERY.map((img, i) => (
            <div key={i} className={`overflow-hidden group cursor-pointer ${i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}`}>
              <img
                src={img}
                alt={`Revive Auto Detail gallery ${i + 1}`}
                className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-500 grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
