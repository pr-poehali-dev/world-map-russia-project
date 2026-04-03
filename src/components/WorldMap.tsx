import { useState, useEffect, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Коды стран с работами — подсвечиваются ярче (обновляется из пропсов)
// ISO 3166-1 numeric
const RUSSIA_ISO = "643";

// Регионы России для маркеров
const RUSSIA_REGIONS = [
  { key: "northwest", name: "Северо-Запад", coords: [30.3, 59.9] as [number, number] },
  { key: "north",     name: "Север",        coords: [40.5, 65.5] as [number, number] },
  { key: "center",    name: "Центр",        coords: [37.6, 55.7] as [number, number] },
  { key: "south",     name: "Юг",           coords: [39.7, 47.2] as [number, number] },
  { key: "volga",     name: "Поволжье",     coords: [49.1, 56.3] as [number, number] },
  { key: "ural",      name: "Урал",         coords: [60.6, 56.8] as [number, number] },
  { key: "siberia",   name: "Сибирь",       coords: [82.9, 56.0] as [number, number] },
];

// Числовые ISO → alpha-3 для удобства
// Основные страны мира (числовой iso → alpha3)
const ISO_NUM_TO_ALPHA3: Record<string, string> = {
  "004":"AFG","008":"ALB","012":"DZA","024":"AGO","032":"ARG","036":"AUS","040":"AUT",
  "050":"BGD","056":"BEL","068":"BOL","076":"BRA","100":"BGR","116":"KHM","120":"CMR",
  "124":"CAN","144":"LKA","152":"CHL","156":"CHN","170":"COL","180":"COD","188":"CRI",
  "191":"HRV","192":"CUB","203":"CZE","208":"DNK","214":"DOM","218":"ECU","818":"EGY",
  "222":"SLV","231":"ETH","246":"FIN","250":"FRA","276":"DEU","288":"GHA","300":"GRC",
  "320":"GTM","324":"GIN","332":"HTI","340":"HND","348":"HUN","356":"IND","360":"IDN",
  "364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","388":"JAM","392":"JPN",
  "400":"JOR","398":"KAZ","404":"KEN","408":"PRK","410":"KOR","414":"KWT","418":"LAO",
  "422":"LBN","430":"LBR","434":"LBY","484":"MEX","504":"MAR","508":"MOZ","524":"NPL",
  "528":"NLD","540":"NCL","554":"NZL","558":"NIC","566":"NGA","578":"NOR","586":"PAK",
  "591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT",
  "630":"PRI","634":"QAT","642":"ROU","643":"RUS","682":"SAU","686":"SEN","694":"SLE",
  "706":"SOM","710":"ZAF","724":"ESP","729":"SDN","752":"SWE","756":"CHE","760":"SYR",
  "764":"THA","788":"TUN","792":"TUR","804":"UKR","784":"ARE","826":"GBR","840":"USA",
  "858":"URY","860":"UZB","862":"VEN","704":"VNM","887":"YEM","894":"ZMB","716":"ZWE",
  "051":"ARM","031":"AZE","112":"BLR","268":"GEO","398":"KAZ","417":"KGZ","496":"MNG",
  "762":"TJK","795":"TKM",
};

export interface SelectedLocation {
  countryIso: string;    // alpha-3
  countryName: string;
  regionKey?: string;    // только для России
}

interface Props {
  selected: SelectedLocation | null;
  onSelect: (loc: SelectedLocation) => void;
  activeCountries?: string[]; // alpha-3 коды стран, где есть работы
}

const WorldMap = memo(({ selected, onSelect, activeCountries = [] }: Props) => {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1.4);
  const [center, setCenter] = useState<[number, number]>([30, 30]);
  const [showRussiaRegions, setShowRussiaRegions] = useState(false);

  useEffect(() => {
    if (selected) {
      if (selected.countryIso === "RUS") {
        setCenter([60, 60]);
        setZoom(3);
        setShowRussiaRegions(true);
      }
    }
  }, [selected]);

  const getCountryFill = (isoNum: string) => {
    const alpha3 = ISO_NUM_TO_ALPHA3[isoNum];
    const isRussia = isoNum === RUSSIA_ISO;
    const isSelected = selected && alpha3 === selected.countryIso;
    const isActive = alpha3 && activeCountries.includes(alpha3);
    const isHovered = isoNum === hoveredIso;

    if (isSelected) return "#C8973A";
    if (isHovered && isRussia) return "#AA3030";
    if (isHovered) return "#2A4060";
    if (isRussia) return "#8B1A1A";
    if (isActive) return "#1E3A5A";
    return "#16202E";
  };

  const getCountryStroke = (isoNum: string) => {
    const alpha3 = ISO_NUM_TO_ALPHA3[isoNum];
    const isRussia = isoNum === RUSSIA_ISO;
    const isSelected = selected && alpha3 === selected.countryIso;
    const isActive = alpha3 && activeCountries.includes(alpha3);
    if (isSelected) return "#F0D070";
    if (isRussia) return "#C8973A";
    if (isActive) return "#4A6A9A";
    return "#2A3848";
  };

  const getStrokeWidth = (isoNum: string) => {
    const alpha3 = ISO_NUM_TO_ALPHA3[isoNum];
    const isSelected = selected && alpha3 === selected.countryIso;
    if (isSelected) return 1.5;
    if (isoNum === RUSSIA_ISO) return 1.0;
    return 0.4;
  };

  const handleCountryClick = (geo: { id: string | number; properties: { name: string } }) => {
    const isoNum = geo.id?.toString() || "";
    const alpha3 = ISO_NUM_TO_ALPHA3[isoNum];
    if (!alpha3) return;
    const name = geo.properties.name || alpha3;

    if (isoNum === RUSSIA_ISO) {
      // Для России показываем регионы
      onSelect({ countryIso: "RUS", countryName: "Россия" });
      setShowRussiaRegions(true);
      setCenter([60, 60]);
      setZoom(3);
    } else {
      setShowRussiaRegions(false);
      onSelect({ countryIso: alpha3, countryName: name });
    }
  };

  const handleRegionClick = (regionKey: string, regionName: string) => {
    onSelect({ countryIso: "RUS", countryName: "Россия", regionKey });
  };

  return (
    <div className="relative w-full" style={{ height: 480 }}>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {[
          { label: "+", fn: () => setZoom(z => Math.min(z * 1.6, 20)) },
          { label: "−", fn: () => setZoom(z => Math.max(z / 1.6, 1)) },
          { label: "⌂", fn: () => { setZoom(1.4); setCenter([30, 30]); setShowRussiaRegions(false); } },
        ].map(b => (
          <button key={b.label} onClick={b.fn}
            className="w-8 h-8 rounded-sm text-sm font-bold flex items-center justify-center"
            style={{ background: "rgba(14,20,30,0.9)", color: "#C8973A", border: "1px solid rgba(200,151,58,0.35)" }}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 space-y-1.5 rounded-sm px-3 py-2"
        style={{ background: "rgba(10,14,20,0.85)", border: "1px solid rgba(200,151,58,0.15)" }}>
        {[
          { color: "#8B1A1A", border: "#C8973A", label: "Россия" },
          { color: "#C8973A", border: "#F0D070", label: "Выбрано" },
          { color: "#1E3A5A", border: "#4A6A9A", label: "Есть работы" },
          { color: "#16202E", border: "#2A3848", label: "Страны" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm flex-shrink-0"
              style={{ background: l.color, border: `1px solid ${l.border}` }} />
            <span className="text-xs" style={{ color: "#C4B896" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [10, 20] }}
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
          {/* Ocean */}
          <rect x="-5000" y="-5000" width="15000" height="15000"
            fill="url(#oceanGrad)" />
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0D1A28" />
              <stop offset="100%" stopColor="#080E18" />
            </radialGradient>
          </defs>

          {/* Grid */}
          {[-60, -30, 0, 30, 60].map(lat => (
            <line key={`lat${lat}`} x1="-5000" y1={lat} x2="5000" y2={lat}
              stroke="#1A2838" strokeWidth="0.2" strokeOpacity="0.6" />
          ))}
          {[-180, -120, -60, 0, 60, 120, 180].map(lng => (
            <line key={`lng${lng}`} x1={lng} y1="-5000" x2={lng} y2="5000"
              stroke="#1A2838" strokeWidth="0.2" strokeOpacity="0.4" />
          ))}

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoNum = geo.id?.toString() || "";
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryFill(isoNum)}
                    stroke={getCountryStroke(isoNum)}
                    strokeWidth={getStrokeWidth(isoNum)}
                    onClick={() => handleCountryClick(geo as { id: string | number; properties: { name: string } })}
                    onMouseEnter={(e) => {
                      setHoveredIso(isoNum);
                      setTooltip({
                        name: geo.properties.name || "",
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredIso(null);
                      setTooltip(null);
                    }}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Russia region markers */}
          {showRussiaRegions && RUSSIA_REGIONS.map(region => {
            const isSelected = selected?.regionKey === region.key;
            return (
              <Marker
                key={region.key}
                coordinates={region.coords}
                onClick={() => handleRegionClick(region.key, region.name)}
              >
                {isSelected && (
                  <circle r={20 / zoom} fill="none" stroke="#C8973A"
                    strokeWidth={1.5 / zoom} strokeOpacity="0.6"
                    style={{ animation: "pulse 2s infinite" }} />
                )}
                <circle
                  r={(isSelected ? 6 : 4) / zoom}
                  fill={isSelected ? "#C8973A" : "#FF6B6B"}
                  stroke={isSelected ? "#F0D070" : "#C8973A"}
                  strokeWidth={1.5 / zoom}
                  style={{ cursor: "pointer", filter: isSelected ? "drop-shadow(0 0 4px #C8973A)" : undefined }}
                />
                {zoom >= 2.5 && (
                  <text
                    textAnchor="middle"
                    y={-8 / zoom}
                    style={{
                      fontSize: `${8 / zoom}px`,
                      fill: isSelected ? "#F0D070" : "#E0D0A0",
                      pointerEvents: "none",
                      fontFamily: "'Golos Text', sans-serif",
                      textShadow: "0 1px 4px rgba(0,0,0,1)",
                    }}>
                    {region.name}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed z-50 px-2 py-1 rounded-sm text-xs pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 32,
            background: "rgba(10,14,20,0.95)",
            border: "1px solid rgba(200,151,58,0.4)",
            color: "#F0E6CC",
            whiteSpace: "nowrap",
          }}>
          {tooltip.name}
        </div>
      )}

      {/* Frame */}
      <div className="absolute inset-0 pointer-events-none rounded-sm"
        style={{ border: "1px solid rgba(200,151,58,0.2)" }} />
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C8973A50, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C8973A50, transparent)" }} />
    </div>
  );
});

WorldMap.displayName = "WorldMap";
export default WorldMap;
export type { SelectedLocation };
