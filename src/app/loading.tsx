export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      <p className="text-sm text-muted">加载中...</p>
    </div>
  );
}
