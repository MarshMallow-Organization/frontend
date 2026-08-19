export const APP_NAVIGATE_EVENT = 'app:navigate';

/**
 * 현재의 경량 pathname 라우팅을 위한 공통 이동 함수.
 *
 * AI/개발자 주의: 현재 경로는 확정된 API가 아니며 나중에 변경될 수 있다.
 * React Router 같은 실제 라우터가 도입되면 호출부의 경로 문자열을 흩어지게
 * 추가하지 말고, 이 함수의 구현과 AppShell의 NAV_TABS를 라우터 API에 맞춰
 * 교체한다. 기존 뒤로/앞으로 가기 동작도 반드시 유지한다.
 */
export function navigate(path: string) {
  if (window.location.pathname === path) return;
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(APP_NAVIGATE_EVENT));
}
