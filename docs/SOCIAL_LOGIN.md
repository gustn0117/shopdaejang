# 소셜로그인 (카카오 · 네이버) 설정 가이드

샵대장은 카카오와 네이버 두 가지 소셜 로그인을 지원합니다.
프론트엔드 코드는 이미 반영되어 있으며, 이 문서는 외부 콘솔과 서버 환경변수 설정 절차를 정리합니다.

---

## 1. 카카오 — Supabase 네이티브 OAuth Provider

카카오는 Supabase Auth가 기본 지원하므로 콜백 URL을 카카오 콘솔에 등록하고 Supabase 환경변수만 추가하면 됩니다.

### 1-1. 카카오 디벨로퍼스 콘솔

1. https://developers.kakao.com → "내 애플리케이션" → **애플리케이션 추가하기**
2. 앱 생성 후 **요약 정보**에서 다음 값 확보:
   - **REST API 키** → Supabase의 Client ID로 사용
3. **카카오 로그인** 메뉴 → **활성화 설정** ON
4. **Redirect URI** 추가:
   ```
   https://api.hsweb.pics/auth/v1/callback
   ```
   ※ 자체 호스팅 Supabase의 GoTrue 콜백 주소. 도메인이 다르면 그에 맞춰 변경.
5. **보안** 탭 → **Client Secret 코드 생성** → 발급된 값을 보관 (사용 상태 "사용함"으로 변경 필수)
6. **동의항목** → 필요한 동의 항목 설정:
   - 카카오계정(이메일): 필수 동의 (또는 선택 동의)
   - 닉네임: 필수 동의
   ※ 휴대폰 번호는 기본 동의 항목에 없음 → 가입 후 `/onboarding`에서 직접 입력받음.
7. **앱 설정 → 플랫폼**에서 Web 플랫폼 추가:
   ```
   https://shopdaejang.hsweb.pics
   ```

### 1-2. 자체 호스팅 Supabase 서버 (api.hsweb.pics) 환경변수

GoTrue 컨테이너의 환경변수에 다음을 추가합니다. (docker-compose.yml 또는 .env)

```env
GOTRUE_EXTERNAL_KAKAO_ENABLED=true
GOTRUE_EXTERNAL_KAKAO_CLIENT_ID=<카카오 REST API 키>
GOTRUE_EXTERNAL_KAKAO_SECRET=<카카오 Client Secret>
GOTRUE_EXTERNAL_KAKAO_REDIRECT_URI=https://api.hsweb.pics/auth/v1/callback
GOTRUE_SITE_URL=https://shopdaejang.hsweb.pics
GOTRUE_URI_ALLOW_LIST=https://shopdaejang.hsweb.pics,https://shopdaejang.hsweb.pics/auth/callback
```

GoTrue 컨테이너 재시작:
```bash
docker compose up -d --force-recreate auth
```

### 1-3. 동작 흐름

1. 사용자가 `/login` 또는 `/signup`에서 **카카오로 시작하기** 클릭
2. `supabase.auth.signInWithOAuth({ provider: 'kakao' })` → 카카오 인증 페이지
3. 인증 완료 후 `https://api.hsweb.pics/auth/v1/callback`에서 `https://shopdaejang.hsweb.pics/auth/callback?code=...`로 리다이렉트
4. Next.js 라우트 `app/auth/callback/route.ts`가 `exchangeCodeForSession`으로 세션 생성
5. `profiles` 테이블 업서트 + 휴대폰 미입력 시 `/onboarding`로 이동

---

## 2. 네이버 — 자체 OAuth Route Handler

네이버는 Supabase가 기본 지원하지 않으므로 자체 OAuth 2.0 코드 흐름을 Next.js 라우트로 구현했습니다.

### 2-1. 네이버 디벨로퍼스 콘솔

1. https://developers.naver.com → **Application → 애플리케이션 등록**
2. 사용 API: **네이버 로그인**
3. 제공 정보 선택 (권장):
   - 회원이름, 이메일 주소, 휴대전화번호, 별명
   ※ 휴대전화번호를 필수로 설정하면 가입 즉시 phone이 들어와 onboarding을 건너뛸 수 있습니다.
4. **로그인 오픈 API 서비스 환경 → 환경 추가 → PC웹**
   - 서비스 URL: `https://shopdaejang.hsweb.pics`
   - Callback URL: `https://shopdaejang.hsweb.pics/api/auth/naver/callback`
5. 등록 후 **Client ID**와 **Client Secret** 확보

### 2-2. Next.js 환경변수 (.env.local 또는 배포 환경)

```env
NAVER_CLIENT_ID=<네이버 Client ID>
NAVER_CLIENT_SECRET=<네이버 Client Secret>
```

배포 환경 (Docker 등)에서도 동일하게 주입. 빌드 시 변수가 필요하지 않으므로 런타임 env로 전달하면 충분.

### 2-3. 동작 흐름

1. 사용자가 **네이버로 시작하기** 클릭
2. 브라우저가 `/api/auth/naver/start?redirect=...`로 이동
3. 서버가 state 쿠키를 발급하고 `https://nid.naver.com/oauth2.0/authorize`로 리다이렉트
4. 네이버 인증 후 `/api/auth/naver/callback?code=...&state=...`로 복귀
5. 서버가 다음 순서로 처리:
   - state 검증
   - code → access_token 교환
   - access_token으로 `/v1/nid/me` 조회 → id/email/name/mobile
   - Supabase admin API로 사용자 생성 (이미 있으면 기존 사용자 조회)
   - admin `generateLink('magiclink')` → `hashed_token` 추출
   - `supabase.auth.verifyOtp({ type: 'magiclink', token_hash })`로 세션 쿠키 발급
   - `profiles` 업서트 + 휴대폰 미입력 시 `/onboarding`로 이동

### 2-4. 이메일이 없는 경우

네이버에서 이메일 제공 동의를 받지 못한 경우, `naver_{id}@social.shopdaejang.local`을 합성 이메일로 사용합니다. Supabase Auth는 이메일을 unique key로 사용하므로 이 형식이면 충돌 없음.

---

## 3. 공통: `/onboarding` 강제 입력 페이지

소셜 로그인으로 가입한 사용자가 휴대폰 번호 없이 페이지를 탐색하려 하면 `middleware.ts`가 모든 보호 경로에서 `/onboarding`으로 강제 리다이렉트합니다.

저장되는 항목:
- `auth.users.user_metadata.name`, `user_metadata.phone`
- `shopdaejang.profiles` 테이블의 `name`, `phone`

해당 페이지를 거치지 않으면 사이트 대부분의 기능을 사용할 수 없습니다. 공개 경로(`/login`, `/signup`, `/auth/*`, `/api/*`, `/admin/*`, `/onboarding` 자신)는 우회 가능.

---

## 4. 환경변수 요약

```env
# 기존 (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://api.hsweb.pics
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_SCHEMA=shopdaejang

# 추가 (네이버)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

Supabase 자체 호스팅 GoTrue 측에서는 카카오 provider를 환경변수로 활성화 (1-2 참조).

---

## 5. 테스트 체크리스트

- [ ] `/login` 에서 카카오 로그인 → 신규 계정이면 `/onboarding` 으로 이동
- [ ] `/onboarding` 에서 이름·휴대폰 입력 → 매물 등록까지 진입 가능
- [ ] `/login` 에서 네이버 로그인 → 동일 흐름
- [ ] 동일 이메일로 두 번째 로그인 시 기존 계정 재사용 (사용자 새로 생성되지 않음)
- [ ] 휴대폰 입력 후에는 `/onboarding`이 더 이상 강제 리다이렉트되지 않음
- [ ] `auth.users.user_metadata.phone` 과 `profiles.phone` 동일 값으로 저장

---

## 6. 트러블슈팅

| 증상 | 원인 | 대응 |
|---|---|---|
| 카카오 로그인 후 `error=missing_code` | Kakao Redirect URI 미일치 | 카카오 콘솔 Redirect URI = `https://api.hsweb.pics/auth/v1/callback` 확인 |
| 카카오 로그인 후 `unsupported_provider` | GoTrue env 미설정 | `GOTRUE_EXTERNAL_KAKAO_*` 추가 후 컨테이너 재시작 |
| 네이버 `invalid_state` | 쿠키 차단/HTTPS 불일치 | start와 callback이 같은 도메인·HTTPS 인지 확인 |
| 네이버 후 `user_lookup_failed` | 사용자 수 200 초과 | `listUsers({ perPage: 200 })`을 페이지네이션으로 변경 (현재 코드 한계) |
| `/onboarding`에서 무한 리다이렉트 | middleware 공개 경로 누락 | `isPublicPath` 함수 확인 |
