-- Toss Payments 연동을 위한 payments 테이블 확장
-- shopdaejang 스키마에서 실행

SET search_path TO shopdaejang, public;

-- payments 테이블이 이미 존재한다고 가정 (id, user_id, item, method, amount, status, created_at)
-- 아래는 누락된 컬럼 추가. 모두 IF NOT EXISTS 로 안전.

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

CREATE UNIQUE INDEX IF NOT EXISTS payments_payment_key_uidx
  ON shopdaejang.payments (payment_key)
  WHERE payment_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS payments_user_status_idx
  ON shopdaejang.payments (user_id, status, created_at DESC);

-- status 값 확장: 'pending'(주문생성), 'paid'(승인완료), 'failed', 'canceled', 'refunded', 'refund_requested'
-- CHECK 제약은 기존 데이터와 충돌할 수 있으므로 추가하지 않음 (애플리케이션에서 관리)
