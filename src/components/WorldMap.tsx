import { useState, useEffect, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

// TopoJSON мира от Natural Earth (публичный CDN)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Числовые ISO-коды стран для регионов России (сама Россия = 643)
const RUSSIA_ISO = "643";

// Регионы России с координатами центров и конфигурацией
const RUSSIA_REGIONS = [
  { key: "northwest", name: "Северо-Запад", coords: [30.3, 59.9] as [number, number], icon: "🏙️" },
  { key: "north",     name: "Север",        coords: [40.5, 65.5] as [number, number], icon: "❄️" },
  { key: "center",    name: "Центр",        coords: [37.6, 55.7] as [number, number], icon: "🏛️" },
  { key: "south",     name: "Юг",           coords: [39.7, 47.2] as [number, number], icon: "☀️" },
  { key: "volga",     name: "Поволжье",     coords: [49.1, 56.3] as [number, number], icon: "🌊" },
  { key: "ural",      name: "Урал",         coords: [60.6, 56.8] as [number, number], icon: "⛰️" },
  { key: "siberia",   name: "Сибирь",       coords: [82.9, 56.0] as [number, number], icon: "🌲" },
];

interface Props {
  selectedRegion: string | null;
  onRegionClick: (key: string) => void;
}

const WorldMap = memo(({ selectedRegion, onRegionClick }: Props) => {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([60, 60]);

  // При выборе региона — зумируем к нему
  useEffect(() => {
    if (selectedRegion) {
      const region = RUSSIA_REGIONS.find(r => r.key === selectedRegion);
      if (region) {
        setCenter(region.coords);
        setZoom(4);
      }
    } else {
      setCenter([60, 60]);
      setZoom(1);
    }
  }, [selectedRegion]);

  const getCountryColor = (isoNum: string) => {
    if (isoNum === RUSSIA_ISO) {
      return selectedRegion ? "#6B2A2A" : "#8B1A1A";
    }
    // Соседи — чуть светлее
    const neighbors = ["860", "398", "804", "051", "792", "840", "156", "392"];
    if (neighbors.includes(isoNum)) return "#1E2A3A";
    return "#141820";
  };

  const getCountryStroke = (isoNum: string) => {
    if (isoNum === RUSSIA_ISO) return "#C8973A";
    return "#2A3040";
  };

  const getCountryStrokeWidth = (isoNum: string) => {
    if (isoNum === RUSSIA_ISO) return 1.2;
    return 0.4;
  };

  return (
    <div className="relative w-full h-full" style={{ minHeight: 420 }}>
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {[
          { label: "+", action: () => setZoom(z => Math.min(z * 1.5, 12)) },
          { label: "−", action: () => setZoom(z => Math.max(z / 1.5, 1)) },
          { label: "⌂", action: () => { setZoom(1); setCenter([60, 60]); } },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action}
            className="w-7 h-7 rounded-sm text-sm font-bold flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: "rgba(200,151,58,0.15)", color: "#C8973A", border: "1px solid rgba(200,151,58,0.3)" }}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ background: "#8B1A1A", border: "1px solid #C8973A" }} />
          <span className="text-xs" style={{ color: "#C4B896" }}>Россия</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ background: "#C8973A" }} />
          <span className="text-xs" style={{ color: "#C4B896" }}>Выбранный регион</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm" style={{ background: "#141820", border: "1px solid #2A3040" }} />
          <span className="text-xs" style={{ color: "#C4B896" }}>Другие страны</span>
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [20, 45] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          onMoveEnd={({ zoom: z, coordinates }) => {
            setZoom(z);
            setCenter(coordinates as [number, number]);
          }}
        >
          {/* Ocean background */}
          <rect x="-1000" y="-1000" width="3000" height="3000" fill="#0A1018" />

          {/* Latitude grid lines */}
          {[-60, -30, 0, 30, 60].map(lat => (
            <line
              key={lat}
              x1="-1000" y1={lat} x2="1000" y2={lat}
              stroke="#1A2030" strokeWidth="0.3" strokeOpacity="0.5"
            />
          ))}

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoNum = geo.id?.toString() || "";
                const isRussia = isoNum === RUSSIA_ISO;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(isoNum)}
                    stroke={getCountryStroke(isoNum)}
                    strokeWidth={getCountryStrokeWidth(isoNum)}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: isRussia ? "#AA2A2A" : "#1E2A3A",
                        outline: "none",
                        cursor: isRussia ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Region markers on Russia */}
          {RUSSIA_REGIONS.map((region) => {
            const isSelected = selectedRegion === region.key;
            const isHovered = hoveredRegion === region.key;
            return (
              <Marker
                key={region.key}
                coordinates={region.coords}
                onClick={() => onRegionClick(region.key)}
                onMouseEnter={() => setHoveredRegion(region.key)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Pulse ring for selected */}
                {isSelected && (
                  <circle r={18 / zoom} fill="none" stroke="#C8973A" strokeWidth={1.5 / zoom} strokeOpacity="0.5" />
                )}
                {/* Dot */}
                <circle
                  r={(isSelected || isHovered ? 7 : 5) / zoom}
                  fill={isSelected ? "#C8973A" : isHovered ? "#E0A848" : "#8B1A1A"}
                  stroke={isSelected ? "#F0D070" : "#C8973A"}
                  strokeWidth={1.5 / zoom}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                />
                {/* Label */}
                {zoom >= 2 && (
                  <text
                    textAnchor="middle"
                    y={-10 / zoom}
                    style={{
                      fontFamily: "'Golos Text', sans-serif",
                      fontSize: `${9 / zoom}px`,
                      fill: isSelected ? "#F0D070" : "#C4B896",
                      pointerEvents: "none",
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {region.icon} {region.name}
                  </text>
                )}
                {/* Compact icon when zoomed out */}
                {zoom < 2 && (
                  <text
                    textAnchor="middle"
                    y={-8 / zoom}
                    style={{
                      fontSize: `${10 / zoom}px`,
                      pointerEvents: "none",
                    }}
                  >
                    {region.icon}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute z-20 px-2 py-1 rounded-sm text-xs pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 30,
            background: "rgba(20,12,8,0.95)",
            border: "1px solid rgba(200,151,58,0.4)",
            color: "#F0E6CC",
          }}>
          {tooltip.name}
        </div>
      )}

      {/* Decorative frame */}
      <div className="absolute inset-0 pointer-events-none rounded-sm"
        style={{ border: "1px solid rgba(200,151,58,0.25)", boxShadow: "inset 0 0 40px rgba(139,26,26,0.08)" }} />
      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C8973A, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C8973A, transparent)" }} />
    </div>
  );
});

WorldMap.displayName = "WorldMap";
export default WorldMap;
