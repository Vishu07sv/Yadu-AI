import { useState } from 'react'
import { Sprout } from 'lucide-react'
import ImageUploader from '../components/ImageUploader'
import CropAnalysisResult from '../components/CropAnalysisResult'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import { analyzeCrop } from '../services/api'

export default function CropDoctor() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)

  function handleImageSelected(selected) {
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setResult(null)
  }

  function handleClear() {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  async function handleAnalyze() {
    setAnalyzing(true)
    setError(false)
    try {
      const data = await analyzeCrop(file)
      setResult(data)
    } catch {
      setError(true)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-up">
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">AI Crop Doctor</h1>
        <p className="text-ink-muted mt-2">Upload a photo of your crop and let Yadu AI analyze its health.</p>
      </div>

      <ImageUploader
        onImageSelected={handleImageSelected}
        preview={preview}
        fileName={file?.name}
        onClear={handleClear}
      />

      {preview && !result && !analyzing && (
        <Button onClick={handleAnalyze} className="w-full">Analyze Crop</Button>
      )}

      {analyzing && (
        <div className="card p-10 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary-50" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <Sprout size={24} className="absolute inset-0 m-auto text-primary" />
          </div>
          <p className="font-medium text-ink">Yadu AI is analyzing your crop…</p>
          <p className="text-sm text-ink-muted mt-1">This usually takes a few seconds.</p>
        </div>
      )}

      {error && <ErrorState message="We couldn't analyze this photo. Please try again." onRetry={handleAnalyze} />}

      {result && <CropAnalysisResult result={result} />}
    </div>
  )
}
