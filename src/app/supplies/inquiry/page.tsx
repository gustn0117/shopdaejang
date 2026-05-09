import { SimplePage } from "@/components/SimplePage";

export const metadata = { title: "용품 도매 입점 문의" };

export default function SuppliesInquiryPage() {
  return (
    <SimplePage title="용품 도매 입점 문의" description="샵대장 용품도매장터에 입점하실 업체를 모집합니다.">
      <form className="space-y-3">
        <div>
          <label className="text-xs font-bold mb-1 block">상호명</label>
          <input type="text" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">담당자</label>
          <input type="text" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">연락처</label>
          <input type="tel" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">취급 카테고리</label>
          <select className="w-full px-3 py-2.5 text-sm border border-border rounded">
            <option>마사지베드</option>
            <option>마사지오일</option>
            <option>타올/리넨</option>
            <option>안마기/기기</option>
            <option>인테리어소품</option>
            <option>유니폼/위생</option>
            <option>관리/세정용품</option>
            <option>기타용품</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">상세 내용</label>
          <textarea rows={5} className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <button type="button" className="w-full py-3 bg-foreground text-white font-bold rounded">
          입점 문의 접수하기
        </button>
      </form>
    </SimplePage>
  );
}
