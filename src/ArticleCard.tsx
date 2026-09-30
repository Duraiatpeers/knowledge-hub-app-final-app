/**
 * ArticleCard.tsx - one article tile with View / Like / Favourite buttons.
 *
 * Data comes in as a prop (from ArticleList). User actions go OUT as
 * Redux actions via dispatch - the card doesn't need to know who else
 * cares (Dashboard totals update automatically).
 *
 * Before: const { likeArticle, toggleFavourite } = useArticles()
 * After:  dispatch(likeArticle(id)) / dispatch(toggleFavourite(id))
 */
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { likeArticle, toggleFavourite } from './features/articles/articlesSlice'
import type { Article } from './types'

interface ArticleCardProps {
  article: Article
}

function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id, title, author, description, likes, isFavourite } = article

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{author}</p>
      <p>{description}</p>
      <p>Likes: {likes}</p>
      {isFavourite && <span className="badge">★ Favourite</span>}

      <div className="btn-row">
        <button onClick={() => navigate(`/articles/${id}`)}>View</button>
        {/* action = { type: 'articles/likeArticle', payload: id } */}
        <button onClick={() => dispatch(likeArticle(id))}>Like</button>
        {/* action = { type: 'articles/toggleFavourite', payload: id } */}
        <button onClick={() => dispatch(toggleFavourite(id))}>
          {isFavourite ? 'Unfavourite' : 'Favourite'}
        </button>
      </div>
    </div>
  )
}

export default ArticleCard
