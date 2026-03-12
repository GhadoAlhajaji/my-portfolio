"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  FileText,
  Search,
  Cpu,
  Lightbulb,
  Brain,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Check,
  Award,
  BookOpen,
  Sparkles,
  Mic2,
  Terminal,
  Server,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  X,
  Lock,
  Globe,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24, scale: 0.95, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const scrollReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const viewport = { once: true, amount: 0.1 };
const springTransition = { type: "spring" as const, stiffness: 400, damping: 22 };

const TYPED_PHRASES = [
  "I'm Saudi.",
  "I'm a Blue Teamer.",
  "I'm a passionate learner.",
  "I'm a SOC Analyst.",
];

// ─── Hexagon grid background ───────────────────────────────────────────────
function HexGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon
            points="28,4 52,16 52,40 28,52 4,40 4,16"
            fill="none"
            stroke="rgba(168,85,247,1)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

// ─── Animated scan line ────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute" }}
    />
  );
}

// ─── Stat badge ────────────────────────────────────────────────────────────
function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-purple-500/20 bg-[#16052e]/40 px-5 py-3 backdrop-blur-sm">
      <span className="font-mono text-xl font-bold text-purple-300">{value}</span>
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">{label}</span>
    </div>
  );
}

export default function Home() {
  const [displayedText, setDisplayedText] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<{ src: string; alt: string } | null>(null);
  const phraseIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  // ── Typing effect ──
  useEffect(() => {
    const TYPING_MS = 85;
    const DELETING_MS = 45;
    const PAUSE_AT_END_MS = 900;
    const phrase = TYPED_PHRASES[phraseIndexRef.current];

    if (isDeletingRef.current) {
      if (displayedText === "") {
        phraseIndexRef.current = (phraseIndexRef.current + 1) % TYPED_PHRASES.length;
        isDeletingRef.current = false;
        const nextPhrase = TYPED_PHRASES[phraseIndexRef.current];
        const t = setTimeout(() => setDisplayedText(nextPhrase[0] ?? ""), TYPING_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setDisplayedText((prev) => prev.slice(0, -1)), DELETING_MS);
      return () => clearTimeout(t);
    }
    if (displayedText.length === phrase.length && displayedText !== "") {
      const t = setTimeout(() => { isDeletingRef.current = true; setDisplayedText((prev) => prev.slice(0, -1)); }, PAUSE_AT_END_MS);
      return () => clearTimeout(t);
    }
    if (displayedText.length < phrase.length) {
      const t = setTimeout(() => setDisplayedText(TYPED_PHRASES[phraseIndexRef.current].slice(0, displayedText.length + 1)), TYPING_MS);
      return () => clearTimeout(t);
    }
    if (displayedText === "" && phrase) {
      const t = setTimeout(() => setDisplayedText(phrase[0]), TYPING_MS);
      return () => clearTimeout(t);
    }
  }, [displayedText]);

  // ── Code rain canvas ──
  useEffect(() => {
    const canvas = document.getElementById("code-rain-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    const characters = "01".split("");
    const fontSize = 14;
    let columns = 0;
    let columnWidth = fontSize / 2;
    let drops: number[] = [];
    let depthFactors: number[] = [];
    let maxNegative = 20;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columnWidth = fontSize / 2;
      columns = Math.floor(canvas.width / columnWidth);
      maxNegative = canvas.height / fontSize;
      drops = Array.from({ length: columns }, () => -Math.random() * maxNegative);
      depthFactors = Array.from({ length: columns }, () => 0.4 + Math.random() * 0.9);
    };

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const x = i * columnWidth;
        const y = drops[i] * fontSize;
        const t = (y / canvas.height) % 1;
        const r = Math.round(34 + (168 - 34) * t);
        const g = Math.round(197 + (85 - 197) * t);
        const b = Math.round(94 + (247 - 94) * t);
        const baseAlpha = 0.03 + 0.12 * t;
        const alpha = baseAlpha * (depthFactors[i] ?? 1);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.997) { drops[i] = -Math.random() * maxNegative; }
        else { drops[i] += 0.2; }
      }
      animationFrameId = window.requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => { window.removeEventListener("resize", init); window.cancelAnimationFrame(animationFrameId); };
  }, []);

  useEffect(() => {
    if (!activeCertificate) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveCertificate(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeCertificate]);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 20) setHasScrolled(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const technicalSkills = [
    { title: "SOC Operations", subtitle: "Monitor, detect, and respond to threats in real time.", Icon: Shield },
    { title: "GRC & Compliance", subtitle: "Align security controls with policies and regulations.", Icon: FileText },
    { title: "Digital Forensics", subtitle: "Investigate incidents and analyze digital evidence.", Icon: Search },
    { title: "AI Security", subtitle: "Secure ML systems and defend against adversarial attacks.", Icon: Cpu },
  ];

  const softSkills = [
    { title: "Problem Solving", subtitle: "Break down complex security challenges systematically.", Icon: Lightbulb },
    { title: "Critical Thinking", subtitle: "Evaluate risks and evidence with a structured approach.", Icon: Brain },
    { title: "Analytical Mindset", subtitle: "Turn data and logs into actionable security insights.", Icon: BarChart3 },
    { title: "Effective Communication", subtitle: "Share findings clearly with technical and non-technical stakeholders.", Icon: MessageSquare },
  ];

  const accomplishments = [
    { id: "kaust-3", date: "Feb 2026", title: "KAUST Cybersecurity Training – Stage 3", org: "KAUST × National Cybersecurity Authority (NCA)", description: "Advanced to the elite third stage of the NCA‑partnered program, focusing on advanced threat hunting and complex incident response simulations.", tag: "ELITE TRAINING", icon: Terminal, accent: "hover:border-cyan-300/90 hover:bg-cyan-500/10 hover:shadow-[0_0_34px_rgba(34,211,238,0.8)]", highlight: true },
    { id: "ssds-committee", date: "Sep 2025 – Present", title: "Consulting Committee Member", org: "Saudi Society for Data Science (SSDS)", description: "Member of the Consulting Committee contributing to data science and AI initiatives with a cybersecurity lens.", tag: "Leadership", icon: Sparkles, accent: "hover:border-emerald-400/70 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(16,185,129,0.45)]" },
    { id: "kaust-2", date: "Feb 2025", title: "KAUST Cybersecurity Training – Stage 2", org: "KAUST × National Cybersecurity Authority (NCA)", description: "Successfully completed Stage 2, mastering 40+ hours of hands‑on labs in network security and secure infrastructure.", tag: "INTERMEDIATE BOOTCAMP", icon: Terminal, accent: "hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:shadow-[0_0_26px_rgba(34,211,238,0.55)]", highlight: true },
    { id: "bsf-award", date: "Jan 2024 – Dec 2025", title: "Professional Supervision Initiative Award (UQU × BSF)", org: "Umm Al-Qura University × Banque Saudi Fransi", description: "A prestigious 2-year leadership and professional development program. Honored as one of only 8 students selected from a pool of 300 for exceptional leadership and innovative problem-solving.", tag: "ACHIEVEMENT", icon: Award, accent: "hover:border-amber-400/70 hover:bg-amber-400/5 hover:shadow-[0_0_28px_rgba(251,191,36,0.65)]" },
    { id: "web-attacks-workshop", date: "Dec 2024", title: "Advanced Web Attacks Workshop", org: "Cyber Guard Club", description: "Delivered a live workshop covering XSS, SQL injection, and authentication bypass techniques with secure coding countermeasures.", tag: "Speaking", icon: Mic2, accent: "hover:border-pink-400/80 hover:bg-pink-500/10 hover:shadow-[0_0_26px_rgba(244,114,182,0.55)]" },
    { id: "ejpt-speaker", date: "Nov 2024", title: "eJPT Certification Speaker", org: "Umm Al-Qura University", description: "Guided students through entry‑level penetration testing certifications, exam strategy, and career paths.", tag: "Mentorship", icon: Mic2, accent: "hover:border-indigo-400/80 hover:bg-indigo-500/10 hover:shadow-[0_0_24px_rgba(129,140,248,0.5)]" },
    { id: "digital-safety-shield", date: "Aug 2024", title: "Digital Safety Shield – Cybersecurity Awareness", org: "Yusr Association", description: "Designed and executed the Encryption & Privacy booth to teach families safe digital habits and secure communication.", tag: "Volunteering", icon: Shield, accent: "hover:border-purple-400/80 hover:bg-purple-500/10 hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]" },
    { id: "specialties-forum", date: "Jun 2024", title: "Specialties Forum Speaker", org: "Umm Al-Qura University", description: "Represented the Cybersecurity Department, introducing new students to the field, its paths, and required skills.", tag: "Speaking", icon: Mic2, accent: "hover:border-pink-400/80 hover:bg-pink-500/10 hover:shadow-[0_0_26px_rgba(244,114,182,0.55)]" },
    { id: "nca-academy", date: "Early 2024", title: "National Cybersecurity Academy", org: "SITE & National Cybersecurity Authority", description: "Immersive training covering SOC operations, Network+, Security+, and threat simulation in realistic lab environments.", tag: "Bootcamps", icon: Terminal, accent: "hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:shadow-[0_0_26px_rgba(34,211,238,0.55)]" },
    { id: "awareness-show", date: "2023", title: "Cybersecurity Awareness Show Member", org: "Umm Al-Qura University", description: "Helped spread security culture through interactive shows and demonstrations for the university community.", tag: "Volunteering", icon: Shield, accent: "hover:border-purple-400/80 hover:bg-purple-500/10 hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]" },
    { id: "ux-workshop", date: "Workshop", title: "UX Design Principles", org: "Design & Security Focus", description: "Explored user experience design fundamentals to build secure interfaces that are intuitive and human‑centric.", tag: "Workshop", icon: BookOpen, accent: "hover:border-amber-400/80 hover:bg-amber-500/10 hover:shadow-[0_0_24px_rgba(251,191,36,0.55)]" },
  ];

  return (
    <div className="relative min-h-screen font-sans text-zinc-100">
      <canvas id="code-rain-canvas" className="pointer-events-none fixed inset-0 -z-10" />

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex w-full max-w-3xl items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.3)] bg-[rgba(10,5,15,0.85)] px-5 py-2.5 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-[16px] sm:rounded-full sm:px-8 sm:py-3">
          <nav className="nav-links-scroll flex items-center gap-x-2 overflow-x-auto whitespace-nowrap sm:gap-x-6 sm:overflow-visible sm:whitespace-normal sm:justify-center">
            {[
              { label: "ABOUT", href: "#about" },
              { label: "EDUCATION", href: "#education" },
              { label: "CERTIFICATIONS", href: "#certifications" },
              { label: "EXPERIENCE", href: "#experience" },
              { label: "PROJECTS", href: "#projects" },
              { label: "BLOG", href: "https://medium.com/@ghadohajaji", external: true },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className="nav-link px-3 py-2 text-[0.7rem] font-mono font-medium uppercase tracking-[0.22em] text-zinc-300 transition-colors hover:text-purple-300 sm:px-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto mt-20 flex max-w-5xl flex-col gap-16 px-4 py-10 font-sans sm:mt-24 sm:px-6 sm:py-16">

        {/* ── HERO ── */}
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-6 overflow-hidden border-b border-zinc-900 pb-16 text-center">
          {/* Decorative layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <HexGrid />
            <ScanLine />
            {/* Corner brackets */}
            <div className="absolute top-6 left-6 h-8 w-8 border-l-2 border-t-2 border-purple-500/30" />
            <div className="absolute top-6 right-6 h-8 w-8 border-r-2 border-t-2 border-purple-500/30" />
            <div className="absolute bottom-16 left-6 h-8 w-8 border-l-2 border-b-2 border-purple-500/30" />
            <div className="absolute bottom-16 right-6 h-8 w-8 border-r-2 border-b-2 border-purple-500/30" />
          </div>

          <motion.div
            className="relative z-10 space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } }, hidden: {} }}
          >
            {/* Availability badge */}
            <motion.div className="flex justify-center" variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <span className="text-white">Hello, I&apos;m </span>
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-700 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.45)] transition-all duration-300 cursor-default hover:drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
                Ghada Alhajajji
              </span>
            </motion.h1>

            <motion.p className="font-mono text-sm text-zinc-400" variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              Cybersecurity Analyst · SOC &amp; GRC Analyst · AI Security Researcher
            </motion.p>

            <motion.div className="min-h-[2.5rem] font-mono text-base text-zinc-400 sm:text-lg" variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <span className="text-purple-500/80">~$ </span>
              <span>{displayedText}</span>
              <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-purple-500 align-middle sm:h-6" />
            </motion.div>

            {/* Stats row */}
            <motion.div className="flex flex-wrap items-center justify-center gap-3 pt-2" variants={fadeInUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <StatBadge value="3.8" label="GPA" />
              <StatBadge value="2+" label="Certifications" />
              <StatBadge value="4+" label="Projects" />
              <StatBadge value="10+" label="Events" />
            </motion.div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            {[
              { label: "About me", href: "#about" },
              { label: "Get In Touch", href: "#connect" },
              { label: "Blog", href: "https://medium.com/@ghadohajaji" },
            ].map((btn) => (
              <motion.a
                key={btn.label}
                href={btn.href}
                className="inline-flex items-center justify-center rounded-xl border border-purple-500/60 bg-black/60 px-7 py-2.5 text-sm font-semibold normal-case tracking-wide text-purple-100 shadow-[0_0_14px_rgba(147,51,234,0.6)] backdrop-blur-md transition hover:border-purple-400 hover:bg-[#1a032c] hover:shadow-[0_0_26px_rgba(168,85,247,0.95)]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={(e) => { if (btn.href.startsWith("#")) { e.preventDefault(); scrollToSection(btn.href); } }}
              >
                {btn.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          {!hasScrolled && (
            <motion.div
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-purple-400/80">SCROLL</span>
                <div className="h-7 w-px bg-gradient-to-b from-purple-500/70 via-purple-400/40 to-transparent" />
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* ── Content ── */}
        <section className="flex-1 space-y-10 lg:space-y-14">

          {/* ── About ── */}
          <motion.section id="about" className="scroll-mt-24 space-y-8" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            <div className="mx-auto max-w-4xl space-y-8 text-left">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 01. About Me /&gt;</h2>
              <p className="font-sans text-base leading-relaxed text-zinc-300 sm:leading-loose sm:text-[1.05rem]">
                Motivated Cybersecurity Analyst with hands-on experience in GRC foundations and Security Operations Center (SOC) activities. I am a passionate professional skilled in network security, encryption, and incident analysis. My mission is to secure resilient digital environments through policy development, risk coordination, and emerging AI security research. I am committed to advancing organizational cybersecurity maturity with a strong foundation in threat detection and secure coding.
              </p>

              {/* Technical Skills */}
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/70">// Technical Skills</p>
                <motion.div
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                  initial="hidden" whileInView="visible" viewport={viewport}
                >
                  {technicalSkills.map(({ title, subtitle, Icon }) => (
                    <motion.div
                      key={title}
                      className="group flex flex-col items-start rounded-xl border border-cyan-500/20 bg-[#041018]/60 p-4 text-left backdrop-blur-sm transition hover:border-cyan-400/60 hover:bg-[#041018]/80 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
                      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } } }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      transition={springTransition}
                    >
                      <div className="mb-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                        <Icon className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-400/70">// Soft Skills</p>
                <motion.div
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                  initial="hidden" whileInView="visible" viewport={viewport}
                >
                  {softSkills.map(({ title, subtitle, Icon }) => (
                    <motion.div
                      key={title}
                      className="group flex flex-col items-start rounded-xl border border-purple-500/20 bg-[#16052e]/40 p-4 text-left backdrop-blur-sm transition hover:border-purple-400/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.2)]"
                      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } } }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      transition={springTransition}
                    >
                      <div className="mb-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                        <Icon className="h-5 w-5 text-purple-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* ── Education ── */}
          <motion.section id="education" className="scroll-mt-24 mt-24 space-y-5" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 02. Education /&gt;</h2>
            </div>
            <div className="mx-auto max-w-4xl rounded-2xl border border-purple-500/25 bg-[#16052e]/40 p-6 shadow-[0_0_30px_rgba(126,34,206,0.1)] backdrop-blur-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 shadow-[0_0_14px_rgba(168,85,247,0.4)]">
                    <BookOpen className="h-6 w-6 text-purple-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-zinc-100">B.Sc. Cybersecurity</p>
                    <p className="mt-0.5 text-sm text-cyan-400/90">Umm Al-Qura University</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[0.7rem] text-cyan-300">
                    <CheckCircle className="h-3.5 w-3.5" strokeWidth={2} /> Candidate for First-Class Honors
                  </span>
                  <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-200">3.8 / 4.0 GPA</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-purple-500/20 pt-4">
                <span className="font-mono text-xs text-zinc-500">Expected graduation</span>
                <motion.span className="font-mono text-sm font-semibold text-cyan-300" animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                  June 2026
                </motion.span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Focus on network security, digital forensics, GRC foundations, and secure software design. Coursework and projects in incident response, cryptography, and AI security.
              </p>
            </div>
          </motion.section>

          {/* ── Certifications ── */}
          <motion.section id="certifications" className="scroll-mt-24 mt-24 space-y-5" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 03. Professional Certifications /&gt;</h2>
            </div>
            <motion.div
              className="mx-auto max-w-4xl grid grid-cols-1 gap-4 sm:grid-cols-2"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, ease: "easeOut" } } }}
              initial="hidden" whileInView="visible" viewport={viewport}
            >
              {/* CySA+ */}
              <motion.article className="group flex flex-col rounded-xl border border-purple-500/70 bg-[#090014]/80 p-4 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md transition hover:shadow-[0_0_32px_rgba(168,85,247,0.8)]" variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}>
                <button type="button" onClick={() => setActiveCertificate({ src: "/cysa-cert.png", alt: "CompTIA CySA+ Certificate" })} className="mb-3 block w-full overflow-hidden rounded-lg border border-purple-500/70 bg-black/40 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <div className="relative">
                    <img src="/cysa-cert.png" alt="CompTIA CySA+ Certificate" className="h-32 w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] font-medium text-purple-100"><Search className="h-4 w-4" strokeWidth={1.7} /> View Certificate</span>
                    </div>
                  </div>
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.7)]"><Award className="h-5 w-5" strokeWidth={1.8} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">CompTIA CySA+ (Cybersecurity Analyst)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">CompTIA · Verified Certification</p>
                    <p className="mt-1 font-mono text-[0.7rem] text-zinc-400">Issued: Jun 2025 · Expires: Jun 2028</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">Validates hands-on skills in incident response, threat management, security monitoring, and tuning defenses in real-world SOC environments.</p>
                <button type="button" onClick={() => setActiveCertificate({ src: "/cysa-cert.png", alt: "CompTIA CySA+ Certificate" })} className="mt-3 inline-flex items-center gap-1 rounded-full border border-purple-500/60 bg-black/40 px-3 py-1 text-[0.7rem] font-medium text-purple-100 transition hover:bg-purple-600/20">
                  <Search className="h-3.5 w-3.5" strokeWidth={1.7} /> View Certificate
                </button>
              </motion.article>

              {/* eJPT */}
              <motion.article className="group flex flex-col rounded-xl border border-purple-500/70 bg-[#090014]/80 p-4 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md transition hover:shadow-[0_0_32px_rgba(168,85,247,0.8)]" variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}>
                <button type="button" onClick={() => setActiveCertificate({ src: "/ejpt-cert.png", alt: "eJPT Certificate" })} className="mb-3 block w-full overflow-hidden rounded-lg border border-purple-500/70 bg-black/40 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <div className="relative">
                    <img src="/ejpt-cert.png" alt="eJPT Certificate" className="h-32 w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] font-medium text-purple-100"><Search className="h-4 w-4" strokeWidth={1.7} /> View Certificate</span>
                    </div>
                  </div>
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.7)]"><Award className="h-5 w-5" strokeWidth={1.8} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">eJPT (Junior Penetration Tester)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">INE · Verified Certification</p>
                    <p className="mt-1 font-mono text-[0.7rem] text-zinc-400">Issued: Sep 2025</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">Demonstrates practical penetration testing skills in network analysis, vulnerability assessment, exploitation, and reporting in lab-style environments.</p>
                <button type="button" onClick={() => setActiveCertificate({ src: "/ejpt-cert.png", alt: "eJPT Certificate" })} className="mt-3 inline-flex items-center gap-1 rounded-full border border-purple-500/60 bg-black/40 px-3 py-1 text-[0.7rem] font-medium text-purple-100 transition hover:bg-purple-600/20">
                  <Search className="h-3.5 w-3.5" strokeWidth={1.7} /> View Certificate
                </button>
              </motion.article>

              {/* ECDFP */}
              <motion.article className="group flex flex-col rounded-xl border border-purple-500/40 bg-[#050011]/80 p-4 opacity-85 backdrop-blur-md transition hover:border-purple-400 hover:opacity-100 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)]" variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}>
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]"><CheckCircle className="h-5 w-5" strokeWidth={1.6} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">ECDFP – Digital Forensics Professional</p>
                    <p className="mt-0.5 text-xs text-zinc-500">EC-Council · In Progress</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-purple-200">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" /> Coming Soon
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">Advanced training path focused on disk, memory, and network forensics, evidence handling, and investigation workflows.</p>
              </motion.article>

              {/* ICCA */}
              <motion.article className="group flex flex-col rounded-xl border border-purple-500/40 bg-[#050011]/80 p-4 opacity-85 backdrop-blur-md transition hover:border-purple-400 hover:opacity-100 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)]" variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}>
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]"><CheckCircle className="h-5 w-5" strokeWidth={1.6} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">INE Certified Cloud Associate (ICCA)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">INE · In Progress</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-purple-200">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" /> In Development
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">Cloud fundamentals track covering secure architectures, identity, and monitoring across modern cloud platforms.</p>
              </motion.article>
            </motion.div>
          </motion.section>

          {/* ── Experience ── */}
          <motion.section id="experience" className="scroll-mt-24 mt-24 space-y-5" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 04. Professional Experience /&gt;</h2>
            </div>
            <motion.article
              className="experience-card mx-auto max-w-4xl rounded-2xl border border-purple-500/50 bg-[#16052e]/50 p-8 backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(168,85,247,0.65)]"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 shadow-[0_0_14px_rgba(168,85,247,0.4)]">
                    <Shield className="h-6 w-6 text-purple-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Cybersecurity Cooperative Trainee – GRC Focus</h3>
                    <p className="mt-1 text-sm text-cyan-400/90">General Syndicate of Cars</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">February 2025 — August 2025 · Saudi Arabia</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-purple-300/90">[ CO-OP INTERN ]</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">Played a key role in establishing the foundational cybersecurity governance and policy frameworks for a newly formed department, aligning GRC processes with long-term security goals.</p>
              <ul className="space-y-4 text-sm leading-relaxed">
                {[
                  { label: "Framework Development", text: "Proposed and implemented structured policy measurement and compliance assessment mechanisms, significantly improving audit readiness." },
                  { label: "Governance Workflows", text: "Assisted in designing scalable governance workflows to support sustainable cybersecurity maturity and future expansion." },
                  { label: "Risk Management", text: "Supported early-stage risk documentation and control mapping, strengthening the organizational baseline security posture." },
                  { label: "Stakeholder Alignment", text: "Coordinated between key stakeholders to align security governance initiatives and ensure compliance tracking." },
                ].map(({ label, text }) => (
                  <li key={label} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]"><Check className="h-4 w-4" strokeWidth={2.5} /></span>
                    <span><strong className="font-semibold text-zinc-100">{label}:</strong> <span className="text-purple-200/80">{text}</span></span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </motion.section>

          {/* ── Accomplishments ── */}
          <motion.section id="accomplishments" className="scroll-mt-24 mt-24 space-y-5" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 05. Courses &amp; Accomplishments /&gt;</h2>
            </div>
            <div className="mx-auto max-w-4xl py-16 sm:py-20">
              <div className="relative pb-2 pt-1">
                <div className="pointer-events-none absolute inset-y-0 left-4 w-px bg-gradient-to-b from-purple-400 via-cyan-400 to-zinc-700 shadow-[0_0_18px_rgba(56,189,248,0.75)] md:left-1/2 md:-translate-x-1/2" aria-hidden />
                <div className="space-y-7 sm:space-y-8">
                  {accomplishments.map((item, index) => {
                    const { id, date, title, org, description, tag, icon: Icon, accent } = item;
                    const isLeft = index % 2 === 0;
                    return (
                      <motion.article key={id} variants={{ hidden: { opacity: 0, y: 18, x: isLeft ? -28 : 28 }, visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.45, ease: "easeOut" } } }}>
                        <div className="relative">
                          <div className="absolute left-4 top-4 md:left-1/2 md:-translate-x-1/2">
                            <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(8,47,73,0.9)]" />
                          </div>
                          <div className={`relative ${index === 0 ? "mt-10" : "mt-8"} w-full pl-10 pr-3 sm:pr-4 md:w-1/2 md:pl-0 md:pr-0 ${isLeft ? "md:pr-10 md:mr-auto" : "md:pl-10 md:ml-auto"}`}>
                            <div className={`group relative rounded-2xl border border-zinc-800/80 bg-[#0b0616]/80 p-4 sm:p-5 backdrop-blur-md transition-colors duration-300 ${"highlight" in item && item.highlight ? "border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : ""} ${accent}`}>
                              <span className={`pointer-events-none absolute top-6 hidden h-3 w-3 rotate-45 bg-[#0b0616] md:inline-block ${isLeft ? "-right-1.5" : "-left-1.5"}`} aria-hidden />
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">{date}</p>
                                  <h3 className="mt-1 text-sm font-semibold text-zinc-100 sm:text-base">{title}</h3>
                                  <p className="text-xs text-cyan-300/90">{org}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-900/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-300">
                                  <Icon className="h-3.5 w-3.5 text-cyan-300" strokeWidth={1.7} /> {tag}
                                </span>
                              </div>
                              <p className="mt-3 text-xs leading-relaxed text-zinc-300/90">{description}</p>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Projects ── */}
          <motion.section id="projects" className="scroll-mt-24 mt-24 space-y-6" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 06. Featured Projects /&gt;</h2>
            </div>
            <motion.div
              className="mx-auto max-w-4xl space-y-4"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, ease: "easeOut" } } }}
              initial="hidden" whileInView="visible" viewport={viewport}
            >
              {/* Featured – full width */}
              <motion.article
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#041018]/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md transition hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] sm:flex-row sm:gap-6"
                variants={{ hidden: { opacity: 0, y: 18, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}
              >
                <span className="absolute right-4 top-4 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cyan-300">Featured</span>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <Lock className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">Cryptography</p>
                    <h3 className="mt-0.5 text-base font-semibold text-zinc-100">Cryptographic Algorithm Design</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Java", "Cryptography", "Modular Arithmetic", "Security Analysis"].map((tag) => (
                      <span key={tag} className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[0.65rem] font-medium text-cyan-200">{tag}</span>
                    ))}
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-zinc-300">
                    <li>Designed a custom block-based encryption algorithm from first principles.</li>
                    <li>Analyzed key space, brute‑force resistance, and side‑channel exposure.</li>
                    <li>Built an interactive web interface to visualize encryption and decryption flows.</li>
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href="https://jix17345.github.io/Simple-crypto-web/cipher" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-1.5 text-[0.7rem] font-medium text-cyan-200 transition hover:bg-cyan-500/20">
                      <Globe className="h-3.5 w-3.5" /> Live Demo
                    </a>
                    <a href="/crypto-design-report.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/70 px-4 py-1.5 text-[0.7rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200">
                      <FileText className="h-3.5 w-3.5" /> PDF Report
                    </a>
                  </div>
                </div>
              </motion.article>

              {/* 3-column grid */}
              <div className="grid gap-4 text-sm md:grid-cols-3">
                {[
                  {
                    category: "Offensive Security", title: "Exploit Development & Memory Corruption", icon: Terminal,
                    tags: ["C", "Python", "GDB", "Buffer Overflow", "Linux Security"],
                    bullets: ["Developed vulnerable C binaries to demonstrate stack/heap overflows.", "Wrote Python exploit scripts to automate memory corruption.", "Evaluated mitigations: Stack Canaries, ASLR, and NX."],
                    links: [{ label: "PDF Report", href: "/exploit-dev-report.pdf", icon: FileText }],
                  },
                  {
                    category: "Web Security", title: "Secure Web App – Threat Analysis & Mitigation", icon: Shield,
                    tags: ["PHP", "SQL", "STRIDE/DREAD", "Web Security"],
                    bullets: ["Built a secure learning platform for cybersecurity students.", "Performed STRIDE threat modeling and DREAD risk scoring.", "Implemented CSRF defenses and bcrypt-based password hashing."],
                    links: [{ label: "Live Demo", href: "https://secureapp.free.nf/login.php?i=1", icon: Globe }, { label: "PDF Report", href: "/secure-web-analysis.pdf", icon: FileText }],
                  },
                  {
                    category: "Network Security", title: "Secure Network Infrastructure & Traffic Analysis", icon: Server,
                    tags: ["Linux Admin", "Wireshark", "UFW Firewall", "SSH Security"],
                    bullets: ["Architected a secure virtual lab with Ubuntu nodes.", "Hardened SSH configuration with UFW least-privilege rules.", "Deep packet inspection via Wireshark on TCP, ICMP, SSH flows."],
                    links: [{ label: "Lab Report", href: "/network-security-lab.pdf", icon: FileText }],
                  },
                ].map(({ category, title, icon: Icon, tags, bullets, links }) => (
                  <motion.article
                    key={title}
                    className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b0616]/80 p-4 backdrop-blur-md transition hover:border-cyan-400/50 hover:shadow-[0_0_26px_rgba(34,211,238,0.18)]"
                    variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } } }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">{category}</p>
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag) => (<span key={tag} className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-1.5 py-0.5 text-[0.6rem] font-medium text-cyan-200">{tag}</span>))}
                    </div>
                    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-zinc-300 flex-1">
                      {bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {links.map(({ label, href, icon: LIcon }) => (
                        <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900/70 px-2 py-1.5 text-[0.65rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200">
                          <LIcon className="h-3 w-3" /> {label}
                        </a>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* ── Connect ── */}
          <motion.section id="connect" className="scroll-mt-24 mt-24 space-y-4 pb-4" initial="hidden" whileInView="visible" viewport={viewport} variants={scrollReveal} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">&lt; 07. Get In Touch /&gt;</h2>
            </div>
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl border border-purple-700/40 bg-[#100020]/80 px-6 py-8 backdrop-blur-md">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Open to new opportunities
                </span>
                <p className="text-xs text-zinc-400">Quick ways to reach me and follow my work.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-7">
                {[
                  { href: "mailto:ghalhajaji@gmail.com", label: "Email", Icon: Mail },
                  { href: "https://www.linkedin.com/in/ghada-al-hajaji", label: "LinkedIn", Icon: Linkedin, external: true },
                  { href: "https://github.com/GhadoAlhajaji", label: "GitHub", Icon: Github, external: true },
                  { href: "https://medium.com/@ghadohajaji", label: "Blog", Icon: ExternalLink, external: true },
                ].map(({ href, label, Icon, external }) => (
                  <a key={label} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="group flex flex-col items-center gap-2">
                    <motion.span
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/70 bg-purple-500/10 text-purple-100 shadow-[0_0_16px_rgba(168,85,247,0.5)] transition"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={springTransition}
                    >
                      <Icon size={30} strokeWidth={1.7} />
                    </motion.span>
                    <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.section>
        </section>
      </main>

      {/* ── Certificate lightbox ── */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl" onClick={() => setActiveCertificate(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} transition={{ duration: 0.25, type: "spring", stiffness: 260, damping: 24 }} className="relative mx-4 w-full max-w-3xl rounded-2xl border border-purple-500/60 bg-black/90 p-3 shadow-[0_0_40px_rgba(168,85,247,0.8)]" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label="Close" onClick={() => setActiveCertificate(null)} className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/60 bg-black/70 text-zinc-200 transition hover:bg-purple-500/25 hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <div className="mt-6 flex justify-center">
                <img src={activeCertificate.src} alt={activeCertificate.alt} className="max-h-[80vh] w-full max-w-full rounded-lg border border-purple-500/60 object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900/80 bg-black/80 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
          <span className="text-[0.7rem] text-zinc-500">&copy; 2026 Ghada Alhajajji. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {[
              { href: "mailto:ghalhajaji@gmail.com", Icon: Mail },
              { href: "https://www.linkedin.com/in/ghada-al-hajaji", Icon: Linkedin },
              { href: "https://github.com/GhadoAlhajaji", Icon: Github },
            ].map(({ href, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="text-zinc-600 transition hover:text-purple-400">
                <Icon className="h-4 w-4" strokeWidth={1.7} />
              </a>
            ))}
          </div>
          <span className="hidden text-[0.7rem] text-zinc-600 sm:inline">Focused on AI security, cryptography, and digital forensics.</span>
        </div>
      </footer>
    </div>
  );
}
