/**
 * App.tsx - layout + route table.
 *
 * What changed with Redux:
 *   - No more `useState<User>` here: the logged-in user comes from the
 *     store via useAppSelector(selectCurrentUser).
 *   - No more handleLoginSuccess / handleLogout callbacks passed as props.
 *     <Login> and <Header> dispatch their own actions.
 *   - No more <ArticlesProvider>: <Provider store> in main.tsx covers it.
 *   - Articles are fetched once the user is logged in (dispatch(fetchArticles())).
 */
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Login from './Login.tsx'
import Dashboard from './Dashboard.tsx'
import ArticleList from './ArticleList.tsx'
import ArticleDetail from './ArticleDetail.tsx'
import NotFound from './NotFound.tsx'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectCurrentUser } from './features/auth/authSlice'
import { fetchArticles } from './features/articles/articlesSlice'

function App() {
  const dispatch = useAppDispatch()

  // Read the user from the global store. App re-renders when it changes
  // (login / logout), which re-evaluates the route guards below.
  const user = useAppSelector(selectCurrentUser)

  // Load articles as soon as someone is logged in.
  // The thunk's `condition` makes this a no-op if they're already loaded,
  // so logging out and back in does not re-fetch.
  useEffect(() => {
    if (user) {
      dispatch(fetchArticles())
    }
  }, [user, dispatch])

  return (
    <>
      {/* Header no longer needs user / onLogout props - it reads the store */}
      {user && <Header />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />

        {/* Public route: redirect away if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected routes: bounce to /login when there is no user */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/articles"
          element={user ? <ArticleList /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/articles/:id"
          element={user ? <ArticleDetail /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {user && <Footer />}
    </>
  )
}

export default App
