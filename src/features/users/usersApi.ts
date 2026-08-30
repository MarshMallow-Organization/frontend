import { apiFetch } from '../../lib/api';

/**
 * 사용자 도메인 (`/users`). 현재 백엔드에는 조회 엔드포인트(`GET /users/me`)만 있다.
 * 프로필 수정·비밀번호 변경·API Key 저장·소셜 연동 해제 API는 아직 없으므로
 * 마이페이지의 해당 동작은 화면에서 mock으로 처리한다(네트워크 호출 없음).
 */

/**
 * `GET /users/me` 응답.
 *
 * 백엔드 `UserInfoResponseDto`
 * (`../backend/src/domains/users/dto/response/users-info-response.dto.ts`) 기준.
 * `apiFetch`가 공통 래퍼의 `{ data }`를 풀어 이 타입을 그대로 돌려준다.
 */
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string | null;
  /** 토스(증권 API) 계좌 연동 여부와 연동 일시 */
  tossApi: {
    connected: boolean;
    connectedAt: string | null;
  };
  visitCount: number;
  totalTradeCount: number;
}

export function getMyInfo(signal?: AbortSignal): Promise<UserInfo> {
  return apiFetch<UserInfo>('/users/me', { signal });
}
