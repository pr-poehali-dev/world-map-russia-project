import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import WorldMap, { SelectedLocation } from "@/components/WorldMap";

const API_URL = "https://functions.poehali.dev/5a89488a-661e-4f72-a3ef-5bce250da99e";

const RUSSIA_REGION_NAMES: Record<string, string> = {
  north: "Север", south: "Юг", ural: "Урал", siberia: "Сибирь",
  center: "Центр", volga: "Поволжье", northwest: "Северо-Запад",
};

const CATEGORY_LABELS: Record<string, string> = {
  craft: "Поделка", applique: "Аппликация", drawing: "Рисунок", other: "Другое",
};

const NAV_ITEMS = [
  { id: "map", label: "Карта", icon: "Map" },
  { id: "costumes", label: "Костюмы", icon: "Shirt" },
  { id: "patterns", label: "Узоры", icon: "Layers" },
  { id: "about", label: "О проекте", icon: "BookOpen" },
];

const COSTUMES = [
  { id: 1, region: "Север", name: "Архангельский сарафан", desc: "Парчовый сарафан с золотым шитьём. Строгая геометрия и высокий кокошник.", color: "#1A3A6B", tag: "Женский", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
  { id: 2, region: "Юг", name: "Воронежский костюм", desc: "Яркая понёва с богатой вышивкой-«красотой» по подолу. Многослойный и торжественный.", color: "#8B1A1A", tag: "Женский", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
  { id: 3, region: "Урал", name: "Уральский праздничный", desc: "Синий и зелёный с серебряным шитьём, украшения из самоцветов.", color: "#2D5A27", tag: "Женский", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
  { id: 4, region: "Сибирь", name: "Сибирский казачий", desc: "Мужской строй с вышивкой по вороту. Тёмно-красный и чёрный акценты.", color: "#4A3728", tag: "Мужской", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
  { id: 5, region: "Север", name: "Вологодский кружевной", desc: "Знаменитое вологодское кружево. Белоснежный узор на тёмном фоне.", color: "#1A3A6B", tag: "Женский", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
  { id: 6, region: "Юг", name: "Кубанский казачий", desc: "Чёрная черкеска с газырями и алыми лампасами.", color: "#8B1A1A", tag: "Мужской", img: "https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/bc4e9b1e-1b07-4bec-b943-0b2d24b89096.jpg" },
];

const PATTERNS = [
  { id: 1, region: "Север", name: "Вологодская звезда", desc: "Восьмиконечная звезда — оберег от тёмных сил. Красный и белый.", symbol: "✦", technique: "Вышивка крестом" },
  { id: 2, region: "Юг", name: "Курский ромб", desc: "Ромбические решётки символизируют засеянное поле.", symbol: "◆", technique: "Ткачество" },
  { id: 3, region: "Урал", name: "Уральский конь", desc: "Стилизованный конь — символ солнца и движения.", symbol: "🐴", technique: "Набойка" },
  { id: 4, region: "Сибирь", name: "Сибирский олень", desc: "Образ оленя от коренных народов Сибири. Плавные линии.", symbol: "🦌", technique: "Роспись" },
  { id: 5, region: "Север", name: "Поморская волна", desc: "Волнообразный орнамент — связь поморов с морем.", symbol: "〜", technique: "Резьба по кости" },
  { id: 6, region: "Юг", name: "Казачий терновник", desc: "Переплетённые ветви — символ стойкости донского края.", symbol: "✿", technique: "Вышивка гладью" },
];

interface Work {
  id: number;
  region_key: string;
  country_iso: string;
  country_name: string;
  title: string;
  author_name: string;
  category: string;
  description: string;
  image_url: string;
  created_at: string;
}

const COSTUME_REGIONS = ["Все регионы", "Север", "Юг", "Урал", "Сибирь"];

export default function Index() {
  const [activeSection, setActiveSection] = useState("map");
  const [costumeRegion, setCostumeRegion] = useState("Все регионы");
  const [patternRegion, setPatternRegion] = useState("Все регионы");

  // Map state
  const [selected, setSelected] = useState<SelectedLocation | null>(null);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // Upload form
  const [form, setForm] = useState({ title: "", author_name: "", category: "drawing", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminWorks, setAdminWorks] = useState<Work[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Загружаем страны с работами при старте
  useEffect(() => {
    fetch(`${API_URL}?action=countries`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setActiveCountries(data.map((d: { iso: string }) => d.iso));
      })
      .catch(() => {});
  }, []);

  const fetchWorks = async (loc: SelectedLocation) => {
    setWorksLoading(true);
    setWorks([]);
    try {
      let url = `${API_URL}?country=${loc.countryIso}`;
      if (loc.regionKey) url += `&region=${loc.regionKey}`;
      const res = await fetch(url);
      const data = await res.json();
      setWorks(Array.isArray(data) ? data : []);
    } catch { setWorks([]); }
    setWorksLoading(false);
  };

  const handleSelect = (loc: SelectedLocation) => {
    setSelected(loc);
    setShowUpload(false);
    setSelectedWork(null);
    fetchWorks(loc);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageFile) { setUploadError("Выберите изображение"); return; }
    if (!form.title || !form.author_name) { setUploadError("Заполните название и имя автора"); return; }
    if (!selected) return;

    setUploading(true);
    setUploadError("");
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const ext = imageFile.name.split(".").pop() || "jpg";
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            country_iso: selected.countryIso,
            country_name: selected.countryName,
            region_key: selected.regionKey || null,
            image_base64: base64,
            image_ext: ext,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setUploadSuccess(true);
          setForm({ title: "", author_name: "", category: "drawing", description: "" });
          setImageFile(null);
          setImagePreview(null);
        } else {
          setUploadError(data.error || "Ошибка загрузки");
        }
      } catch { setUploadError("Ошибка соединения"); }
      setUploading(false);
    };
  };

  const fetchAdminWorks = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const res = await fetch(`${API_URL}?action=pending&password=${encodeURIComponent(adminPassword)}`);
      const data = await res.json();
      if (res.ok) setAdminWorks(Array.isArray(data) ? data : []);
      else setAdminError(data.error || "Ошибка");
    } catch { setAdminError("Ошибка соединения"); }
    setAdminLoading(false);
  };

  const handleModerate = async (id: number, action: "approve" | "reject") => {
    await fetch(`${API_URL}?action=moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, password: adminPassword }),
    });
    setAdminWorks(prev => prev.filter(w => w.id !== id));
  };

  const filteredCostumes = costumeRegion === "Все регионы" ? COSTUMES : COSTUMES.filter(c => c.region === costumeRegion);
  const filteredPatterns = patternRegion === "Все регионы" ? PATTERNS : PATTERNS.filter(p => p.region === patternRegion);

  // Название выбранного места
  const selectedLabel = selected
    ? selected.regionKey
      ? `${selected.countryName} · ${RUSSIA_REGION_NAMES[selected.regionKey] ?? selected.regionKey}`
      : selected.countryName
    : null;

  return (
    <div className="min-h-screen bg-background ornament-bg">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md"
        style={{ background: "rgba(16,10,6,0.92)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #8B1A1A, #C8973A)" }}>✦</div>
            <div className="font-bold text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070", letterSpacing: "0.15em" }}>
              Народное наследие
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-all duration-300"
                style={{
                  color: activeSection === item.id ? "#F0D070" : "#C4B896",
                  background: activeSection === item.id ? "rgba(139,26,26,0.3)" : "transparent",
                  borderBottom: activeSection === item.id ? "2px solid #C8973A" : "2px solid transparent",
                }}>
                <Icon name={item.icon} size={15} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
            <button onClick={() => setShowAdmin(true)}
              className="ml-2 px-3 py-2 rounded-sm text-xs transition-all"
              style={{ color: "#8A7A60", border: "1px solid rgba(200,151,58,0.15)" }}>
              <Icon name="Shield" size={14} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16">
        <div className="relative h-[320px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(139,26,26,0.95) 0%, rgba(16,10,6,1) 50%, rgba(26,58,107,0.9) 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `repeating-linear-gradient(45deg, #C8973A 0px, #C8973A 1px, transparent 1px, transparent 40px)` }} />
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #8B1A1A, #C8973A, #1A3A6B, #C8973A, #8B1A1A)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, #8B1A1A, #C8973A, #1A3A6B, #C8973A, #8B1A1A)" }} />
          <div className="text-center z-10 px-6 fade-in-up">
            <div className="text-3xl mb-3">✦ ✦ ✦</div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="gold-shimmer">Народное</span><br />
              <span style={{ color: "#F0E6CC" }}>Наследие</span>
            </h1>
            <div className="ornament-divider my-4 max-w-md mx-auto">
              <span className="text-sm tracking-widest uppercase" style={{ color: "#C8973A" }}>
                Мировой атлас традиций
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ===== КАРТА ===== */}
        {activeSection === "map" && (
          <div className="fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-5xl font-bold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>
                Карта мира
              </h2>
              <p style={{ color: "#C4B896" }}>
                Нажмите на любую страну — откроется галерея творческих работ
              </p>
            </div>

            {/* Map */}
            <div className="rounded-sm overflow-hidden mb-6"
              style={{ background: "rgba(10,14,20,0.8)", border: "1px solid rgba(200,151,58,0.2)" }}>
              <WorldMap
                selected={selected}
                onSelect={handleSelect}
                activeCountries={activeCountries}
              />
            </div>

            {/* Panel below map */}
            {!selected ? (
              <div className="text-center py-12 rounded-sm"
                style={{ border: "1px dashed rgba(200,151,58,0.15)" }}>
                <div className="text-4xl mb-3 opacity-50">🌍</div>
                <p style={{ color: "#8A7A60" }}>Кликните на страну на карте</p>
                <p className="text-sm mt-1" style={{ color: "#6A6050" }}>
                  Россия разделена на регионы — после клика выберите конкретный
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header panel */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-2xl font-bold"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                      {selectedLabel}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "#8A7A60" }}>
                      {works.length > 0 ? `${works.length} работ в галерее` : "Галерея пока пустая"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowUpload(!showUpload); setUploadSuccess(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all"
                      style={{
                        background: showUpload ? "rgba(200,151,58,0.2)" : "linear-gradient(135deg, #8B1A1A, #6B1010)",
                        color: "#F0D070", border: "1px solid rgba(200,151,58,0.3)"
                      }}>
                      <Icon name="Upload" size={14} />
                      Добавить работу
                    </button>
                    <button onClick={() => { setSelected(null); setWorks([]); }}
                      className="px-3 py-2 rounded-sm"
                      style={{ color: "#8A7A60", border: "1px solid rgba(200,151,58,0.15)" }}>
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>

                {/* Upload form */}
                {showUpload && (
                  <div className="rounded-sm p-5 space-y-3 fade-in-up"
                    style={{ background: "rgba(139,26,26,0.08)", border: "1px solid rgba(200,151,58,0.2)" }}>
                    <h4 className="font-bold text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                      Добавить работу · {selectedLabel}
                    </h4>

                    {uploadSuccess ? (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-2">✦</div>
                        <p style={{ color: "#C8973A" }}>Работа отправлена на проверку!</p>
                        <p className="text-sm mt-1" style={{ color: "#8A7A60" }}>Она появится после одобрения модератором</p>
                        <button onClick={() => { setUploadSuccess(false); setShowUpload(false); }}
                          className="mt-3 px-4 py-2 rounded-sm text-sm"
                          style={{ background: "rgba(200,151,58,0.15)", color: "#F0D070" }}>
                          Закрыть
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { field: "title", label: "Название *", placeholder: "Название работы" },
                            { field: "author_name", label: "Автор *", placeholder: "Ваше имя" },
                          ].map(({ field, label, placeholder }) => (
                            <div key={field}>
                              <label className="block text-xs mb-1" style={{ color: "#8A7A60" }}>{label}</label>
                              <input
                                value={form[field as keyof typeof form]}
                                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full px-3 py-2 rounded-sm text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,151,58,0.2)", color: "#F0E6CC" }}
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs mb-1" style={{ color: "#8A7A60" }}>Категория</label>
                          <select value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className="w-full px-3 py-2 rounded-sm text-sm outline-none"
                            style={{ background: "rgba(14,10,6,0.95)", border: "1px solid rgba(200,151,58,0.2)", color: "#F0E6CC" }}>
                            <option value="drawing">Рисунок</option>
                            <option value="craft">Поделка</option>
                            <option value="applique">Аппликация</option>
                            <option value="other">Другое</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs mb-1" style={{ color: "#8A7A60" }}>Описание</label>
                          <textarea value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Расскажите о вашей работе..."
                            rows={2} className="w-full px-3 py-2 rounded-sm text-sm outline-none resize-none"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,151,58,0.2)", color: "#F0E6CC" }} />
                        </div>

                        <div>
                          <label className="block text-xs mb-1" style={{ color: "#8A7A60" }}>Фотография *</label>
                          <div onClick={() => fileRef.current?.click()}
                            className="w-full h-28 rounded-sm flex flex-col items-center justify-center cursor-pointer"
                            style={{ border: "2px dashed rgba(200,151,58,0.3)", background: "rgba(255,255,255,0.02)" }}>
                            {imagePreview
                              ? <img src={imagePreview} alt="preview" className="h-full w-full object-contain rounded-sm" />
                              : <>
                                  <Icon name="ImagePlus" size={24} style={{ color: "#8A7A60" }} />
                                  <span className="text-xs mt-1" style={{ color: "#8A7A60" }}>Нажмите для выбора</span>
                                </>
                            }
                          </div>
                          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>

                        {uploadError && <p className="text-xs" style={{ color: "#FF7070" }}>{uploadError}</p>}

                        <button onClick={handleUpload} disabled={uploading}
                          className="w-full py-2.5 rounded-sm font-medium text-sm"
                          style={{
                            background: uploading ? "rgba(200,151,58,0.2)" : "linear-gradient(135deg, #8B1A1A, #6B1010)",
                            color: "#F0D070"
                          }}>
                          {uploading ? "Загружаю..." : "Отправить на проверку"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Gallery */}
                {worksLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: "#C8973A", borderTopColor: "transparent" }} />
                  </div>
                ) : works.length === 0 ? (
                  <div className="text-center py-12 rounded-sm"
                    style={{ border: "1px dashed rgba(200,151,58,0.12)" }}>
                    <div className="text-4xl mb-3 opacity-40">🎨</div>
                    <p style={{ color: "#8A7A60" }}>Работ пока нет — будьте первым!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {works.map(w => (
                      <div key={w.id} onClick={() => setSelectedWork(w)}
                        className="folk-card rounded-sm overflow-hidden cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="h-36 overflow-hidden">
                          <img src={w.image_url} alt={w.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold truncate" style={{ color: "#F0D070" }}>{w.title}</p>
                          <p className="text-xs truncate mt-0.5" style={{ color: "#8A7A60" }}>
                            {w.author_name} · {CATEGORY_LABELS[w.category]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== КОСТЮМЫ ===== */}
        {activeSection === "costumes" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>Народные костюмы</h2>
              <p style={{ color: "#C4B896" }}>Традиционный строй различных губерний России</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {COSTUME_REGIONS.map(r => (
                <button key={r} onClick={() => setCostumeRegion(r)}
                  className={`region-btn px-5 py-2 rounded-sm text-sm font-medium ${costumeRegion === r ? "active" : ""}`}
                  style={{ background: costumeRegion === r ? "linear-gradient(135deg, #8B1A1A, #6B1010)" : "rgba(255,255,255,0.04)" }}>
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
                      <span className="px-2 py-1 text-xs rounded-sm font-medium" style={{ background: c.color, color: "#F0E6CC" }}>{c.region}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs rounded-sm" style={{ background: "rgba(200,151,58,0.2)", color: "#F0D070", border: "1px solid rgba(200,151,58,0.3)" }}>{c.tag}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>{c.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#C4B896" }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== УЗОРЫ ===== */}
        {activeSection === "patterns" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>Народные узоры</h2>
              <p style={{ color: "#C4B896" }}>Символика и техники орнаментального искусства</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {COSTUME_REGIONS.map(r => (
                <button key={r} onClick={() => setPatternRegion(r)}
                  className={`region-btn px-5 py-2 rounded-sm text-sm font-medium ${patternRegion === r ? "active" : ""}`}
                  style={{ background: patternRegion === r ? "linear-gradient(135deg, #8B1A1A, #6B1010)" : "rgba(255,255,255,0.04)" }}>
                  {r}
                </button>
              ))}
            </div>
            <div className="mb-8">
              <img src="https://cdn.poehali.dev/projects/187e270f-1b5f-4493-84ca-e5a145dac35b/files/6ac13ef3-2e4f-4313-8c06-a34fcede0bdb.jpg"
                alt="Народные узоры" className="w-full h-48 object-cover rounded-sm"
                style={{ border: "1px solid rgba(200,151,58,0.2)" }} />
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
                        <h3 className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>{p.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-sm whitespace-nowrap"
                          style={{ background: "rgba(200,151,58,0.15)", color: "#C8973A", border: "1px solid rgba(200,151,58,0.2)" }}>{p.region}</span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: "#C4B896", lineHeight: "1.5" }}>{p.desc}</p>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "#8A7A60" }}>
                        <Icon name="Layers" size={11} />{p.technique}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== О ПРОЕКТЕ ===== */}
        {activeSection === "about" && (
          <div className="fade-in-up max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0E6CC" }}>О проекте</h2>
              <div className="ornament-divider"><span style={{ color: "#C8973A" }}>✦</span></div>
            </div>
            <div className="space-y-6">
              <div className="folk-card rounded-sm p-8" style={{ background: "rgba(255,255,255,0.03)" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>Миссия</h3>
                <p className="leading-relaxed" style={{ color: "#C4B896" }}>
                  Народное наследие — мировой цифровой атлас традиционной культуры. Любой человек может
                  загрузить рисунок, поделку или аппликацию, связанную с народными традициями любой
                  страны мира. Работы появляются на карте после проверки модератором.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "Globe", num: "195", label: "Стран на карте", color: "#1A3A6B" },
                  { icon: "Shirt", num: "198", label: "Костюмов", color: "#8B1A1A" },
                  { icon: "Layers", num: "545", label: "Орнаментов", color: "#C8973A" },
                ].map(item => (
                  <div key={item.label} className="folk-card rounded-sm p-6 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${item.color}30`, border: `1px solid ${item.color}50` }}>
                      <Icon name={item.icon} size={20} style={{ color: item.color }} />
                    </div>
                    <div className="text-3xl font-bold mb-1 gold-shimmer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.num}</div>
                    <div className="text-sm" style={{ color: "#8A7A60" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 text-center" style={{ color: "#8A7A60" }}>
        <div className="text-2xl mb-2" style={{ color: "#C8973A" }}>✦ ✦ ✦</div>
        <p className="text-sm">Народное наследие · Мировой атлас традиционной культуры</p>
      </footer>

      {/* Work detail modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,4,2,0.94)" }}
          onClick={() => setSelectedWork(null)}>
          <div className="rounded-sm max-w-lg w-full overflow-hidden"
            style={{ background: "#14100A", border: "1px solid rgba(200,151,58,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <img src={selectedWork.image_url} alt={selectedWork.title}
              className="w-full h-72 object-contain" style={{ background: "#0A0705" }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                    {selectedWork.title}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "#8A7A60" }}>
                    {selectedWork.author_name} · {CATEGORY_LABELS[selectedWork.category]} · {selectedWork.country_name}
                    {selectedWork.region_key && ` · ${RUSSIA_REGION_NAMES[selectedWork.region_key]}`}
                  </p>
                </div>
                <button onClick={() => setSelectedWork(null)} style={{ color: "#8A7A60" }}>
                  <Icon name="X" size={20} />
                </button>
              </div>
              {selectedWork.description && (
                <p className="leading-relaxed" style={{ color: "#C4B896" }}>{selectedWork.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,4,2,0.96)" }}
          onClick={() => setShowAdmin(false)}>
          <div className="rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "#14100A", border: "1px solid rgba(200,151,58,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b" style={{ borderColor: "rgba(200,151,58,0.12)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F0D070" }}>
                  Модерация работ
                </h3>
                <button onClick={() => setShowAdmin(false)} style={{ color: "#8A7A60" }}>
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="flex gap-2">
                <input type="password" value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Пароль администратора"
                  className="flex-1 px-3 py-2 rounded-sm text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,151,58,0.2)", color: "#F0E6CC" }}
                  onKeyDown={e => e.key === "Enter" && fetchAdminWorks()} />
                <button onClick={fetchAdminWorks} disabled={adminLoading}
                  className="px-4 py-2 rounded-sm text-sm font-medium"
                  style={{ background: "linear-gradient(135deg, #8B1A1A, #6B1010)", color: "#F0D070" }}>
                  {adminLoading ? "..." : "Войти"}
                </button>
              </div>
              {adminError && <p className="text-xs mt-2" style={{ color: "#FF7070" }}>{adminError}</p>}
            </div>
            <div className="p-6 space-y-4">
              {adminWorks.length === 0 && !adminLoading && (
                <div className="text-center py-8" style={{ color: "#8A7A60" }}>
                  <div className="text-3xl mb-2">✦</div>
                  <p>Работ на проверке нет</p>
                </div>
              )}
              {adminWorks.map(w => (
                <div key={w.id} className="flex gap-4 rounded-sm p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,151,58,0.1)" }}>
                  <img src={w.image_url} alt={w.title} className="w-24 h-24 object-cover rounded-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ color: "#F0D070", fontFamily: "'Cormorant Garamond', serif" }}>{w.title}</p>
                    <p className="text-xs" style={{ color: "#8A7A60" }}>
                      {w.author_name} · {CATEGORY_LABELS[w.category]} · {w.country_name}
                      {w.region_key && ` · ${RUSSIA_REGION_NAMES[w.region_key]}`}
                    </p>
                    {w.description && <p className="text-sm mt-1 line-clamp-2" style={{ color: "#C4B896" }}>{w.description}</p>}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => handleModerate(w.id, "approve")}
                      className="px-3 py-1.5 rounded-sm text-xs font-medium"
                      style={{ background: "rgba(45,90,39,0.4)", color: "#90D070", border: "1px solid rgba(90,180,70,0.3)" }}>
                      ✓ Одобрить
                    </button>
                    <button onClick={() => handleModerate(w.id, "reject")}
                      className="px-3 py-1.5 rounded-sm text-xs font-medium"
                      style={{ background: "rgba(139,26,26,0.4)", color: "#FF9090", border: "1px solid rgba(200,80,80,0.3)" }}>
                      ✗ Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
