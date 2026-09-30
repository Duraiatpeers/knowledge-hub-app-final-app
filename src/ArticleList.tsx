/**
 * ArticleList.tsx - grid of ArticleCards.
 *
 * Before: const { articles, loading, error } = useArticles()
 * After:  three useAppSelector calls, one per piece of state it needs.
 *         Each selector subscribes independently, so this list only
 *         re-renders when one of those three values actually changes.
 */
import { useAppSelector } from './store/hooks'
import {
  selectAllArticles,
  selectArticlesError,
  selectArticlesLoading,
} from './features/articles/articlesSlice'
import ArticleCard from './ArticleCard.tsx'

function ArticleList() {
  const articles = useAppSelector(selectAllArticles)
  const loading = useAppSelector(selectArticlesLoading)
  const error = useAppSelector(selectArticlesError)

  if (loading) {
    return <p className="status-message">Loading articles…</p>
  }

  if (error) {
    return <p className="status-message status-error">{error}</p>
  }

  if (articles.length === 0) {
    return <p className="empty-state">No articles yet. Check back soon.</p>
  }

  return (
    <div className="article-grid">
      {/* Presentational child: gets data via props, dispatches its own actions */}
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

export default ArticleList
