/**
 * lib/mongodb.ts
 *
 * A small, strongly-typed Mongoose connection helper for Next.js (TypeScript).
 * - Caches the Mongoose connection on the global object to avoid multiple
 *   connections during development (Next.js hot reloads can re-run module code).
 * - Exports an async `connectToDatabase` function that returns the Mongoose
 *   singleton and can be awaited in API routes or server-side code.
 *
 * Usage:
 *   import connectToDatabase from '@/lib/mongodb'
 *   const mongoose = await connectToDatabase()
 */

import mongoose, { ConnectOptions, Mongoose } from 'mongoose'

const MONGODB_URI = process.env.NEXT_PUBLIC_DB_URL

if (!MONGODB_URI) {
  throw new Error(
    'Please define the NEXT_PUBLIC_DB_URL environment variable inside .env.local'
  )
}

const mongoUri = MONGODB_URI

declare global {
  // Allow caching across module reloads in development.
  // We attach `mongooseCache` to the global object so HMR doesn't open
  // multiple connections. This avoids `MongooseError: Cannot overwrite` and
  // other connection issues when code is reloaded.
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  } | undefined
}

// Use existing cache or create a fresh one
const cache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cache

/**
 * Connect to MongoDB using Mongoose and return the Mongoose instance.
 * The function caches the connection so repeated calls return the same
 * Mongoose instance instead of opening new TCP connections.
 */
export default async function connectToDatabase(): Promise<Mongoose> {
  // Return early if a connection is already established
  if (cache.conn) {
    return cache.conn
  }

  // If a connection is being established, wait for it
  if (cache.promise) {
    cache.conn = await cache.promise
    return cache.conn
  }

  // Connection options - tuned for stable production defaults
  const options: ConnectOptions = {
    // Don't buffer commands when disconnected; fail fast instead.
    bufferCommands: false,
    // Reduce noise: don't auto-create indexes in production by default.
    autoIndex: false,
    // Use a reasonable pool size and timeouts; tweak as needed for your app.
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }

  // Create the connection promise and cache it immediately to avoid races.
  cache.promise = mongoose
    .connect(mongoUri, options)
    .then(() => mongoose)
    .catch((err: unknown) => {
      // If the initial connection fails, clear the promise so retries can run.
      // Explicitly type the error as `unknown` to avoid implicit `any`.
      cache.promise = null
      throw err
    })

  cache.conn = await cache.promise
  return cache.conn
}

// Also export the raw mongoose object for advanced usage (models, helpers).
export { mongoose }
