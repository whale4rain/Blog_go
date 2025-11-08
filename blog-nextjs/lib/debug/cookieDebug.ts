// ============================================================================
// Cookie Debug Helper - Temporary diagnostic tool
// ============================================================================

/**
 * Check if refresh_token cookie exists and log its properties
 * Note: Since it's HttpOnly, we can only see if it's sent in requests via DevTools
 */
export function checkRefreshTokenCookie() {
  if (typeof window === 'undefined') return;

  console.group('🍪 Cookie Debug Info');
  
  // Check all visible cookies (won't include HttpOnly ones)
  console.log('All visible cookies:', document.cookie);
  
  // Check localStorage
  console.log('localStorage.access_token:', localStorage.getItem('access_token'));
  console.log('localStorage.user:', localStorage.getItem('user'));
  console.log('localStorage.user-storage (Zustand):', localStorage.getItem('user-storage'));
  
  // Instructions
  console.log('%c📋 To check refresh_token cookie:', 'font-weight: bold; color: blue;');
  console.log('1. Open DevTools → Application → Cookies');
  console.log('2. Look for domain: localhost or 127.0.0.1');
  console.log('3. Check if "x-refresh-token" cookie exists');
  console.log('4. Verify its properties: HttpOnly=✓, Path=/, Domain=(empty or localhost)');
  
  console.groupEnd();
}

/**
 * Monitor when cookies might be cleared
 */
export function setupCookieMonitor() {
  if (typeof window === 'undefined') return;

  // Log on page load
  console.log('🔍 [Cookie Monitor] Page loaded at:', new Date().toISOString());
  checkRefreshTokenCookie();

  // Log before page unload
  window.addEventListener('beforeunload', () => {
    console.log('🔍 [Cookie Monitor] Page unloading at:', new Date().toISOString());
    checkRefreshTokenCookie();
  });

  // Log when visibility changes
  document.addEventListener('visibilitychange', () => {
    console.log('🔍 [Cookie Monitor] Visibility changed:', document.visibilityState);
    checkRefreshTokenCookie();
  });
}
