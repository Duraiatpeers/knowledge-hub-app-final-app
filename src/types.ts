/**
 * types.ts
 *
 * The one thing JS never had: a shared, explicit shape for the data
 * flowing through the app. Every component that used to just "know"
 * what an article or a user looked like now imports these instead.
 */

/** One article, exactly as db.json's "articles" collection stores it. */
export interface Article {
  id: number
  title: string
  category: string
  author: string
  description: string
  likes: number
  isFavourite: boolean
}

/**
 * One user, exactly as db.json's "users" collection stores it.
 *
 * Yes, this includes password as a plain string, matching the mock
 * auth exactly. Typing it doesn't make it safer — it just describes
 * the shape honestly.
 */
export interface User {
  id: number
  username: string
  password: string
  name: string
}

