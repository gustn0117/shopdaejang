import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-custom py-16 lg:py-24 text-center">
      <p className="text-7xl lg:text-9xl font-black text-primary opacity-30">404</p>
      <h1 className="text-xl lg:text-2xl font-black mt-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <div className="flex gap-2 justify-center mt-6">
        <Link href="/" className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">
          홈으로
        </Link>
        <Link href="/listings" className="px-5 py-2.5 border border-border font-bold rounded-lg hover:border-primary hover:text-primary">
          매물검색
        </Link>
      </div>
    </div>
  );
}
