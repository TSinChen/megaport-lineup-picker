export interface ArtistArea {
  x: number; // 中心點 x (0~1)
  y: number; // 中心點 y (0~1)
  width: number; // 寬度 (0~1)
  height: number; // 高度 (0~1)
}

export interface Artist {
  id: string;
  name: string;
  stage: string;
  startTime: string; // ISO 格式 "2026-03-28T15:00"
  endTime: string; // ISO 格式 "2026-03-28T15:45"
  area: ArtistArea;
}

export interface DayLineup {
  year: number;
  day: number;
  date: string; // "2026-03-28"
  imageFile: string; // "2026/day1.jpg"
  imageWidth: number;
  imageHeight: number;
  artists: Artist[];
}
