/**
 * store/store.ts
 *
 * THE single Redux store for KnowledgeHub.
 *
 * Before (Context API): state lived inside <ArticlesProvider> (useState)
 * and the logged-in user lived in <App> (useState), passed down as props.
 *
 * After (Redux Toolkit): ALL shared state lives here, split into "slices".
 * Each slice owns one part of the state tree:
 *
 *   state = {
 *     auth:     { user, status, error }            <- authSlice.ts
 *     articles: { items, status, error }           <- articlesSlice.ts
 *   }
 *
 * configureStore() gives us, for free:
 *   - redux-thunk middleware (so we can dispatch async thunks)
 *   - Redux DevTools browser extension support
 *   - dev-only checks for accidental state mutation / non-serialisable values
 */
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import articlesReducer from '../features/articles/articlesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,         // state.auth
    articles: articlesReducer, // state.articles
  },
})

/**
 * Types inferred FROM the store itself, so they never drift out of sync.
 * Add a new slice to `reducer` above and RootState updates automatically.
 */
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
