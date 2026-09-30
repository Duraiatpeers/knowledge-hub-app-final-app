/**
 * Login.tsx - sign-in form.
 *
 * State split (a key Redux lesson - not everything belongs in the store):
 *   LOCAL  (useState)  : username, password -> only this form cares
 *   GLOBAL (Redux)     : user, status, error -> App, Header, Dashboard care
 *
 * Before: the component did the axios call itself and reported back via an
 *         `onLoginSuccess` prop.
 * After:  it dispatches the `loginUser` thunk; the thunk talks to the API and
 *         the authSlice stores the result. No props needed.
 */
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { loginUser, selectAuthError, selectAuthStatus } from './features/auth/authSlice'

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Local form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Global auth state (set by the loginUser thunk's pending/rejected cases)
  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)
  const submitting = status === 'loading'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      // .unwrap() turns the thunk result into a normal promise:
      // resolves with the User, or throws on rejectWithValue(...)
      await dispatch(loginUser({ username, password })).unwrap()
      navigate('/dashboard')
    } catch {
      // Nothing to do here - the error message is already in state.auth.error
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>KnowledgeHub</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          required
        />

        {error && <p className="status-message status-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="login-hint">Try: anita / anita123 or rahul / rahul123</p>
      </form>
    </div>
  )
}

export default Login
