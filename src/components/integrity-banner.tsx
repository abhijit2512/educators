export function IntegrityBanner({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-semibold">Academic integrity statement</p>
      <p className="mt-1 leading-relaxed">{text}</p>
    </div>
  );
}
