import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 lg:mt-24">
      <div className="container-custom py-10 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-semibold text-[13px] mb-3 tracking-tight">샵대장</h3>
            <ul className="space-y-2 text-[13px] text-muted">
              <li><Link href="/about" className="hover:text-foreground">회사소개</Link></li>
              <li><Link href="/ad-info" className="hover:text-foreground">광고안내</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[13px] mb-3 tracking-tight">고객센터</h3>
            <ul className="space-y-2 text-[13px] text-muted">
              <li><Link href="/notice" className="hover:text-foreground">공지사항</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">자주묻는질문</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">문의하기</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[13px] mb-3 tracking-tight">서비스</h3>
            <ul className="space-y-2 text-[13px] text-muted">
              <li><Link href="/listings" className="hover:text-foreground">매물검색</Link></li>
              <li><Link href="/map" className="hover:text-foreground">지도검색</Link></li>
              <li><Link href="/used" className="hover:text-foreground">중고장터</Link></li>
              <li><Link href="/supplies" className="hover:text-foreground">용품도매</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[13px] mb-3 tracking-tight">고객 상담</h3>
            <p className="text-2xl font-black text-foreground tabular tracking-tight">1588-0000</p>
            <p className="text-[12px] text-muted mt-1">평일 09:00 — 18:00</p>
            <p className="text-[12px] text-muted">점심 12:00 — 13:00</p>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-[11px] text-muted leading-relaxed space-y-1">
          <p className="font-semibold text-foreground/80 mb-1.5">샵대장 (주)</p>
          <p>사업자등록번호 405-07-65148 · 통신판매업신고 2026-서울강남-00000</p>
          <p>서울특별시 강남구 테헤란로 000 · help@shopdaejang.com · 1588-0000</p>
          <p className="pt-3 max-w-2xl">
            샵대장은 마사지샵 양도양수 광고 플랫폼이며, 매물 정보의 정확성과 거래 결과에 대해 책임을 지지 않습니다.
            거래 전 반드시 직접 확인하시기 바랍니다.
          </p>
          <p className="pt-2 text-muted/70">© 2026 ShopDaejang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
