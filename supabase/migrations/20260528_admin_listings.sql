-- 관리자가 직접 등록하는 매물은 user_id 가 NULL.
-- 기존에 NOT NULL 이었다면 nullable 로 완화.
-- shopdaejang 스키마에서 실행.

ALTER TABLE shopdaejang.listings
  ALTER COLUMN user_id DROP NOT NULL;
