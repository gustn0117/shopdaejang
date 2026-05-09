import Link from "next/link";

export const metadata = { title: "아이디·비밀번호 찾기" };

export default function FindAccountPage() {
  return (
    <div className="container-custom py-8 lg:py-16 max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-xl font-black tracking-tight">아이디·비밀번호 찾기</h1>
        <p className="text-sm text-muted mt-1">가입 시 등록한 정보로 계정을 찾을 수 있습니다.</p>
      </div>
      <div className="bg-white rounded-md border border-border p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold mb-2">아이디(이메일) 찾기</h2>
          <input type="text" placeholder="이름" className="w-full px-3 py-2.5 text-sm border border-border rounded mb-2 focus:outline-none focus:border-foreground" />
          <input type="tel" placeholder="가입 시 등록한 휴대폰" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
          <button type="button" className="w-full mt-2 py-2.5 border border-border font-bold text-sm rounded">아이디 찾기</button>
        </div>
        <hr className="border-border" />
        <div>
          <h2 className="text-sm font-bold mb-2">비밀번호 재설정</h2>
          <input type="email" placeholder="가입 이메일" className="w-full px-3 py-2.5 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
          <button type="button" className="w-full mt-2 py-2.5 bg-foreground text-white font-bold text-sm rounded">재설정 메일 받기</button>
        </div>
        <p className="text-center text-xs text-muted">
          <Link href="/login" className="underline">로그인 페이지로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
