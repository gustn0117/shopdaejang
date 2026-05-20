import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <SimplePage title="개인정보처리방침" description="샵대장은 이용자의 개인정보를 안전하게 보호합니다.">
      <h2 className="font-bold mb-2">1. 수집하는 개인정보 항목</h2>
      <p>회원가입·매물등록·결제·문의 처리 과정에서 다음 정보가 수집됩니다.</p>
      <ul className="mt-1 space-y-1">
        <li>· 필수: 이름, 휴대폰 번호, 이메일, SNS 가입 정보(카카오·네이버)</li>
        <li>· 매물 등록 시: 매물 연락처, 매물 사진, 영업장 위치 정보</li>
        <li>· 결제 시: 결제 승인 정보(결제수단·결제금액·결제일시·주문번호)</li>
        <li>· 선택: 사업자등록번호, 상호명, 대표자명</li>
        <li>· 자동수집: IP 주소, 접속 기록, 쿠키, 기기 정보</li>
      </ul>
      <p className="mt-2 text-xs text-muted">
        ※ 카드번호 등 결제 인증정보는 결제대행사(토스페이먼츠)가 처리하며, 회사는 이를
        저장하지 않습니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">2. 이용 목적</h2>
      <ul className="space-y-1">
        <li>· 회원관리, 본인확인, 매물 등록·검수</li>
        <li>· 광고 상품 결제 처리 및 환불, 결제내역 관리</li>
        <li>· 안심번호 연결, 광고 노출, 고객 문의 응대</li>
        <li>· 부정 이용 방지 및 분쟁 대응</li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">3. 보유 및 이용 기간</h2>
      <p>
        회원 탈퇴 시 수집된 개인정보는 즉시 파기됩니다. 단, 관계 법령에 따라 아래 정보는
        명시된 기간 동안 보존합니다.
      </p>
      <ul className="mt-1 space-y-1">
        <li>· 계약·청약철회 및 대금결제 기록: 5년 (전자상거래법)</li>
        <li>· 소비자 불만 및 분쟁 처리 기록: 3년 (전자상거래법)</li>
        <li>· 접속에 관한 기록: 3개월 (통신비밀보호법)</li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">4. 개인정보 처리의 위탁</h2>
      <p>회사는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁합니다.</p>
      <ul className="mt-1 space-y-1">
        <li>· 토스페이먼츠(주) — 신용카드·계좌이체·간편결제 등 결제 처리 및 결제 도용 방지</li>
        <li>· Supabase — 데이터 저장 및 인증 시스템 운영</li>
      </ul>
      <p className="mt-2 text-xs text-muted">
        위탁 업무 내용이나 수탁자가 변경될 경우 본 방침을 통해 공개합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">5. 제3자 제공</h2>
      <p>
        회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 법령에
        의거하거나 수사기관의 적법한 요청이 있는 경우는 예외로 합니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">6. 이용자의 권리</h2>
      <p>
        이용자는 언제든지 본인의 개인정보를 조회·수정하거나 회원 탈퇴를 통해 수집·이용
        동의를 철회할 수 있습니다.
      </p>

      <h2 className="font-bold mb-2 mt-5">7. 개인정보 보호책임자</h2>
      <ul className="space-y-1">
        <li>· 책임자 : 정서우 (샵커넥트 대표)</li>
        <li>· 연락처 : 1588-0000 / help@shopdaejang.com</li>
      </ul>

      <p className="mt-6 text-xs text-muted">본 방침은 2026년 5월 20일부터 시행됩니다.</p>
    </SimplePage>
  );
}
