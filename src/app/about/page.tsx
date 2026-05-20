import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "회사소개" };

export default function AboutPage() {
  return (
    <SimplePage title="회사소개" description="샵대장은 마사지샵 양도양수 직거래 플랫폼입니다.">
      <p>
        샵대장(주)은 마사지샵 매도자와 매수자가 직접 거래할 수 있는 광고 플랫폼을 운영합니다.
        업계 종사자가 직접 만든 서비스로, 직거래에 필요한 매물 정보·광고·고객 응대를 제공합니다.
      </p>
      <ul className="mt-4 space-y-1.5 text-sm">
        <li>· 사업자명 : 샵대장 (주)</li>
        <li>· 대표이사 : 홍길동</li>
        <li>· 사업자등록번호 : 405-07-65148</li>
        <li>· 주소 : 서울특별시 강남구 테헤란로 000</li>
        <li>· 통신판매업신고 : 2022-서울송파-2707</li>
        <li>· 고객센터 : 1588-0000 / help@shopdaejang.com</li>
      </ul>
    </SimplePage>
  );
}
