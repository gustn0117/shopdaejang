import { SimplePage } from "@/components/SimplePage";

export const metadata = {
  title: "취소·환불 정책",
  description: "샵대장 유료 광고 상품의 결제 취소 및 환불 기준 안내",
};

export default function RefundPage() {
  return (
    <SimplePage
      title="취소·환불 정책"
      description="유료 광고 상품의 결제 취소 및 환불 기준을 안내합니다."
    >
      <h2 className="font-bold mb-2">제1조 (목적)</h2>
      <p>
        본 정책은 샵대장(상호: 샵커넥트, 이하 &ldquo;회사&rdquo;)이 제공하는 유료 광고 상품의
        결제 취소 및 환불 기준을 정함을 목적으로 합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제2조 (청약철회)</h2>
      <ul className="space-y-1">
        <li>
          ① 이용자는 광고 상품 결제 후 광고 노출이 시작되기 전까지 청약을 철회하고
          결제 금액 전액을 환불받을 수 있습니다.
        </li>
        <li>
          ② 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라, 광고는 디지털
          서비스의 특성을 가지므로 광고 노출이 개시된 이후에는 청약철회가 제한될 수
          있으며, 이 경우 제3조의 환불 기준이 적용됩니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제3조 (환불 기준)</h2>
      <ul className="space-y-1">
        <li>
          ① <strong>광고 노출 시작 전</strong> : 결제 금액의 100%를 환불합니다.
        </li>
        <li>
          ② <strong>광고 노출 시작 후</strong> : 총 광고기간 중 이미 노출된 기간을
          제외한 잔여기간을 일할 계산하여 환불합니다.
        </li>
        <li className="pl-3 text-muted">
          · 환불액 = 결제금액 × (잔여일수 ÷ 총 광고일수)
        </li>
        <li>③ 무료 상품(무료매물)은 환불 대상이 아닙니다.</li>
        <li>
          ④ 이용자의 약관 위반, 허위·불법 매물 등록 등 이용자의 귀책사유로 광고가
          중단된 경우 환불이 제한될 수 있습니다.
        </li>
        <li>
          ⑤ 회사의 귀책사유 또는 시스템 장애로 광고가 정상 노출되지 못한 경우, 해당
          기간에 대해 전액 환불하거나 노출 기간을 연장합니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제4조 (환불 절차)</h2>
      <ul className="space-y-1">
        <li>
          ① <strong>환불 신청</strong> : 고객센터(전화·이메일) 또는 마이페이지 &gt;
          결제내역을 통해 접수합니다.
        </li>
        <li>
          ② <strong>환불 처리</strong> : 신청 내용 확인 후 영업일 기준 3~5일 이내에
          처리합니다.
        </li>
        <li>
          ③ <strong>환불 수단</strong> : 원결제수단으로의 환불을 원칙으로 하며,
          카드결제는 카드사 정책에 따라 결제 승인취소 또는 부분취소로 처리됩니다.
          카드사 사정에 따라 환불 반영까지 추가 기간이 소요될 수 있습니다.
        </li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">제5조 (결제 수단)</h2>
      <p>
        신용·체크카드, 계좌이체, 간편결제(카카오페이·네이버페이 등)를 지원하며, 모든
        결제는 <strong>토스페이먼츠(주)</strong>의 결제 시스템을 통해 안전하게
        처리됩니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제6조 (서비스 제공 시기)</h2>
      <p>
        결제 완료 및 관리자 검수 후 광고가 노출되며, 검수에는 영업일 기준 평균 2~6시간이
        소요됩니다. 검수 결과 게재가 불가한 매물로 확인된 경우 결제 금액은 전액
        환불됩니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">제7조 (취소·환불 문의)</h2>
      <ul className="space-y-1">
        <li>· 고객센터 : 1588-0000</li>
        <li>· 이메일 : help@shopdaejang.com</li>
        <li>· 운영시간 : 평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00, 주말·공휴일 휴무)</li>
      </ul>

      <p className="mt-6 text-xs text-muted">본 정책은 2026년 5월 20일부터 시행됩니다.</p>
    </SimplePage>
  );
}
