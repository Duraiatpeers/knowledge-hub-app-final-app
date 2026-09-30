/**
 * Dashboard.tsx - welcome message + three stat cards.
 *
 * Before: got `user` as a prop and computed totals on every render from
 *         useArticles().
 * After:  reads `user` from the store, and gets pre-computed, memoised
 *         totals from the selectDashboardStats selector.
 */
import { useAppSelector } from './store/hooks'
import { selectCurrentUser } from './features/auth/authSlice'
import {
  selectArticlesError,
  selectArticlesLoading,
  selectDashboardStats,
} from './features/articles/articlesSlice'

function Dashboard() {
  const user = useAppSelector(selectCurrentUser)
  const loading = useAppSelector(selectArticlesLoading)
  const error = useAppSelector(selectArticlesError)

  // Derived state - recalculated only when the articles array changes
  const { totalArticles, totalLikes, favouriteCount } = useAppSelector(selectDashboardStats)

  if (loading) {
    return <p className="status-message">Loading dashboard…</p>
  }

  if (error) {
    return <p className="status-message status-error">{error}</p>
  }

  return (
    <div className="dashboard">
      <h2>Welcome back, {user?.name}</h2>
      <p className="dashboard-subtitle">Here's how KnowledgeHub is doing today.</p>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-value">{totalArticles}</span>
          <span className="stat-label">Articles</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{totalLikes}</span>
          <span className="stat-label">Total likes</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{favouriteCount}</span>
          <span className="stat-label">Favourites</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
