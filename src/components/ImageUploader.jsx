import { useRef, useState } from "react"
import { Camera, ImagePlus, X } from "lucide-react"

export default function ImageUploader({ onImageSelected, preview, fileName, onClear }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]
    if (file && file.type.startsWith("image/")) {
      onImageSelected(file)
    }
  }

  if (preview) {
    return (
      <div className="card p-4 sm:p-5">
        <div className="relative rounded-2xl overflow-hidden bg-primary-50">
          <img src={preview} alt="Uploaded crop preview" className="w-full max-h-80 object-cover" />
          <button
            onClick={onClear}
            aria-label="Remove photo"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-soft"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-ink-muted mt-3 truncate">{fileName}</p>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      className={`card border-2 border-dashed p-10 sm:p-14 flex flex-col items-center text-center transition-colors ${
        dragOver ? "border-primary bg-primary-50" : "border-border"
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-4" aria-hidden="true">
        📷
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">Upload Crop Photo</h3>
      <p className="text-sm text-ink-muted mt-1 max-w-xs">
        Drag and drop an image here, or choose an option below. Clear, well-lit photos work best.
      </p>
      <div className="flex flex-wrap gap-3 mt-6">
        <button onClick={() => inputRef.current?.click()} className="btn-primary">
          <ImagePlus size={17} /> Upload Photo
        </button>
        <button
          onClick={() => inputRef.current?.setAttribute("capture", "environment") || inputRef.current?.click()}
          className="btn-secondary"
        >
          <Camera size={17} /> Take a Photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
