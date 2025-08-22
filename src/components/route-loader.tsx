"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "@/components/ui/loader";

// Hiển thị overlay Loader khi điều hướng giữa các route (trừ trang chủ theo locale)
export default function RouteLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const MIN_DURATION = 350; // ms
  const hideTimerRef = useRef<number | null>(null);

  // Hiển thị loader NGAY khi click vào Link nội bộ (trước khi pathname đổi)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      // bỏ qua nếu dùng phím tắt mở tab mới/ tải lại
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      try {
        const url = new URL(anchor.href, location.href);
        if (url.origin !== location.origin) return; // link ngoài
        const destPath = url.pathname;
        // Bỏ qua nếu chỉ là hash trong cùng trang
        if (destPath === pathname && url.hash) return;
        // Bỏ qua nếu đích là trang chủ theo locale
        const isLocaleHomeDest = /^\/[a-zA-Z-]{2,5}\/?$/.test(destPath);
        if (isLocaleHomeDest) return;
        // Chỉ khi khác pathname hiện tại
        if (destPath !== pathname) {
          setLoading(true);
          // Hủy hẹn tắt cũ nếu có
          if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        }
      } catch {}
    }
    window.addEventListener("click", onDocClick, true);
    // Popstate (Back/Forward)
    const onPop = () => setLoading(true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("click", onDocClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [pathname]);

  // Khi pathname đổi (điều hướng hoàn tất), giữ loader tối thiểu rồi tắt
  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(
        () => setLoading(false),
        MIN_DURATION
      );
    }
  }, [pathname]);

  return (
    <>
      {children}
      {loading && <Loader isLoading={true} size="md" message="" overlay />}
    </>
  );
}
