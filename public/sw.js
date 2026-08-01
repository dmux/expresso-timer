/*
 * Offline shell for the installed app.
 *
 * A pomodoro that stops working on the underground is not much of a pomodoro: the timer
 * is entirely client-side — clock, settings and history all live in the browser — so
 * once the shell is cached there is nothing left to be offline about.
 *
 * Bump CACHE to evict everything; `activate` deletes any other version.
 */

const CACHE = "expresso-timer-v1"

/** Enough to boot with no network. Everything else is picked up as it is requested. */
const SHELL = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Individually, so one 404 during a deploy cannot fail the whole install.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  if (new URL(request.url).origin !== self.location.origin) return

  // Navigations go to the network first, so a deploy is picked up on the next launch
  // rather than pinned until the cache name changes. The cached shell is the fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put("/", copy))
          return response
        })
        .catch(() => caches.match("/").then((hit) => hit ?? Response.error()))
    )
    return
  }

  // Everything else is cache-first: build assets are content-hashed, so a URL that is
  // already in the cache can never be stale.
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ??
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
    )
  )
})
