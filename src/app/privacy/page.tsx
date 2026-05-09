import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <SimplePage title="개인정보처리방침" description="샵대장은 이용자의 개인정보를 안전하게 보호합니다.">
      <h2 className="font-bold mb-2">1. 수집하는 개인정보 항목</h2>
      <p>회원가입·매물등록·문의 처리 과정에서 다음 정보가 수집됩니다.</p>
      <ul className="mt-1 space-y-1">
        <li>· 필수: 이름, 연락처, 이메일, SNS 가입 정보</li>
        <li>· 선택: 사업자등록번호, 상호명, 대표자명</li>
        <li>· 자동수집: IP 주소, 접속 기록, 쿠키</li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">2. 이용 목적</h2>
      <ul className="space-y-1">
        <li>· 회원관리, 매물 등록·검수, 결제 처리</li>
        <li>· 안심번호 연결, 광고 노출, 부정 이용 방지</li>
      </ul>

      <h2 className="font-bold mb-2 mt-5">3. 보유 기간</h2>
      <p>회원 탈퇴 시 즉시 파기됩니다. 단, 관계 법령에 따라 일정 기간 보존이 필요한 정보는 별도로 보관합니다.</p>

      <h2 className="font-bold mb-2 mt-5">4. 제3자 제공</h2>
      <p>이용자의 동의 없이는 외부에 제공하지 않으며, 결제·문자 발송 등 위탁이 필요한 경우 별도 고지합니다.</p>

      <p className="mt-6 text-xs text-muted">본 방침은 2026년 5월 1일부터 시행됩니다.</p>
    </SimplePage>
  );
}
