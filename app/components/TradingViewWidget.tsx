"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  width?: string | number;
  height?: string | number;
  interval?: string;
  style?: string;
}

export default function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  theme = "dark",
  width = "100%",
  height = 500,
  interval = "D",
  style = "1",
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== "undefined") {
        new (window as any).TradingView.widget({
          autosize: false,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: style,
          locale: "en",
          toolbar_bg: "#000000",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: container.current?.id || "tradingview_widget",
          width: width,
          height: height,
          studies: [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "BB@tv-basicstudies",
            "Volume@tv-basicstudies",
            "MASimple@tv-basicstudies",
            "MAExp@tv-basicstudies",
            "StochasticRSI@tv-basicstudies",
            "ATR@tv-basicstudies",
          ],
          studies_overrides: {
            "volume.volume.color.0": "rgba(255, 0, 0, 0.5)",
            "volume.volume.color.1": "rgba(0, 255, 0, 0.5)",
            "RSI.plot.color": "#00ffff",
            "MACD.macd.color": "#00ffff",
            "MACD.signal.color": "#ff00ff",
            "BB.upper.color": "#00ffff",
            "BB.lower.color": "#00ffff",
            "BB.median.color": "#ff00ff",
          },
          backgroundColor: "#000000",
          gridColor: "rgba(0, 255, 255, 0.1)",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: true,
          withdateranges: true,
          details: true,
          hotlist: true,
          calendar: true,
        });
      }
    };

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, theme, width, height, interval, style]);

  return (
    <div
      id="tradingview_widget"
      ref={container}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
