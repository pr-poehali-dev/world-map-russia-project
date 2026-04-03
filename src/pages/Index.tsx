import { useState } from "react";
import Icon from "@/components/ui/icon";

const REGIONS = ["Все регионы", "Север", "Юг", "Урал", "Сибирь"];

const COSTUMES = [
  {
    id: 1, region: "Север", name: "Архангельский сарафан",
    desc: "Парчовый сарафан с золотым шитьём, характерный для Архангельской губернии. Отличается строгой геометрией и высоким кокошником.",
    color: "#1A3A6B", tag: "Женский",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
  {
    id: 2, region: "Юг", name: "Воронежский костюм",
    desc: "Яркая понёва с красным доминирующим цветом, богатой вышивкой-«красотой» по подолу. Многослойный и торжественный.",
    color: "#8B1A1A", tag: "Женский",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
  {
    id: 3, region: "Урал", name: "Уральский праздничный",
    desc: "Особое влияние горнозаводской культуры. Синий и зелёный с серебряным шитьём, массивные украшения из уральских самоцветов.",
    color: "#2D5A27", tag: "Женский",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
  {
    id: 4, region: "Сибирь", name: "Сибирский казачий",
    desc: "Мужской строй с богатой вышивкой по вороту и манжетам. Сдержанная гамма с акцентами тёмно-красного и чёрного.",
    color: "#4A3728", tag: "Мужской",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
  {
    id: 5, region: "Север", name: "Вологодский кружевной",
    desc: "Знаменитое вологодское кружево украшает передник и воротник. Белоснежный узор на тёмном фоне — символ северного ремесла.",
    color: "#1A3A6B", tag: "Женский",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
  {
    id: 6, region: "Юг", name: "Кубанский казачий",
    desc: "Чёрная черкеска с газырями и алыми лампасами. Мужественный строй казачества юга России, пронизанный воинской статью.",
    color: "#8B1A1A", tag: "Мужской",
    img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg"
  },
];

const PATTERNS = [
  {
    id: 1, region: "Север", name: "Вологодская звезда",
    desc: "Восьмиконечная звезда — оберег от тёмных сил. Строгая симметрия, только красный и белый.",
    symbol: "✦", technique: "Вышивка крестом"
  },
  {
    id: 2, region: "Юг", name: "Курский ромб",
    desc: "Ромбические решётки с отростками символизируют засеянное поле и плодородие земли.",
    symbol: "◆", technique: "Ткачество"
  },
  {
    id: 3, region: "Урал", name: "Уральский конь",
    desc: "Стилизованный конь — символ солнца и движения. Характерен для горнозаводских районов Урала.",
    symbol: "🐴", technique: "Набойка"
  },
  {
    id: 4, region: "Сибирь", name: "Сибирский олень",
    desc: "Образ оленя пришёл от коренных народов Сибири. Плавные линии и природные мотивы.",
    symbol: "🦌", technique: "Роспись"
  },
  {
    id: 5, region: "Север", name: "Поморская волна",
    desc: "Волнообразный орнамент отражает связь поморов с морем. Синий, белый, серебряный.",
    symbol: "〜", technique: "Резьба по кости"
  },
  {
    id: 6, region: "Юг", name: "Казачий терновник",
    desc: "Переплетённые ветви с цветами — символ стойкости и красоты донского края.",
    symbol: "✿", technique: "Вышивка гладью"
  },
];

const MAP_REGIONS = [
  {
    key: "Север", label: "Север", icon: "❄️",
    desc: "Архангельская, Вологодская, Мурманская области. Суровый климат породил строгие орнаменты и тёплые ткани.",
    costumes: 48, patterns: 120, color: "#1A3A6B"
  },
  {
    key: "Юг", label: "Юг", icon: "☀️",
    desc: "Краснодарский край, Ростовская, Воронежская области. Богатство степей отразилось в ярких красках и сложной вышивке.",
    costumes: 63, patterns: 185, color: "#8B1A1A"
  },
  {
    key: "Урал", label: "Урал", icon: "⛰️",
    desc: "Свердловская, Пермская, Челябинская области. Самоцветный край с уникальным горнозаводским стилем.",
    costumes: 35, patterns: 97, color: "#2D5A27"
  },
  {
    key: "Сибирь", label: "Сибирь", icon: "🌲",
    desc: "От Тюмени до Байкала. Слияние русских традиций с культурой коренных народов — хантов, эвенков, бурят.",
    costumes: 52, patterns: 143, color: "#4A3728"
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("map");
  const [activeRegion, setActiveRegion] = useState("Все регионы");
  const [selectedMapRegion, setSelectedMapRegion] = useState<string | null>(null);

  const filteredCostumes = activeRegion === "Все регионы"
    ? COSTUMES
    : COSTUMES.filter(c => c.region === activeRegion);

  const filteredPatterns = activeRegion === "Все регионы"
    ? PATTERNS
    : PATTERNS.filter(p => p.region === activeRegion);

  return (
    <div className="min-h-screen bg-background ornament-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md"
        style={{ background: "rgba(16,10,6,0.92)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #8B1A1A, #C8973A)" }}>
              ✦
            </div>
            <div className="font-bold text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070", letterSpacing: "0.15em" }}>
              Народное наследие
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { id: "map", label: "Карта", icon: "Map" },
              { id: "costumes", label: "Костюмы", icon: "Shirt" },
              { id: "patterns", label: "Узоры", icon: "Layers" },
              { id: "about", label: "О проекте", icon: "BookOpen" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all duration-300"
                style={{
                  fontFamily: "'Golos Text', sans-serif",
                  color: activeSection === item.id ? "#F0D070" : "#C4B896",
                  background: activeSection === item.id ? "rgba(139,26,26,0.3)" : "transparent",
                  borderBottom: activeSection === item.id ? "2px solid #C8973A" : "2px solid transparent"
                }}
              >
                <Icon name={item.icon} size={15} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 relative overflow-hidden">
        <div className="relative h-[420px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(139,26,26,0.95) 0%, rgba(16,10,6,1) 50%, rgba(26,58,107,0.9) 100%)"
          }}>
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #C8973A 0px, #C8973A 1px, transparent 1px, transparent 40px)`,
            }} />
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #8B1A1A, #C8973A, #1A3A6B, #C8973A, #8B1A1A)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #8B1A1A, #C8973A, #1A3A6B, #C8973A, #8B1A1A)" }} />

          <div className="text-center z-10 px-6 fade-in-up">
            <div className="text-4xl mb-4">✦ ✦ ✦</div>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="gold-shimmer">Народное</span>
              <br />
              <span style={{ color: "#F0E6CC" }}>Наследие</span>
            </h1>
            <div className="ornament-divider my-6 max-w-md mx-auto">
              <span className="text-sm tracking-widest uppercase" style={{ color: "#C8973A", fontFamily: "'Golos Text', sans-serif" }}>
                Атлас традиций России
              </span>
            </div>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#C4B896", fontFamily: "'Golos Text', sans-serif" }}>
              Костюмы, орнаменты и культурные традиции народов России —
              от Поморья до Байкала
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* MAP SECTION */}
        {activeSection === "map" && (
          <div className="fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>
                Карта регионов
              </h2>
              <p style={{ color: "#C4B896" }}>Выберите регион, чтобы узнать о его культуре</p>
            </div>

            <div className="relative mb-8">
              <img
                src="https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/b1b9399a-c822-49e5-bcf7-21d809dfa68d.jpg"
                alt="Карта России"
                className="w-full h-72 object-cover rounded-sm"
                style={{ border: "1px solid rgba(200,151,58,0.3)" }}
              />
              <div className="absolute inset-0 rounded-sm"
                style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(16,10,6,0.9) 100%)" }} />
              <div className="absolute bottom-6 left-6">
                <p className="text-xs uppercase tracking-widest" style={{ color: "#C8973A" }}>
                  ✦ Нажмите на карточку региона ниже
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MAP_REGIONS.map((r, i) => (
                <div
                  key={r.key}
                  className={`folk-card rounded-sm p-6 cursor-pointer fade-in-up fade-in-up-delay-${i + 1}`}
                  style={{
                    background: selectedMapRegion === r.key
                      ? `linear-gradient(135deg, ${r.color}CC, ${r.color}66)`
                      : "rgba(255,255,255,0.03)",
                    boxShadow: selectedMapRegion === r.key ? `0 8px 32px ${r.color}40` : undefined
                  }}
                  onClick={() => setSelectedMapRegion(selectedMapRegion === r.key ? null : r.key)}
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                    {r.label}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "#C4B896", lineHeight: "1.6" }}>{r.desc}</p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold" style={{ color: "#C8973A" }}>{r.costumes}</div>
                      <div className="text-xs" style={{ color: "#8A7A60" }}>костюмов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold" style={{ color: "#C8973A" }}>{r.patterns}</div>
                      <div className="text-xs" style={{ color: "#8A7A60" }}>узоров</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COSTUMES SECTION */}
        {activeSection === "costumes" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>
                Народные костюмы
              </h2>
              <p style={{ color: "#C4B896" }}>Традиционный строй различных губерний России</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {REGIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`region-btn px-5 py-2 rounded-sm text-sm font-medium ${activeRegion === r ? "active" : ""}`}
                  style={{ background: activeRegion === r ? "linear-gradient(135deg, #8B1A1A, #6B1010)" : "rgba(255,255,255,0.04)" }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCostumes.map((c, i) => (
                <div key={c.id} className={`folk-card rounded-sm overflow-hidden fade-in-up fade-in-up-delay-${Math.min(i + 1, 4)}`}
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(16,10,6,0.9) 100%)" }} />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs rounded-sm font-medium"
                        style={{ background: c.color, color: "#F0E6CC" }}>
                        {c.region}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs rounded-sm"
                        style={{ background: "rgba(200,151,58,0.2)", color: "#F0D070", border: "1px solid rgba(200,151,58,0.3)" }}>
                        {c.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                      {c.name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#C4B896" }}>{c.desc}</p>
                    <button className="mt-4 flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                      style={{ color: "#C8973A" }}>
                      Подробнее <Icon name="ArrowRight" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCostumes.length === 0 && (
              <div className="text-center py-20" style={{ color: "#8A7A60" }}>
                <div className="text-4xl mb-4">✦</div>
                <p>По данному региону костюмы пока не добавлены</p>
              </div>
            )}
          </div>
        )}

        {/* PATTERNS SECTION */}
        {activeSection === "patterns" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>
                Народные узоры
              </h2>
              <p style={{ color: "#C4B896" }}>Символика и техники орнаментального искусства</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {REGIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`region-btn px-5 py-2 rounded-sm text-sm font-medium ${activeRegion === r ? "active" : ""}`}
                  style={{ background: activeRegion === r ? "linear-gradient(135deg, #8B1A1A, #6B1010)" : "rgba(255,255,255,0.04)" }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <img
                src="https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/6ac13ef3-2e4f-4313-8c06-a34fcede0bdb.jpg"
                alt="Народные узоры"
                className="w-full h-48 object-cover rounded-sm"
                style={{ border: "1px solid rgba(200,151,58,0.2)" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPatterns.map((p, i) => (
                <div key={p.id} className={`folk-card rounded-sm p-6 fade-in-up fade-in-up-delay-${Math.min(i + 1, 4)}`}
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-sm flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(139,26,26,0.4), rgba(26,58,107,0.4))", border: "1px solid rgba(200,151,58,0.3)" }}>
                      {p.symbol}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <h3 className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                          {p.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-sm whitespace-nowrap"
                          style={{ background: "rgba(200,151,58,0.15)", color: "#C8973A", border: "1px solid rgba(200,151,58,0.2)" }}>
                          {p.region}
                        </span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: "#C4B896", lineHeight: "1.5" }}>{p.desc}</p>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "#8A7A60" }}>
                        <Icon name="Layers" size={11} />
                        {p.technique}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatterns.length === 0 && (
              <div className="text-center py-20" style={{ color: "#8A7A60" }}>
                <div className="text-4xl mb-4">✦</div>
                <p>По данному региону узоры пока не добавлены</p>
              </div>
            )}
          </div>
        )}

        {/* ABOUT SECTION */}
        {activeSection === "about" && (
          <div className="fade-in-up max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>
                О проекте
              </h2>
              <div className="ornament-divider"><span style={{ color: "#C8973A" }}>✦</span></div>
            </div>

            <div className="space-y-6">
              <div className="folk-card rounded-sm p-8" style={{ background: "rgba(255,255,255,0.03)" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                  Миссия
                </h3>
                <p className="leading-relaxed" style={{ color: "#C4B896" }}>
                  Народное наследие — цифровой атлас традиционной культуры России. Мы собираем,
                  систематизируем и сохраняем знания о народных костюмах, орнаментах и ремёслах
                  различных регионов страны — от берегов Белого моря до берегов Байкала.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "Shirt", num: "198", label: "Костюмов в базе", color: "#8B1A1A" },
                  { icon: "Layers", num: "545", label: "Орнаментов", color: "#1A3A6B" },
                  { icon: "Map", num: "4", label: "Региона России", color: "#C8973A" },
                ].map(item => (
                  <div key={item.label} className="folk-card rounded-sm p-6 text-center"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${item.color}30`, border: `1px solid ${item.color}50` }}>
                      <Icon name={item.icon} size={20} style={{ color: item.color }} />
                    </div>
                    <div className="text-3xl font-bold mb-1 gold-shimmer"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {item.num}
                    </div>
                    <div className="text-sm" style={{ color: "#8A7A60" }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="folk-card rounded-sm p-8" style={{ background: "rgba(255,255,255,0.03)" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                  Как устроен атлас
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: "Map", title: "Карта", desc: "Интерактивная карта с регионами России и их культурными особенностями" },
                    { icon: "Shirt", title: "Костюмы", desc: "Каталог с фотографиями и описаниями традиционных костюмов по регионам" },
                    { icon: "Layers", title: "Узоры", desc: "Библиотека орнаментов с расшифровкой символики и техник исполнения" },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(139,26,26,0.3)", border: "1px solid rgba(200,151,58,0.2)" }}>
                        <Icon name={item.icon} size={18} style={{ color: "#C8973A" }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1" style={{ color: "#F0E6CC", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                          {item.title}
                        </div>
                        <p className="text-sm" style={{ color: "#C4B896" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 text-center" style={{ color: "#8A7A60" }}>
        <div className="text-2xl mb-2" style={{ color: "#C8973A" }}>✦ ✦ ✦</div>
        <p className="text-sm">Народное наследие России · Атлас традиционной культуры</p>
      </footer>
    </div>
  );
}