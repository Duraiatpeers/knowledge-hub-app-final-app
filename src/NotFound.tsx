/**
 * NotFound.tsx - catch-all route (path="*"). Purely presentational.
 */
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="status-message">
      <p>Page not found.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  )
}

export default NotFound