# KnowledgeHub – React 19 + Redux Toolkit

KnowledgeHub is a small React + TypeScript + Vite app (login, dashboard, article list, article detail)
backed by a json-server mock API. This version replaces the Context API (`ArticlesContext.tsx`) and
the `useState` user in `App.tsx` with a single **Redux Toolkit** store.

## Run it

```bash
npm install
npm run server   # json-server on http://localhost:3001 (data/db.json)
npm run dev      # Vite dev server on http://localhost:5173
```

Log in with `anita / anita123` or `rahul / rahul123`.

## Where the state lives now

```
src/
├── store/
│   ├── store.ts            configureStore + RootState / AppDispatch types
│   └── hooks.ts            useAppDispatch / useAppSelector (typed hooks)
├── features/
│   ├── auth/authSlice.ts          user, login thunk, logout, selectors
│   └── articles/articlesSlice.ts  articles, fetch thunk, like / favourite, selectors
├── main.tsx                <Provider store> wraps the app
├── App.tsx                 routes + guards, reads user from the store
└── *.tsx                   components (each file has a header comment explaining its role)
```

| Context API (before)                        | Redux Toolkit (after)                                  |
| ------------------------------------------- | ------------------------------------------------------ |
| `<ArticlesProvider>` in App                 | `<Provider store={store}>` in main.tsx                 |
| `useArticles()`                             | `useAppSelector(selectAllArticles)` etc.               |
| `useEffect` + axios in the provider         | `fetchArticles` async thunk                            |
| `setArticles(prev => prev.map(...))`        | `likeArticle` / `toggleFavourite` reducers (Immer)     |
| `user` state + `onLoginSuccess` / `onLogout` props | `authSlice` + `loginUser` thunk + `logout` action |
| Totals computed in Dashboard on each render | `selectDashboardStats` memoised with `createSelector`  |

Tip: install the Redux DevTools browser extension to watch every action and state change.

## Other fixes in this version

- `data/db.json`: articles 5 and 6 were missing an `id`; added `5` and `6`.
- `src/vite-env.d.ts` added so `tsc` accepts CSS imports (the build failed without it).
- `npm run server` script added for json-server.
