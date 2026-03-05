"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Artist } from "@/types";
import { getCircleSvg, CIRCLE_RATIO } from "@/lib/canvas";

interface LineupCanvasProps {
  imageFile: string;
  artists: Artist[];
  selectedIds: string[];
  onToggle: (artistId: string) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function LineupCanvas({
  imageFile,
  artists,
  selectedIds,
  onToggle,
  canvasRef: externalCanvasRef,
}: LineupCanvasProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const hoveredArtistRef = useRef<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // 把 artists 和 selectedIds 也存到 ref，讓 drawWithHover 能拿到最新值
  const artistsRef = useRef(artists);
  artistsRef.current = artists;
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !containerRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = containerRef.current.clientWidth;
    const scale = containerWidth / img.naturalWidth;
    canvas.width = containerWidth * dpr;
    canvas.height = img.naturalHeight * scale * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${img.naturalHeight * scale}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [canvasRef]);

  const drawWithHover = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    const circleSvg = getCircleSvg();
    if (circleSvg) {
      const aspect = circleSvg.naturalWidth / circleSvg.naturalHeight;

      for (const artist of artistsRef.current) {
        if (!selectedIdsRef.current.includes(artist.id)) continue;
        const cx = artist.area.x * w;
        const cy = artist.area.y * h;
        const size = w * CIRCLE_RATIO;
        const drawW = size * aspect;
        const drawH = size;
        ctx.drawImage(circleSvg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
      }

      // 畫 hover 效果
      const hoveredId = hoveredArtistRef.current;
      if (hoveredId && !selectedIdsRef.current.includes(hoveredId)) {
        const artist = artistsRef.current.find((a) => a.id === hoveredId);
        if (artist) {
          const cx = artist.area.x * w;
          const cy = artist.area.y * h;
          const size = w * CIRCLE_RATIO;
          const drawW = size * aspect;
          const drawH = size;
          ctx.globalAlpha = 0.3;
          ctx.drawImage(circleSvg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        }
      }
    }

    ctx.restore();
  }, [canvasRef]);

  // 載入圖片
  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = `/images/${imageFile}`;
    img.onload = () => {
      imageRef.current = img;
      resizeCanvas();
      drawWithHover();
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
  }, [imageFile, canvasRef, resizeCanvas, drawWithHover]);

  // 當選取改變時重繪
  useEffect(() => {
    drawWithHover();
  }, [selectedIds, drawWithHover]);

  // 視窗縮放時重新調整 Canvas 大小
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      drawWithHover();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef, resizeCanvas, drawWithHover]);

  // 找到點擊座標對應的藝人
  const findArtistAtPosition = (
    relX: number,
    relY: number
  ): Artist | undefined => {
    return artists.find((a) => {
      const left = a.area.x - a.area.width / 2;
      const right = a.area.x + a.area.width / 2;
      const top = a.area.y - a.area.height / 2;
      const bottom = a.area.y + a.area.height / 2;
      return relX >= left && relX <= right && relY >= top && relY <= bottom;
    });
  };

  const getRelativePosition = (
    e: React.MouseEvent
  ): { relX: number; relY: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    return { relX, relY };
  };

  const handleClick = (e: React.MouseEvent) => {
    const pos = getRelativePosition(e);
    if (!pos) return;
    const artist = findArtistAtPosition(pos.relX, pos.relY);
    if (artist) {
      onToggle(artist.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getRelativePosition(e);
    if (!pos) return;
    const artist = findArtistAtPosition(pos.relX, pos.relY);
    const newId = artist?.id || null;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = artist ? "pointer" : "default";
    }

    // 只在 hover 的藝人改變時才重繪
    if (newId !== hoveredArtistRef.current) {
      hoveredArtistRef.current = newId;
      drawWithHover();
    }
  };

  const handleMouseLeave = () => {
    if (hoveredArtistRef.current !== null) {
      hoveredArtistRef.current = null;
      drawWithHover();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas || !touch) return;

    // Ignore if finger moved more than 10px (it was a scroll, not a tap)
    const start = touchStartRef.current;
    if (start) {
      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);
      if (dx > 10 || dy > 10) return;
    }

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const relX = (touch.clientX - rect.left) / rect.width;
    const relY = (touch.clientY - rect.top) / rect.height;
    const artist = findArtistAtPosition(relX, relY);
    if (artist) {
      onToggle(artist.id);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <svg
            className="animate-spin h-8 w-8 mr-3"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          載入中...
        </div>
      )}
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full ${loading ? "hidden" : "block"}`}
      />
    </div>
  );
}
