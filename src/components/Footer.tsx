import Link from "next/link";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-12">
      <div className="container-custom py-8 lg:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-sm mb-3">샵대장 안내</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/about" className="hover:text-foreground">회사소개</Link></li>
              <li><Link href="/ad-info" className="hover:text-foreground">광고안내</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">고객센터</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/notice" className="hover:text-foreground">공지사항</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">자주묻는질문</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">문의하기</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/listings" className="hover:text-foreground">매물검색</Link></li>
              <li><Link href="/map" className="hover:text-foreground">지도검색</Link></li>
              <li><Link href="/used" className="hover:text-foreground">중고장터</Link></li>
              <li><Link href="/supplies" className="hover:text-foreground">용품도매</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">고객 상담</h3>
            <p className="text-2xl font-black text-foreground">1588-0000</p>
            <p className="text-xs text-muted mt-1">평일 09:00 ~ 18:00</p>
            <p className="text-xs text-muted">점심 12:00 ~ 13:00</p>
            <div className="flex gap-2 mt-3">
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold border border-border text-foreground rounded hover:bg-zinc-50">
                <Icon.Chat size={12} strokeWidth={2} />
                카톡상담
              </button>
              <a href="tel:15880000" className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-foreground text-white rounded">
                <Icon.Phone size={12} strokeWidth={2} />
                전화걸기
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border text-xs text-muted space-y-1">
          <p className="font-bold text-foreground">샵대장 (주)</p>
          <p>대표이사: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p>주소: 서울특별시 강남구 테헤란로 000 | 통신판매업신고: 2026-서울강남-00000</p>
          <p>고객센터: 1588-0000 | 이메일: help@shopdaejang.com</p>
          <p className="pt-2">
            샵대장은 마사지샵 양도양수 광고 플랫폼이며, 매물 정보의 정확성, 거래 결과 등에 대해 책임을 지지 않습니다.
            거래 전 반드시 직접 확인하시기 바랍니다.
          </p>
          <p>© 2026 ShopDaejang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
