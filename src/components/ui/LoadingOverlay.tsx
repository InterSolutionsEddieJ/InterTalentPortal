'use client';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[100] flex items-center justify-center">
      {/* 3-dot loading animation only - no background box */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
