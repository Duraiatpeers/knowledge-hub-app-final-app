/**
 * Header.tsx - top bar with navigation and logout.
 *
 * Before: received `user` and `onLogout` as props from App.
 * After:  zero props. Reads the user from the store and dispatches logout().
 */
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { logout, selectCurrentUser } from './features/auth/authSlice'

function Header() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  // App only renders <Header> when logged in, but guard anyway for type safety
  if (!user) return null

  return (
    <header className="app-header">
      <h1>KnowledgeHub</h1>

      <nav className="app-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn')}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/articles"
          className={({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn')}
        >
          Articles
        </NavLink>
      </nav>

      <div className="app-user">
        <span>Hi, {user.name}</span>
        {/* logout() clears state.auth.user -> App's route guards redirect to /login */}
        <button className="logout-btn" onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </header>
  )
}

export default Header
