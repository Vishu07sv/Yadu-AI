import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <span className="text-4xl mb-4" aria-hidden="true">🌾</span>
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-ink-muted mt-2 max-w-sm">
        This field hasn't been planted yet. Let's get you back to familiar ground.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
