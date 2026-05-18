# 토스페이먼츠 (광고 결제) 연동 가이드

샵대장의 모든 유료 광고 결제는 **토스페이먼츠 결제위젯 v2** 로 처리합니다.
무료 등록·재연장은 토스를 우회하고 서버에서 즉시 처리합니다.

---

## 1. 흐름 개요

```
[등록 / 연장]
   │  draft 저장
   ▼
[createListingOrder / createRenewOrder]
   │  payments 테이블에 status=pending 행 생성 (orderId 발급)
   ▼
[/payments/checkout/{orderId}]
   │  TossPaymentWidget 마운트 → 사용자가 "결제하기" 클릭
   ▼
[Toss 결제창]
   │  결제 완료 시 successUrl(/payments/success) 로 리다이렉트
   │  실패/취소 시 failUrl(/payments/fail) 로 리다이렉트
   ▼
[/payments/success]
   │  서버에서 confirmCheckout() 호출
   │   1) payments 행 검증 (본인·금액 일치)
   │   2) Toss /v1/payments/confirm POST (Basic auth: secret key)
   │   3) flow=create → listings INSERT (status=approved)
   │      flow=renew  → listings UPDATE (ad_expires_at 연장)
   │   4) payments.status='paid', payment_key/approved_at/raw 기록
   ▼
[/listings/{id} 또는 /mypage/listings  ?paid=1]
```

## 2. 환경변수

`.env.local` 또는 배포 환경:

```env
# 클라이언트 위젯용 (공개 가능)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm

# 서버 confirm/cancel 용 (절대 노출 금지)
TOSS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
```

위 값은 토스가 공식 공개한 **결제위젯 문서용 테스트 키**입니다.
env 가 비어 있으면 [src/lib/toss.ts](../src/lib/toss.ts) 가 자동으로 이 키로 폴백합니다.

**실서비스 키로 교체**:
1. https://app.tosspayments.com → 가맹점 신청 완료
2. **개발자센터 → API 키** 에서 라이브 키 확인:
   - Client Key (gck_live_...)
   - Secret Key (gsk_live_...)
3. 위 환경변수에 실제 키 주입, 컨테이너 재시작.

## 3. DB 스키마 변경

[supabase/migrations/20260518_toss_payments.sql](../supabase/migrations/20260518_toss_payments.sql) 을 자체 호스팅 Supabase Postgres에서 실행:

```sql
ALTER TABLE shopdaejang.payments
  ADD COLUMN IF NOT EXISTS payment_key   text,
  ADD COLUMN IF NOT EXISTS listing_id    bigint REFERENCES shopdaejang.listings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tier          text,
  ADD COLUMN IF NOT EXISTS period        text,
  ADD COLUMN IF NOT EXISTS flow          text CHECK (flow IN ('create', 'renew')),
  ADD COLUMN IF NOT EXISTS pending_payload jsonb,
  ADD COLUMN IF NOT EXISTS raw           jsonb,
  ADD COLUMN IF NOT EXISTS approved_at   timestamptz,
  ADD COLUMN IF NOT EXISTS failed_reason text;
```

기존 `payments` 테이블 컬럼 (`id text, user_id uuid, item text, method text, amount int, status text, created_at`) 위에 누락된 필드를 추가합니다.

**status 값**:
- `pending` — 주문 생성, Toss 결제 진행 전
- `paid` — Toss 승인 완료, 매물 적용 완료
- `failed` — Toss 승인 실패 (failed_reason 에 사유 저장)
- `canceled` — 사용자 취소
- `refunded` / `refund_requested` — 환불 흐름 (관리자 화면에서 사용)

## 4. 토스 가맹점 콘솔 설정

가맹점 승인 후 토스 콘솔에서:

1. **개발자센터 → 결제 위젯**: 위젯 활성화 + 노출할 결제수단 체크 (카드·계좌이체·간편결제 등)
2. **개발자센터 → API 연동 → 결제 콜백 URL**:
   - successUrl: `https://shopdaejang.hsweb.pics/payments/success` (코드에서 자동 전달, 화이트리스트 등록만)
   - failUrl: `https://shopdaejang.hsweb.pics/payments/fail`
3. **개발자센터 → 웹훅** (선택): 결제 상태 변경을 별도 엔드포인트로 푸시받고 싶을 때. 현재 코드는 webhook을 구현하지 않으므로 비활성 권장.

## 5. 테스트 카드

테스트 키를 사용하는 동안 결제창에서 실제 결제는 발생하지 않습니다. 토스가 제공하는 테스트 카드 번호:

- 카드번호: `4330-1234-5678-9112` (Visa 가상)
- 유효기간: 미래 임의 값 (예: 12/30)
- CVC: 임의 3자리
- 카드 비밀번호: 임의 2자리

## 6. 코드 위치

| 파일 | 역할 |
|---|---|
| [src/lib/toss.ts](../src/lib/toss.ts) | confirmTossPayment / cancelTossPayment + clientKey export |
| [src/app/payments/actions.ts](../src/app/payments/actions.ts) | createListingOrder · createRenewOrder · confirmCheckout · recordCheckoutFailure |
| [src/app/payments/checkout/[orderId]/page.tsx](../src/app/payments/checkout/%5BorderId%5D/page.tsx) | 결제 진행 페이지 (위젯 마운트) |
| [src/components/TossPaymentWidget.tsx](../src/components/TossPaymentWidget.tsx) | loadTossPayments → widgets.renderPaymentMethods/renderAgreement/requestPayment |
| [src/app/payments/success/page.tsx](../src/app/payments/success/page.tsx) | Toss 성공 콜백 → confirmCheckout → 리다이렉트 |
| [src/app/payments/fail/page.tsx](../src/app/payments/fail/page.tsx) | Toss 실패 콜백 → payments.status=failed |

## 7. 흐름별 동작

### 신규 매물 등록 (RegisterForm Step 4)

- `selectedPeriod.price === 0` 이면 `createListing()` 즉시 호출 → status=pending 으로 기존 흐름 유지.
- 0원이 아니면 사진 업로드만 마치고 `createListingOrder(draft)` → payments 행 생성 → `/payments/checkout/{orderId}` 로 이동.
- Toss 승인 완료 시점에 `listings` INSERT (status=approved, ad_expires_at 자동 산정).

### 광고 연장 (RenewForm)

- 무료 티어 선택 시 `renewListing()` 즉시 호출.
- 유료 티어 선택 시 `createRenewOrder()` 로 결제 페이지 이동.
- 승인 후 기존 `ad_expires_at` 이 미래면 그 시점부터, 과거면 현재 시점부터 기간을 연장.

## 8. 트러블슈팅

| 증상 | 원인 | 대응 |
|---|---|---|
| 결제창에서 "유효하지 않은 client key" | env 누락/오타 | NEXT_PUBLIC_TOSS_CLIENT_KEY 확인 후 재빌드 |
| `/payments/success` 에서 "결제 금액이 일치하지 않습니다" | 위·변조 의심 | 정상. 사용자에게 다시 진입하도록 안내 |
| `payments` 행이 생성되지 않음 | RLS 차단 | `payments` 는 createAdminClient 로 service_role 사용하므로 RLS 와 무관. 스키마 권한 확인 |
| 매물이 만들어졌는데 status=pending 으로 표시 | 무료 흐름(0원)에서 발생 | 정상. 무료는 기존 관리자 승인 흐름 유지 |
| Toss 콜백 후 화면이 멈춤 | confirmCheckout 내부 에러 | Vercel/서버 로그 확인. failed_reason 컬럼에 사유 기록됨 |

## 9. 보안 체크리스트

- [x] Secret key 는 서버 전용 env (`TOSS_SECRET_KEY`)로만 접근. 클라이언트 번들 미포함.
- [x] confirm 직전에 payments.amount 와 클라이언트 amount 일치 검증.
- [x] orderId 는 `order_${ts}_${rand}` 형태 + payments.id PK 로 중복 불가.
- [x] confirmCheckout 멱등성 보장 (이미 paid 면 그대로 통과).
- [ ] 운영 단계에서 토스 웹훅 검증 추가 권장 (현재 미구현).
