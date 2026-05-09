import { SAMPLE_FAQS } from "@/lib/data";
import { FAQList } from "@/components/FAQList";

export const metadata = {
  title: "자주묻는질문 (FAQ)",
  description: "샵대장 이용에 대한 자주 묻는 질문",
};

export default function FAQPage() {
  const cats = Array.from(new Set(SAMPLE_FAQS.map((f) => f.category)));
  return (
    <div className="container-custom py-4 lg:py-6 max-w-4xl">
      <h1 className="text-xl lg:text-2xl font-black mb-1">자주묻는질문 (FAQ)</h1>
      <p className="text-xs lg:text-sm text-muted mb-4">
        궁금하신 점을 카테고리별로 빠르게 찾아보세요
      </p>
      <FAQList faqs={SAMPLE_FAQS} categories={cats} />
    </div>
  );
}
