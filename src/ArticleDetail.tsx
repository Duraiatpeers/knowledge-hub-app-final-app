/**
 * ArticleDetail.tsx - single article page at /articles/:id
 *
 * Uses a parameterised selector: selectArticleById(state, id).
 * Because Like / Favourite update the SAME store, changes made here also
 * show up on the list page and the dashboard totals.
 */
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
  likeArticle,
  selectArticleById,
  selectArticlesError,
  selectArticlesLoading,
  toggleFavourite,
} from './features/articles/articlesSlice'

function ArticleDetail() {
  const { id } = useParams<'id'>()
  const dispatch = useAppDispatch()

  const loading = useAppSelector(selectArticlesLoading)
  const error = useAppSelector(selectArticlesError)
  // Pass the route param into the selector via an inline arrow function
  const article = useAppSelector(state => selectArticleById(state, id))

  if (loading) {
    return <p className="status-message">Loading article…</p>
  }

  if (error) {
    return <p className="status-message status-error">{error}</p>
  }

  if (!article) {
    return (
      <p className="empty-state">
        No article with id "{id}". <Link to="/articles">Back to articles</Link>
      </p>
    )
  }

  return (
    <div className="article-grid">
      <div className="card">
        <h3>{article.title}</h3>
        <p>{article.category} · {article.author}</p>
        <p>{article.description}</p>
        <p>Likes: {article.likes}</p>

        {article.isFavourite && <span className="badge">★ Favourite</span>}

        <div className="btn-row">
          <button onClick={() => dispatch(likeArticle(article.id))}>Like</button>
          <button onClick={() => dispatch(toggleFavourite(article.id))}>
            {article.isFavourite ? 'Unfavourite' : 'Favourite'}
          </button>
        </div>

        <p><Link to="/articles">Back to articles</Link></p>
      </div>
    </div>
  )
}

export default ArticleDetail
