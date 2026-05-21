"use client";

import { useEffect, useRef } from "react";

interface TradingViewMiniChartProps {
  symbol?: string;
  width?: string | number;
  height?: string | number;
}

export default function TradingViewMiniChart({
  symbol = "NASDAQ:AAPL",
  width = "100%",
  height = 300,
}: TradingViewMiniChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "rgba(0, 255, 255, 1)",
      underLineColor: "rgba(0, 255, 255, 0.3)",
      underLineBottomColor: "rgba(0, 255, 255, 0)",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
