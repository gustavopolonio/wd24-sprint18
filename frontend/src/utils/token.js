const TOKEN_KEY = "jwt"

export function setJwtInLocalStorage(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getJwtInLocalStorage() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeJwtFromLocalStorage() {
  return localStorage.removeItem(TOKEN_KEY)
}