export const metadata = { title: "회원정보" };

export default function SettingsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">회원정보</h1>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="font-bold text-sm">기본 정보</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="회원 ID" value="shopdaejang_user" disabled />
          <Field label="가입 경로" value="네이버" disabled />
          <Field label="이름" value="홍길동" />
          <Field label="휴대폰" value="010-1234-5678" />
          <Field label="이메일" value="user@example.com" />
          <Field label="회원 등급" value="일반회원" disabled />
        </div>
      </div>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-4">
        <h2 className="font-bold text-sm">사업자 정보 (선택)</h2>
        <p className="text-xs text-muted">사업자 등록 정보를 입력하시면 사업자 회원으로 전환됩니다.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="상호명" value="" placeholder="상호명 입력" />
          <Field label="사업자등록번호" value="" placeholder="000-00-00000" />
          <Field label="대표자명" value="" placeholder="대표자명" />
          <Field label="업종" value="" placeholder="업종" />
        </div>
      </div>

      <div className="bg-white rounded-md border border-border p-4 lg:p-6 space-y-3">
        <h2 className="font-bold text-sm">알림 설정</h2>
        {[
          { label: "찜 알림", desc: "내 매물에 새 찜이 등록되면 알림" },
          { label: "조회수 알림", desc: "매물 조회수가 늘어나면 알림" },
          { label: "기간 만료 알림", desc: "광고 만료 7일 전 알림" },
          { label: "마케팅 수신", desc: "이벤트 및 혜택 정보 수신" },
        ].map((item) => (
          <label key={item.label} className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 accent-foreground" />
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-[11px] text-muted">{item.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="py-3 bg-foreground text-white font-bold rounded">변경사항 저장</button>
        <button type="button" className="py-3 border border-urgent text-urgent font-bold rounded">회원 탈퇴</button>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, disabled }: { label: string; value: string; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1 block">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground disabled:bg-zinc-50 disabled:text-muted"
      />
    </div>
  );
}
