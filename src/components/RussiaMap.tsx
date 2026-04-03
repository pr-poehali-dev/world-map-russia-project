interface Region {
  key: string;
  name: string;
  color: string;
  hoverColor: string;
}

const REGION_COLORS: Record<string, { color: string; hoverColor: string }> = {
  north:     { color: "#1A3A6B", hoverColor: "#2A5AAB" },
  south:     { color: "#8B1A1A", hoverColor: "#BB2A2A" },
  ural:      { color: "#2D5A27", hoverColor: "#3D7A37" },
  siberia:   { color: "#4A3728", hoverColor: "#6A5748" },
  center:    { color: "#6B3A1A", hoverColor: "#8B5A2A" },
  volga:     { color: "#5A1A6B", hoverColor: "#7A2A8B" },
  northwest: { color: "#1A5A5A", hoverColor: "#2A7A7A" },
};

interface Props {
  selectedRegion: string | null;
  onRegionClick: (key: string) => void;
}

export default function RussiaMap({ selectedRegion, onRegionClick }: Props) {
  const getColor = (key: string) => {
    const c = REGION_COLORS[key] || { color: "#3A3028", hoverColor: "#5A5048" };
    if (selectedRegion === key) return "#C8973A";
    return c.color;
  };

  const regionStyle = (key: string) => ({
    fill: getColor(key),
    stroke: "#C8973A",
    strokeWidth: selectedRegion === key ? 2 : 0.8,
    strokeOpacity: selectedRegion === key ? 1 : 0.4,
    cursor: "pointer",
    transition: "fill 0.25s ease",
    filter: selectedRegion === key ? "drop-shadow(0 0 8px rgba(200,151,58,0.6))" : undefined,
  });

  return (
    <svg
      viewBox="0 0 900 500"
      className="w-full h-full"
      style={{ background: "transparent" }}
    >
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#C8973A" strokeWidth="0.5" strokeOpacity="0.3" />
        </pattern>
      </defs>

      {/* === СЕВЕРО-ЗАПАД (Санкт-Петербург, Псков, Новгород) === */}
      <g onClick={() => onRegionClick("northwest")} style={regionStyle("northwest")}>
        <polygon points="120,40 200,30 230,60 220,110 180,130 140,120 110,90" />
        <text x="165" y="82" textAnchor="middle" fontSize="9" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Северо-Запад</text>
      </g>

      {/* === СЕВЕР (Архангельск, Вологда, Мурманск) === */}
      <g onClick={() => onRegionClick("north")} style={regionStyle("north")}>
        <polygon points="200,30 380,15 420,40 400,90 350,110 280,100 230,60" />
        <text x="310" y="62" textAnchor="middle" fontSize="10" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Север</text>
      </g>

      {/* === ЦЕНТР (Москва, Ярославль, Тверь) === */}
      <g onClick={() => onRegionClick("center")} style={regionStyle("center")}>
        <polygon points="140,120 220,110 280,100 300,150 270,200 200,210 150,190 130,160" />
        <text x="215" y="162" textAnchor="middle" fontSize="10" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Центр</text>
      </g>

      {/* === ЮГ (Краснодар, Ростов, Воронеж) === */}
      <g onClick={() => onRegionClick("south")} style={regionStyle("south")}>
        <polygon points="150,190 200,210 270,200 290,250 260,300 200,320 150,300 120,260 130,220" />
        <text x="205" y="262" textAnchor="middle" fontSize="10" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Юг</text>
      </g>

      {/* === ПОВОЛЖЬЕ (Нижний Новгород, Самара, Казань) === */}
      <g onClick={() => onRegionClick("volga")} style={regionStyle("volga")}>
        <polygon points="280,100 350,110 400,90 440,120 450,180 420,240 380,270 320,260 290,250 270,200 300,150" />
        <text x="365" y="182" textAnchor="middle" fontSize="10" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Поволжье</text>
      </g>

      {/* === УРАЛ (Екатеринбург, Пермь, Челябинск) === */}
      <g onClick={() => onRegionClick("ural")} style={regionStyle("ural")}>
        <polygon points="400,90 500,70 540,100 550,160 520,220 480,260 440,260 420,240 450,180 440,120" />
        <text x="478" y="168" textAnchor="middle" fontSize="10" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Урал</text>
      </g>

      {/* === СИБИРЬ === */}
      <g onClick={() => onRegionClick("siberia")} style={regionStyle("siberia")}>
        <polygon points="500,70 700,30 800,50 860,100 850,200 800,280 720,320 640,330 560,300 520,260 520,220 550,160 540,100" />
        <text x="685" y="185" textAnchor="middle" fontSize="12" fill="#F0E6CC" fontFamily="Golos Text" pointerEvents="none">Сибирь</text>
      </g>

      {/* Дальний Восток — декоративный нейтральный */}
      <polygon
        points="800,50 880,40 900,120 890,260 850,320 800,280 860,200 860,100"
        fill="#2A2018"
        stroke="#C8973A"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <text x="862" y="165" textAnchor="middle" fontSize="8" fill="#8A7A60" fontFamily="Golos Text">Дал. Восток</text>

      {/* Декоративная рамка */}
      <rect x="2" y="2" width="896" height="496" fill="none" stroke="#C8973A" strokeWidth="1" strokeOpacity="0.3" rx="2" />
    </svg>
  );
}
