/**
 * features/articles/articlesSlice.ts
 *
 * Owns the list of articles plus its loading / error status.
 *
 * Before: ArticlesContext.tsx held three useState hooks (articles, loading,
 *         error), fetched in a useEffect, and exposed likeArticle /
 *         toggleFavourite through the context value.
 * After:  the same data and behaviour, expressed as a Redux slice:
 *           - fetchArticles   -> async thunk (replaces the useEffect fetch)
 *           - likeArticle     -> reducer
 *           - toggleFavourite -> reducer
 *           - select*         -> selectors (replace `useArticles()`)
 */
import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RootState } from '../../store/store'
import type { Article } from '../../types'

const ARTICLES_URL = 'http://localhost:3001/articles'

/* ------------------------------------------------------------------ */
/* 1. State shape                                                      */
/* ------------------------------------------------------------------ */
interface ArticlesState {
  items: Article[]
  // A single status field replaces the old `loading` boolean. 'idle' means
  // "not requested yet" - useful to avoid fetching twice.
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ArticlesState = {
  items: [],
  status: 'idle',
  error: null,
}

/* ------------------------------------------------------------------ */
/* 2. Async thunk: fetchArticles (GET /articles)                       */
/* ------------------------------------------------------------------ */
export const fetchArticles = createAsyncThunk<
  Article[],
  void,
  { state: RootState; rejectValue: string }
>(
  'articles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Article[]>(ARTICLES_URL)
      return response.data
    } catch (err) {
      console.error('Failed to fetch articles:', err)
      return rejectWithValue('Could not load articles. Is json-server running on port 3001?')
    }
  },
  {
    // `condition` runs BEFORE the thunk. Returning false cancels it.
    // This replaces the old `isMounted` flag and also stops React 18/19
    // StrictMode's double-invoked effects from firing two GET requests.
    condition: (_, { getState }) => {
      const { status } = getState().articles
      return status === 'idle' || status === 'failed'
    },
  },
)

/* ------------------------------------------------------------------ */
/* 3. The slice                                                        */
/* ------------------------------------------------------------------ */
const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    // dispatch(likeArticle(id)) -> +1 like on that article (client-side only,
    // exactly like the Context version - nothing is written back to db.json)
    likeArticle(state, action: PayloadAction<number>) {
      const article = state.items.find(a => a.id === action.payload)
      if (article) {
        article.likes += 1 // Immer: safe "mutation"
      }
    },

    // dispatch(toggleFavourite(id)) -> flip isFavourite
    toggleFavourite(state, action: PayloadAction<number>) {
      const article = state.items.find(a => a.id === action.payload)
      if (article) {
        article.isFavourite = !article.isFavourite
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Something went wrong.'
      })
  },
})

export const { likeArticle, toggleFavourite } = articlesSlice.actions
export default articlesSlice.reducer

/* ------------------------------------------------------------------ */
/* 4. Selectors                                                        */
/* ------------------------------------------------------------------ */
export const selectAllArticles = (state: RootState) => state.articles.items
export const selectArticlesStatus = (state: RootState) => state.articles.status
export const selectArticlesError = (state: RootState) => state.articles.error

// "Still loading" = not requested yet OR request in flight
export const selectArticlesLoading = (state: RootState) =>
  state.articles.status === 'idle' || state.articles.status === 'loading'

// Look up one article by the :id route param (a string)
export const selectArticleById = (state: RootState, id: string | undefined) =>
  id ? state.articles.items.find(a => String(a.id) === id) : undefined

/**
 * Derived data for the Dashboard.
 * createSelector MEMOISES the result: the totals are recalculated only when
 * `items` changes, and the returned object keeps the same reference
 * otherwise - so <Dashboard> doesn't re-render needlessly.
 */
export const selectDashboardStats = createSelector([selectAllArticles], items => ({
  totalArticles: items.length,
  totalLikes: items.reduce((sum, a) => sum + a.likes, 0),
  favouriteCount: items.filter(a => a.isFavourite).length,
}))
