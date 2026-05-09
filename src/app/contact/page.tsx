import { SimplePage } from "@/components/SimplePage";
import { Icon } from "@/components/Icon";

export const metadata = { title: "문의하기" };

export default function ContactPage() {
  return (
    <SimplePage title="문의하기" description="샵대장 운영팀에 문의를 남겨주세요.">
      <form className="space-y-3">
        <div>
          <label className="text-xs font-bold mb-1 block">이름</label>
          <input type="text" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">연락처</label>
          <input type="tel" placeholder="010-0000-0000" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">이메일</label>
          <input type="email" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">문의 내용</label>
          <textarea rows={5} className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-foreground text-white font-bold rounded">
          <Icon.ArrowRight size={14} strokeWidth={2.2} />
          문의 접수하기
        </button>
      </form>
    </SimplePage>
  );
}
