import { Artist } from "@/types";

let circleSvgImage: HTMLImageElement | null = null;
let circleSvgLoading: Promise<HTMLImageElement> | null = null;

function loadCircleSvg(): Promise<HTMLImageElement> {
  if (circleSvgImage) return Promise.resolve(circleSvgImage);
  if (circleSvgLoading) return circleSvgLoading;

  circleSvgLoading = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      circleSvgImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/circle.svg`;
  });
  return circleSvgLoading;
}

// 預先載入 SVG
if (typeof window !== "undefined") {
  loadCircleSvg();
}

export function getCircleSvg(): HTMLImageElement | null {
  return circleSvgImage;
}

// 圈的大小，相對於 canvas 寬度的比例
export const CIRCLE_RATIO = 0.07;

export function drawSelections(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  artists: Artist[],
  selectedIds: string[]
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  if (!circleSvgImage) return;

  for (const artist of artists) {
    if (!selectedIds.includes(artist.id)) continue;

    const cx = artist.area.x * w;
    const cy = artist.area.y * h;
    const size = w * CIRCLE_RATIO;
    const aspect = circleSvgImage.naturalWidth / circleSvgImage.naturalHeight;
    const drawW = size * aspect;
    const drawH = size;

    ctx.drawImage(
      circleSvgImage,
      cx - drawW / 2,
      cy - drawH / 2,
      drawW,
      drawH
    );
  }
}

export function exportCanvasAsBlob(
  canvas: HTMLCanvasElement
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string
) {
  const blob = await exportCanvasAsBlob(canvas);
  if (!blob) return;

  // 手機優先用原生分享
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        // 使用者取消分享，fallback 到下載
      }
    }
  }

  // 桌面 fallback
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
