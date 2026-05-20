import Link from "next/link";
import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <SimplePage title="이용약관" description="샵대장 서비스 이용약관입니다.">
      <h2 className="font-bold mb-2">제1조 (목적)</h2>
      <p>
        본 약관은 샵대장(상호: 샵커넥트, 이하 &ldquo;회사&rdquo;)이 제공하는 마사지샵 매물
        광고 플랫폼 서비스(이하 &ldquo;서비스&rdquo;)의 이용 조건 및 절차, 회사와 이용자의
        권리·의무 및 책임사항을 규정함을 목적으로 합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제2조 (정의)</h2>
      <p>
        &ldquo;이용자&rdquo;란 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말하며,
        &ldquo;매도자&rdquo;는 매물을 등록하는 자, &ldquo;매수자&rdquo;는 매물 정보를 열람·문의하는
        자를 말합니다. &ldquo;광고 상품&rdquo;이란 매물의 노출도를 높이기 위해 회사가 유료로
        제공하는 긴급매물·프리미엄·일반 상품을 말합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제3조 (서비스의 성격)</h2>
      <p>
        회사는 매도자와 매수자가 직접 거래할 수 있는 광고 플랫폼을 제공할 뿐, 매물의
        매매·양도양수 거래에 직접 개입하지 않으며 거래의 성사 여부 및 거래 결과에 대해
        책임지지 않습니다. 매물 정보의 진위 및 정확성에 대한 책임은 매도자에게 있습니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제4조 (광고 상품 및 결제)</h2>
      <ul className="space-y-1">
        <li>
          ① 회사는 긴급매물·프리미엄·일반의 유료 광고 상품과 무료 노출 상품을
          제공합니다. 상품별 가격·기간·혜택은{" "}
          <Link href="/ad-info" className="underline">광고안내</Link> 페이지에 명시됩니다.
        </li>
        <li>
          ② 유료 광고 상품의 결제는 토스페이먼츠(주)의 결제 시스템을 통해 처리되며,
          신용·체크카드, 계좌이체, 간편결제 등을 지원합니다.
        </li>
        <li>
          ③ 결제 완료 후 회사의 검수를 거쳐 광고가 노출되며, 검수에는 영업일 기준 평균
          2~6시간이 소요됩니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제5조 (청약철회 및 환불)</h2>
      <ul className="space-y-1">
        <li>
          ① 이용자는 광고 노출이 시작되기 전까지 청약을 철회하고 전액 환불받을 수
          있습니다.
        </li>
        <li>
          ② 광고 노출 시작 후의 환불은 잔여기간을 일할 계산하여 처리합니다. 무료 상품은
          환불 대상이 아닙니다.
        </li>
        <li>
          ③ 구체적인 취소·환불 기준 및 절차는{" "}
          <Link href="/refund" className="underline">취소·환불 정책</Link>에 따릅니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제6조 (이용자의 의무)</h2>
      <ul className="space-y-1">
        <li>① 이용자는 매물 등록 시 사실에 부합하는 정보를 정확하게 기재하여야 합니다.</li>
        <li>
          ② 허위·과장 매물, 불법 영업장, 타인 명의 도용, 음란·불법 정보의 등록을 금지하며,
          위반 시 회사는 사전 통지 없이 매물 게재를 중단하거나 회원 자격을 제한할 수
          있습니다.
        </li>
        <li>③ 이용자는 서비스 이용 과정에서 관계 법령 및 본 약관을 준수하여야 합니다.</li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제7조 (회사의 의무)</h2>
      <p>
        회사는 안정적인 서비스 제공을 위해 노력하며, 이용자의 개인정보를 관계 법령 및{" "}
        <Link href="/privacy" className="underline">개인정보처리방침</Link>에 따라 보호합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제8조 (면책)</h2>
      <ul className="space-y-1">
        <li>
          ① 회사는 천재지변, 통신장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지
          않습니다.
        </li>
        <li>
          ② 회사는 매도자와 매수자 간 직거래 과정에서 발생하는 분쟁, 손해, 사기 등에
          대해 책임지지 않으며, 이용자는 거래 전 반드시 직접 사실관계를 확인하여야
          합니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제9조 (약관의 변경)</h2>
      <p>
        회사는 관계 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시
        적용일자 및 개정 사유를 명시하여 서비스 내 공지합니다.
      </p>

      <p className="mt-6 text-xs text-muted">본 약관은 2026년 5월 20일부터 시행됩니다.</p>
    </SimplePage>
  );
}
