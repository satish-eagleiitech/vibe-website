const KEY = "vybe-signed-in";

export function isSignedIn() {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markSignedIn() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("vybe-auth"));
}

export function markSignedOut() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("vybe-auth"));
}
