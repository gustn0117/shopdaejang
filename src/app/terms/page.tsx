import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <SimplePage title="이용약관" description="샵대장 서비스 이용약관입니다.">
      <h2 className="font-bold mb-2">제1조 (목적)</h2>
      <p>본 약관은 샵대장(이하 "회사")이 제공하는 마사지샵 매물 광고 플랫폼 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정합니다.</p>

      <h2 className="font-bold mb-2 mt-5">제2조 (정의)</h2>
      <p>"이용자"란 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말하며, "매도자"는 매물을 등록하는 자, "매수자"는 매물에 대한 정보를 열람·문의하는 자를 말합니다.</p>

      <h2 className="font-bold mb-2 mt-5">제3조 (서비스의 성격)</h2>
      <p>회사는 매도자와 매수자가 직접 거래할 수 있는 광고 플랫폼을 제공할 뿐, 거래에 직접 개입하지 않으며 거래 결과에 대해 책임지지 않습니다.</p>

      <h2 className="font-bold mb-2 mt-5">제4조 (광고 상품)</h2>
      <p>회사는 긴급매물·프리미엄·일반·무료의 광고 상품을 제공하며, 광고비는 사전 결제 후 노출됩니다. 자세한 내용은 광고안내 페이지를 참고하시기 바랍니다.</p>

      <p className="mt-6 text-xs text-muted">본 약관은 2026년 5월 1일부터 시행됩니다.</p>
    </SimplePage>
  );
}
