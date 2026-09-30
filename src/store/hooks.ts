/**
 * store/hooks.ts
 *
 * Typed versions of react-redux's hooks.
 *
 * Components should import THESE instead of the plain `useDispatch` /
 * `useSelector`, so TypeScript knows:
 *   - the full shape of `state` inside every selector (RootState)
 *   - that dispatch() accepts async thunks (AppDispatch)
 *
 * This replaces the old custom `useArticles()` hook from ArticlesContext.
 */
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// useAppDispatch() -> send actions / thunks to the store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// useAppSelector(selector) -> read a piece of state; the component
// re-renders ONLY when the value returned by the selector changes.
export const useAppSelector = useSelector.withTypes<RootState>()
