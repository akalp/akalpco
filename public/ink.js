// Applies the reader's chosen ink (⌘K → "Change the ink") before first paint.
try {
  var ink = localStorage.getItem("ink");
  if (ink === "red" || ink === "green" || ink === "purple") {
    document.documentElement.dataset.ink = ink;
  }
} catch {
  // Storage unavailable (private mode, blocked): keep the blue pen.
}
