import { useState, useEffect, useCallback } from "react";
import { Shell } from "./components/Shell";

interface Language {
  code: string;
  name: string;
  greeting: string;
  subtext: string;
  flag: string;
  direction?: "rtl" | "ltr";
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", greeting: "Hello!", subtext: "Welcome, friend", flag: "🇬🇧" },
  { code: "es", name: "Spanish", greeting: "¡Hola!", subtext: "Bienvenido, amigo", flag: "🇪🇸" },
  { code: "fr", name: "French", greeting: "Bonjour!", subtext: "Bienvenue, ami", flag: "🇫🇷" },
  { code: "de", name: "German", greeting: "Hallo!", subtext: "Willkommen, Freund", flag: "🇩🇪" },
  { code: "it", name: "Italian", greeting: "Ciao!", subtext: "Benvenuto, amico", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", greeting: "Olá!", subtext: "Bem-vindo, amigo", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", greeting: "こんにちは！", subtext: "ようこそ、友よ", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", greeting: "你好！", subtext: "欢迎，朋友", flag: "🇨🇳" },
  { code: "ko", name: "Korean", greeting: "안녕하세요!", subtext: "환영합니다, 친구여", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", greeting: "مرحباً!", subtext: "أهلاً وسهلاً، صديقي", flag: "🇸🇦", direction: "rtl" },
  { code: "hi", name: "Hindi", greeting: "नमस्ते!", subtext: "स्वागत है, दोस्त", flag: "🇮🇳" },
  { code: "ru", name: "Russian", greeting: "Привет!", subtext: "Добро пожаловать, друг", flag: "🇷🇺" },
  { code: "nl", name: "Dutch", greeting: "Hallo!", subtext: "Welkom, vriend", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", greeting: "Hej!", subtext: "Välkommen, vän", flag: "🇸🇪" },
  { code: "pl", name: "Polish", greeting: "Cześć!", subtext: "Witaj, przyjacielu", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", greeting: "Merhaba!", subtext: "Hoş geldin, arkadaş", flag: "🇹🇷" },
  { code: "el", name: "Greek", greeting: "Γεια σου!", subtext: "Καλώς ήρθες, φίλε", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", greeting: "שלום!", subtext: "ברוך הבא, חבר", flag: "🇮🇱", direction: "rtl" },
  { code: "th", name: "Thai", greeting: "สวัสดี!", subtext: "ยินดีต้อนรับ เพื่อน", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", greeting: "Halo!", subtext: "Selamat datang, teman", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", greeting: "Xin chào!", subtext: "Chào mừng bạn", flag: "🇻🇳" },
  { code: "uk", name: "Ukrainian", greeting: "Привіт!", subtext: "Ласкаво просимо, друже", flag: "🇺🇦" },
  { code: "cs", name: "Czech", greeting: "Ahoj!", subtext: "Vítej, příteli", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", greeting: "Bună!", subtext: "Bine ai venit, prieten", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", greeting: "Helló!", subtext: "Üdvözöllek, barátom", flag: "🇭🇺" },
  { code: "fi", name: "Finnish", greeting: "Hei!", subtext: "Tervetuloa, ystävä", flag: "🇫🇮" },
  { code: "da", name: "Danish", greeting: "Hej!", subtext: "Velkommen, ven", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", greeting: "Hei!", subtext: "Velkommen, venn", flag: "🇳🇴" },
  { code: "fa", name: "Persian", greeting: "سلام!", subtext: "خوش آمدی، دوست من", flag: "🇮🇷", direction: "rtl" },
  { code: "bn", name: "Bengali", greeting: "হ্যালো!", subtext: "স্বাগতম, বন্ধু", flag: "🇧🇩" },
  { code: "sw", name: "Swahili", greeting: "Habari!", subtext: "Karibu, rafiki", flag: "🇰🇪" },
  { code: "ms", name: "Malay", greeting: "Helo!", subtext: "Selamat datang, kawan", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", greeting: "Kamusta!", subtext: "Maligayang pagdating, kaibigan", flag: "🇵🇭" },
  { code: "la", name: "Latin", greeting: "Salve!", subtext: "Bene venisti, amice", flag: "🏛️" },
  { code: "eo", name: "Esperanto", greeting: "Saluton!", subtext: "Bonvenon, amiko", flag: "🌍" },
];

const ACCENT_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c",
  "#16a34a", "#0891b2", "#9333ea", "#dc2626",
  "#d97706", "#059669",
];

function getAccentForLang(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Language>(LANGUAGES[0]);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem("helloworld_name") || "");
  const [nameInput, setNameInput] = useState(() => localStorage.getItem("helloworld_name") || "");
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.greeting.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectLanguage = useCallback((lang: Language) => {
    setAnimating(true);
    setTimeout(() => {
      setSelected(lang);
      setAnimating(false);
    }, 200);
  }, []);

  // Auto-play cycling
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setAutoIndex((prev) => {
        const next = (prev + 1) % LANGUAGES.length;
        selectLanguage(LANGUAGES[next]);
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [autoPlay, selectLanguage]);

  const saveName = () => {
    setName(nameInput.trim());
    localStorage.setItem("helloworld_name", nameInput.trim());
  };

  const accent = getAccentForLang(selected.code);
  const displayName = name || null;

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        {/* Hero greeting card */}
        <div
          className="rounded-[1.25rem] p-8 md:p-12 mb-8 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300"
          style={{ background: `${accent}15`, border: `2px solid ${accent}30` }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: accent }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
            style={{ background: accent }}
          />

          <div
            className="text-6xl mb-4 transition-all duration-200"
            style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(-10px)" : "translateY(0)" }}
          >
            {selected.flag}
          </div>

          <div
            className="transition-all duration-200"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(-10px)" : "translateY(0)",
              direction: selected.direction || "ltr",
            }}
          >
            <h1
              className="text-5xl md:text-7xl font-bold mb-3"
              style={{ fontFamily: "Fraunces, serif", color: accent }}
            >
              {selected.greeting}
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: "var(--muted)" }}>
              {displayName ? (
                <>
                  {selected.direction === "rtl"
                    ? `${displayName} ،${selected.subtext.replace(/[,،].*/, "")}`
                    : `${selected.subtext.replace(/[,،].*/, "")}, ${displayName}`}
                </>
              ) : (
                selected.subtext
              )}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full"
              style={{ background: `${accent}20`, color: accent }}
            >
              {selected.name}
            </span>
            <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: "var(--panel)", color: "var(--muted)" }}>
              {selected.code.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Name input */}
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="flex-1 px-4 py-2 rounded-[0.75rem] border text-sm outline-none transition-all"
              style={{
                background: "var(--panel)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            />
            <button
              onClick={saveName}
              className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: accent, color: "#fff" }}
            >
              Set
            </button>
          </div>

          {/* Auto-play toggle */}
          <button
            onClick={() => setAutoPlay((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-[0.75rem] text-sm font-semibold border transition-all hover:opacity-80"
            style={{
              background: autoPlay ? accent : "var(--panel)",
              color: autoPlay ? "#fff" : "var(--ink)",
              borderColor: autoPlay ? accent : "var(--line)",
            }}
          >
            <span>{autoPlay ? "⏸" : "▶"}</span>
            <span>{autoPlay ? "Stop tour" : "Language tour"}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base" style={{ color: "var(--muted)" }}>🔍</span>
          <input
            type="text"
            placeholder={`Search ${LANGUAGES.length} languages…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-[0.75rem] border text-sm outline-none transition-all"
            style={{
              background: "var(--panel)",
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Language grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--muted)" }}>
            <div className="text-4xl mb-3">🌐</div>
            <p className="text-lg font-medium">No languages found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((lang) => {
              const isSelected = selected.code === lang.code;
              const langAccent = getAccentForLang(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => { setAutoPlay(false); selectLanguage(lang); }}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-[1.25rem] border text-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: isSelected ? `${langAccent}15` : "var(--panel)",
                    borderColor: isSelected ? langAccent : "var(--line)",
                    boxShadow: isSelected ? `0 0 0 2px ${langAccent}40` : "none",
                  }}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span
                    className="text-xs font-bold leading-tight"
                    style={{ color: isSelected ? langAccent : "var(--ink)" }}
                  >
                    {lang.greeting}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {lang.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
          {LANGUAGES.length} languages · Click any card to hear a greeting
        </p>
      </div>
    </Shell>
  );
}
