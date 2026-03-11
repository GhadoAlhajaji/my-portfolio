 "use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
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
  Menu,
  X,
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

export default function Home() {
  const sections = [
    "about",
    "education",
    "experience",
    "accomplishments",
    "certifications",
    "courses",
    "blog",
    "projects",
    "connect",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const phraseIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
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
        const t = setTimeout(
          () => setDisplayedText(nextPhrase[0] ?? ""),
          TYPING_MS
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(
        () => setDisplayedText((prev) => prev.slice(0, -1)),
        DELETING_MS
      );
      return () => clearTimeout(t);
    }

    if (displayedText.length === phrase.length && displayedText !== "") {
      const t = setTimeout(() => {
        isDeletingRef.current = true;
        setDisplayedText((prev) => prev.slice(0, -1));
      }, PAUSE_AT_END_MS);
      return () => clearTimeout(t);
    }

    if (displayedText.length < phrase.length) {
      const t = setTimeout(
        () =>
          setDisplayedText(
            TYPED_PHRASES[phraseIndexRef.current].slice(0, displayedText.length + 1)
          ),
        TYPING_MS
      );
      return () => clearTimeout(t);
    }

    if (displayedText === "" && phrase) {
      const t = setTimeout(() => setDisplayedText(phrase[0]), TYPING_MS);
      return () => clearTimeout(t);
    }
  }, [displayedText]);

  useEffect(() => {
    const canvas = document.getElementById("code-rain-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Binary-only characters for cybersecurity feel
    const characters = "01".split("");
    const fontSize = 14;
    let columns = 0;
    let columnWidth = fontSize / 2; // higher density: columns closer together
    let drops: number[] = [];
    let depthFactors: number[] = [];
    let maxNegative = 20; // fallback; updated based on canvas height in init

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columnWidth = fontSize / 2;
      columns = Math.floor(canvas.width / columnWidth);

      // Start each column at a random negative height so there are no big empty gaps
      maxNegative = canvas.height / fontSize;
      drops = Array.from(
        { length: columns },
        () => -Math.random() * maxNegative
      );

      // Per-column depth/opacity factor for 3D feel
      depthFactors = Array.from(
        { length: columns },
        () => 0.4 + Math.random() * 0.9 // between 0.4 and 1.3
      );
    };

    const draw = () => {
      if (!ctx) return;

      // Gentle trailing fade so the code drizzle feels soft, not harsh
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const x = i * columnWidth;
        const y = drops[i] * fontSize;

        const t = (y / canvas.height) % 1;
        // Blend from Cyber Green to Electric Purple along the vertical path
        const rPurple = 168, gPurple = 85, bPurple = 247;
        const rGreen = 34, gGreen = 197, bGreen = 94;
        const r = Math.round(rGreen + (rPurple - rGreen) * t);
        const g = Math.round(gGreen + (gPurple - gGreen) * t);
        const b = Math.round(bGreen + (bPurple - bGreen) * t);
        // Very low base alpha, scaled by per-column depth for 3D effect
        const baseAlpha = 0.03 + 0.12 * t;
        const alpha = baseAlpha * (depthFactors[i] ?? 1);

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fillText(char, x, y);

        // Slow, elegant drizzle: small vertical step each frame
        const speed = 0.2; // slow, elegant drizzle

        if (y > canvas.height && Math.random() > 0.997) {
          drops[i] = -Math.random() * maxNegative;
        } else {
          drops[i] += speed;
        }
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!activeCertificate) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCertificate(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCertificate]);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  };
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen font-sans text-zinc-100">
      <canvas
        id="code-rain-canvas"
        className="pointer-events-none fixed inset-0 -z-10"
      />

      {/* Modern floating navbar – centered links, purple glassmorphism */}
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex w-full max-w-3xl items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.3)] bg-[rgba(10,5,15,0.8)] px-5 py-2.5 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-[12px] sm:rounded-full sm:px-8 sm:py-3">
          {/* Links – centered */}
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
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    scrollToSection(item.href);
                  } else {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }
                }}
                className="nav-link px-3 py-2 text-[0.7rem] font-mono font-medium uppercase tracking-[0.22em] text-zinc-300 transition-colors hover:text-purple-300 sm:px-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto mt-20 flex max-w-5xl flex-col gap-16 px-4 py-10 font-sans sm:mt-24 sm:px-6 sm:py-16">
        {/* Minimal, centered hero – fade in and slide up on load */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden border-b border-zinc-900 pb-16 text-center sm:min-h-[80vh]">
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
              hidden: {},
            }}
          >
            <motion.h1
              className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
              variants={fadeInUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-white">Hello, I&apos;m </span>
              <span className="bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.45)] transition-all duration-300 cursor-default hover:scale-105 hover:drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
                Ghada Alhajajji
              </span>
            </motion.h1>
            <motion.p
              className="font-mono text-sm text-zinc-400"
              variants={fadeInUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Cybersecurity Analyst · SOC &amp; GRC Analyst · AI Security Researcher
            </motion.p>
            <motion.div
              className="min-h-[2.5rem] font-mono text-base text-zinc-400 sm:text-lg"
              variants={fadeInUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-purple-500/80">~$ </span>
              <span>{displayedText}</span>
              <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-purple-500 align-middle sm:h-6" />
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-4 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <motion.a
              href="#about"
              className="inline-flex items-center justify-center rounded-xl border border-purple-500/60 bg-black/60 px-7 py-2.5 text-sm font-semibold normal-case tracking-wide text-purple-100 shadow-[0_0_14px_rgba(147,51,234,0.6)] backdrop-blur-md transition hover:border-purple-400 hover:bg-[#1a032c] hover:shadow-[0_0_26px_rgba(168,85,247,0.95)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
            >
              About me
            </motion.a>
            <motion.a
              href="#connect"
              className="inline-flex items-center justify-center rounded-xl border border-purple-500/60 bg-black/60 px-7 py-2.5 text-sm font-semibold normal-case tracking-wide text-purple-100 shadow-[0_0_14px_rgba(147,51,234,0.6)] backdrop-blur-md transition hover:border-purple-400 hover:bg-[#1a032c] hover:shadow-[0_0_26px_rgba(168,85,247,0.95)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
            >
              Get In Touch
            </motion.a>
            <motion.a
              href="https://medium.com/@ghadohajaji"
              className="inline-flex items-center justify-center rounded-xl border border-purple-500/60 bg-black/60 px-7 py-2.5 text-sm font-semibold normal-case tracking-wide text-purple-100 shadow-[0_0_14px_rgba(147,51,234,0.6)] backdrop-blur-md transition hover:border-purple-400 hover:bg-[#1a032c] hover:shadow-[0_0_26px_rgba(168,85,247,0.95)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
            >
              Blog
            </motion.a>
          </motion.div>

          {/* Scroll-down indicator – bottom center, hidden after scroll */}
          {!hasScrolled && (
            <motion.div
              className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-300/70 sm:bottom-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-purple-400/80">
                  SCROLL
                </span>
                <div className="h-7 w-px bg-gradient-to-b from-purple-500/70 via-purple-400/40 to-transparent" />
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* Content sections */}
        <section className="flex-1 space-y-10 lg:space-y-14">
          {/* About – scroll reveal */}
          <motion.section
            id="about"
            className="scroll-mt-24 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Neon divider */}
            <div className="mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

            <div className="mx-auto max-w-4xl space-y-6 text-left">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 01. About Me /&gt;
              </h2>
              <p className="font-sans text-base leading-relaxed text-zinc-300 sm:leading-loose sm:text-[1.05rem]">
                Motivated Cybersecurity Analyst with hands-on experience in GRC foundations and Security Operations Center (SOC) activities. I am a passionate professional skilled in network security, encryption, and incident analysis. My mission is to secure resilient digital environments through policy development, risk coordination, and emerging AI security research. I am committed to advancing organizational cybersecurity maturity with a strong foundation in threat detection and secure coding.
              </p>

              {/* Skills – grid of interactive cards with spring hover */}
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1, delayChildren: 0.05, ease: "easeOut" },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {/* Technical */}
                {[
                  {
                    title: "SOC Operations",
                    subtitle: "Monitor, detect, and respond to threats in real time.",
                    Icon: Shield,
                  },
                  {
                    title: "GRC & Compliance",
                    subtitle: "Align security controls with policies and regulations.",
                    Icon: FileText,
                  },
                  {
                    title: "Digital Forensics",
                    subtitle: "Investigate incidents and analyze digital evidence.",
                    Icon: Search,
                  },
                  {
                    title: "AI Security",
                    subtitle: "Secure ML systems and defend against adversarial attacks.",
                    Icon: Cpu,
                  },
                ].map(({ title, subtitle, Icon }) => (
                  <motion.div
                    key={title}
                    className="group flex flex-col items-start rounded-xl border border-purple-500/20 bg-[#16052e]/40 p-5 text-left backdrop-blur-sm hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                    variants={{
                      hidden: { opacity: 0, x: -24, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 260, damping: 24 },
                      },
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={springTransition}
                  >
                    <div className="mb-3 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                      <Icon className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-zinc-100">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</p>
                  </motion.div>
                ))}
                {/* Soft skills */}
                {[
                  {
                    title: "Problem Solving",
                    subtitle: "Break down complex security challenges systematically.",
                    Icon: Lightbulb,
                  },
                  {
                    title: "Critical Thinking",
                    subtitle: "Evaluate risks and evidence with a structured approach.",
                    Icon: Brain,
                  },
                  {
                    title: "Analytical Mindset",
                    subtitle: "Turn data and logs into actionable security insights.",
                    Icon: BarChart3,
                  },
                  {
                    title: "Effective Communication",
                    subtitle: "Share findings clearly with technical and non-technical stakeholders.",
                    Icon: MessageSquare,
                  },
                ].map(({ title, subtitle, Icon }) => (
                  <motion.div
                    key={title}
                    className="group flex flex-col items-start rounded-xl border border-purple-500/20 bg-[#16052e]/40 p-5 text-left backdrop-blur-sm hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                    variants={{
                      hidden: { opacity: 0, x: -24, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 260, damping: 24 },
                      },
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={springTransition}
                  >
                    <div className="mb-3 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                      <Icon className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-zinc-100">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Education – scroll reveal */}
          <motion.section
            id="education"
            className="scroll-mt-24 mt-24 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-left">
            <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 02. Education /&gt;
              </h2>
            </div>
            <div className="mx-auto max-w-4xl rounded-2xl border border-purple-500/25 bg-[#16052e]/40 p-5 shadow-[0_0_30px_rgba(126,34,206,0.1)] backdrop-blur-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-zinc-100">
                    B.Sc. Cybersecurity
                  </p>
                  <p className="mt-0.5 text-sm text-cyan-400/90">
                    Umm Al-Qura University
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[0.7rem] text-cyan-300">
                    <CheckCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    Candidate for First-Class Honors
                  </span>
                  <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-200">
                    3.8 / 4.0 GPA
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-purple-500/20 pt-4">
                <span className="font-mono text-xs text-zinc-500">Expected graduation</span>
                <motion.span
                  className="font-mono text-sm font-semibold text-cyan-300"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  June 2026
                </motion.span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Focus on network security, digital forensics, GRC foundations, and secure software design. Coursework and projects in incident response, cryptography, and AI security.
              </p>
            </div>
          </motion.section>

          {/* Professional Certifications – bento grid */}
          <motion.section
            id="certifications"
            className="scroll-mt-24 mt-24 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-left">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 03. Professional Certifications /&gt;
              </h2>
            </div>
            <motion.div
              className="mx-auto max-w-4xl grid grid-cols-1 gap-4 sm:grid-cols-2"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.08, delayChildren: 0.08, ease: "easeOut" },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {/* Verified – CySA+ */}
              <motion.article
                className="group flex flex-col rounded-xl border border-purple-500/70 bg-[#090014]/80 p-4 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md transition hover:shadow-[0_0_32px_rgba(168,85,247,0.8)]"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveCertificate({
                      src: "/cysa-cert.png",
                      alt: "CompTIA CySA+ Certificate",
                    })
                  }
                  className="mb-3 block w-full overflow-hidden rounded-lg border border-purple-500/70 bg-black/40 shadow-[0_0_20px_rgba(168,85,247,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                >
                  <div className="relative">
                    <img
                      src="/cysa-cert.png"
                      alt="CompTIA CySA+ Certificate"
                      className="h-32 w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] font-medium text-purple-100">
                        <Search className="h-4 w-4" strokeWidth={1.7} />
                        View Certificate
                      </span>
                    </div>
                  </div>
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.7)]">
                    <Award className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">CompTIA CySA+ (Cybersecurity Analyst)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">CompTIA · Verified Certification</p>
                    <p className="mt-1 font-mono text-[0.7rem] text-zinc-400">
                      Issued: Jun 2025 · Expires: Jun 2028
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  Validates hands-on skills in incident response, threat management, security monitoring, and
                  tuning defenses in real-world SOC environments.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCertificate({
                      src: "/cysa-cert.png",
                      alt: "CompTIA CySA+ Certificate",
                    })
                  }
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-purple-500/60 bg-black/40 px-3 py-1 text-[0.7rem] font-medium text-purple-100 transition hover:bg-purple-600/20 hover:shadow-[0_0_18px_rgba(168,85,247,0.9)] focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                >
                  <Search className="h-3.5 w-3.5" strokeWidth={1.7} />
                  View Certificate
                </button>
              </motion.article>

              {/* Verified – eJPT */}
              <motion.article
                className="group flex flex-col rounded-xl border border-purple-500/70 bg-[#090014]/80 p-4 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md transition hover:shadow-[0_0_32px_rgba(168,85,247,0.8)]"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveCertificate({
                      src: "/ejpt-cert.png",
                      alt: "eJPT Certificate",
                    })
                  }
                  className="mb-3 block w-full overflow-hidden rounded-lg border border-purple-500/70 bg-black/40 shadow-[0_0_20px_rgba(168,85,247,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                >
                  <div className="relative">
                    <img
                      src="/ejpt-cert.png"
                      alt="eJPT Certificate"
                      className="h-32 w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] font-medium text-purple-100">
                        <Search className="h-4 w-4" strokeWidth={1.7} />
                        View Certificate
                      </span>
                    </div>
                  </div>
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.7)]">
                    <Award className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">eJPT (Junior Penetration Tester)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">INE · Verified Certification</p>
                    <p className="mt-1 font-mono text-[0.7rem] text-zinc-400">Issued: Sep 2025</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  Demonstrates practical penetration testing skills in network analysis, vulnerability assessment,
                  exploitation, and reporting in lab-style environments.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setActiveCertificate({
                      src: "/ejpt-cert.png",
                      alt: "eJPT Certificate",
                    })
                  }
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-purple-500/60 bg-black/40 px-3 py-1 text-[0.7rem] font-medium text-purple-100 transition hover:bg-purple-600/20 hover:shadow-[0_0_18px_rgba(168,85,247,0.9)] focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                >
                  <Search className="h-3.5 w-3.5" strokeWidth={1.7} />
                  View Certificate
                </button>
              </motion.article>

              {/* In progress – ECDFP */}
              <motion.article
                className="group flex flex-col rounded-xl border border-purple-500/40 bg-[#050011]/80 p-4 opacity-85 backdrop-blur-md transition hover:border-purple-400 hover:opacity-100 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)]"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    <CheckCircle className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">ECDFP – Digital Forensics Professional</p>
                    <p className="mt-0.5 text-xs text-zinc-500">EC-Council · In Progress</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-purple-200">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                      Coming Soon
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Advanced training path focused on disk, memory, and network forensics, evidence handling, and
                  investigation workflows.
                </p>
              </motion.article>

              {/* In progress – INE ICCA */}
              <motion.article
                className="group flex flex-col rounded-xl border border-purple-500/40 bg-[#050011]/80 p-4 opacity-85 backdrop-blur-md transition hover:border-purple-400 hover:opacity-100 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)]"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    <CheckCircle className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-100">INE Certified Cloud Associate (ICCA)</p>
                    <p className="mt-0.5 text-xs text-zinc-500">INE · In Progress</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-purple-200">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                      In Development
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Cloud fundamentals track covering secure architectures, identity, and monitoring across modern
                  cloud platforms.
                </p>
              </motion.article>
            </motion.div>
          </motion.section>

          {/* Experience – scroll reveal, card slides in from left with bounce */}
          <motion.section
            id="experience"
            className="scroll-mt-24 mt-24 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-left">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 04. Professional Experience /&gt;
              </h2>
            </div>
            <motion.article
              className="experience-card mx-auto max-w-4xl rounded-2xl border border-purple-500/50 bg-[#16052e]/50 p-10 backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(168,85,247,0.65)]"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    Cybersecurity Cooperative Trainee – GRC Focus
                  </h3>
                  <p className="mt-1 text-sm text-cyan-400/90">
                    General Syndicate of Cars
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    February 2025 — August 2025 · Saudi Arabia
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-purple-300/90">
                  [ CO-OP INTERN ]
                </span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                Played a key role in establishing the foundational cybersecurity governance and policy frameworks for a newly formed department, aligning GRC processes with long-term security goals.
              </p>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" aria-hidden>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span><strong className="font-semibold text-zinc-100">Framework Development:</strong> <span className="text-purple-200/80">Proposed and implemented structured policy measurement and compliance assessment mechanisms, significantly improving audit readiness.</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" aria-hidden>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span><strong className="font-semibold text-zinc-100">Governance Workflows:</strong> <span className="text-purple-200/80">Assisted in designing scalable governance workflows to support sustainable cybersecurity maturity and future expansion.</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" aria-hidden>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span><strong className="font-semibold text-zinc-100">Risk Management:</strong> <span className="text-purple-200/80">Supported early-stage risk documentation and control mapping, strengthening the organizational baseline security posture.</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" aria-hidden>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span><strong className="font-semibold text-zinc-100">Stakeholder Alignment:</strong> <span className="text-purple-200/80">Coordinated between key stakeholders to align security governance initiatives and ensure compliance tracking.</span></span>
                </li>
              </ul>
            </motion.article>
          </motion.section>

          {/* Courses & Accomplishments – vertical timeline */}
          <motion.section
            id="accomplishments"
            className="scroll-mt-24 mt-24 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-left">
            <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 05. Courses &amp; Accomplishments /&gt;
              </h2>
            </div>
            <div className="mx-auto max-w-4xl py-16 sm:py-20">
              <div className="relative pb-2 pt-1">
                <div
                  className="pointer-events-none absolute inset-y-0 left-4 w-px translate-x-0 bg-gradient-to-b from-purple-400 via-cyan-400 to-zinc-700 shadow-[0_0_18px_rgba(56,189,248,0.75)] md:left-1/2 md:-translate-x-1/2"
                  aria-hidden
                />
                <div className="space-y-7 sm:space-y-8">
                  {[
                    {
                      id: "kaust-3",
                      date: "Feb 2026",
                      title: "KAUST Cybersecurity Training – Stage 3",
                      org: "KAUST × National Cybersecurity Authority (NCA)",
                      description:
                        "Advanced to the elite third stage of the NCA‑partnered program, focusing on advanced threat hunting and complex incident response simulations.",
                      tag: "ELITE TRAINING",
                      icon: Terminal,
                      accent:
                        "hover:border-cyan-300/90 hover:bg-cyan-500/10 hover:shadow-[0_0_34px_rgba(34,211,238,0.8)]",
                    },
                    {
                      id: "ssds-committee",
                      date: "Sep 2025 – Present",
                      title: "Consulting Committee Member",
                      org: "Saudi Society for Data Science (SSDS)",
                      description:
                        "Member of the Consulting Committee contributing to data science and AI initiatives with a cybersecurity lens.",
                      tag: "Leadership",
                      icon: Sparkles,
                      accent:
                        "hover:border-emerald-400/70 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(16,185,129,0.45)]",
                    },
                    {
                      id: "kaust-2",
                      date: "Feb 2025",
                      title: "KAUST Cybersecurity Training – Stage 2",
                      org: "KAUST × National Cybersecurity Authority (NCA)",
                      description:
                        "Successfully completed Stage 2, mastering 40+ hours of hands‑on labs in network security and secure infrastructure.",
                      tag: "INTERMEDIATE BOOTCAMP",
                      icon: Terminal,
                      accent:
                        "hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:shadow-[0_0_26px_rgba(34,211,238,0.55)]",
                    },
                    {
                      id: "bsf-award",
                      date: "Jan 2024 – Dec 2025",
                      title: "Professional Supervision Initiative Award (UQU × BSF)",
                      org: "Umm Al-Qura University × Banque Saudi Fransi",
                      description:
                        "A prestigious 2-year leadership and professional development program. Honored at the final award ceremony as one of only 8 students selected from a pool of 300 for demonstrating exceptional leadership, innovative problem-solving, and excellence in security-related projects.",
                      tag: "ACHIEVEMENT · 2-YEAR PROGRAM",
                      icon: Award,
                      accent:
                        "hover:border-amber-400/70 hover:bg-amber-400/5 hover:shadow-[0_0_28px_rgba(251,191,36,0.65)]",
                    },
                    {
                      id: "web-attacks-workshop",
                      date: "Dec 2024",
                      title: "Advanced Web Attacks Workshop",
                      org: "Cyber Guard Club",
                      description:
                        "Delivered a live workshop covering XSS, SQL injection, and authentication bypass techniques with secure coding countermeasures.",
                      tag: "Speaking",
                      icon: Mic2,
                      accent:
                        "hover:border-pink-400/80 hover:bg-pink-500/10 hover:shadow-[0_0_26px_rgba(244,114,182,0.55)]",
                    },
                    {
                      id: "ejpt-speaker",
                      date: "Nov 2024",
                      title: "eJPT Certification Speaker",
                      org: "Umm Al-Qura University",
                      description:
                        "Guided students through entry‑level penetration testing certifications, exam strategy, and career paths.",
                      tag: "Mentorship",
                      icon: Mic2,
                      accent:
                        "hover:border-indigo-400/80 hover:bg-indigo-500/10 hover:shadow-[0_0_24px_rgba(129,140,248,0.5)]",
                    },
                    {
                      id: "digital-safety-shield",
                      date: "Aug 2024",
                      title: "Digital Safety Shield – Cybersecurity Awareness",
                      org: "Yusr Association",
                      description:
                        "Designed and executed the Encryption & Privacy booth to teach families safe digital habits and secure communication.",
                      tag: "Volunteering",
                      icon: Shield,
                      accent:
                        "hover:border-purple-400/80 hover:bg-purple-500/10 hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]",
                    },
                    {
                      id: "specialties-forum",
                      date: "Jun 2024",
                      title: "Specialties Forum Speaker",
                      org: "Umm Al-Qura University",
                      description:
                        "Represented the Cybersecurity Department, introducing new students to the field, its paths, and required skills.",
                      tag: "Speaking",
                      icon: Mic2,
                      accent:
                        "hover:border-pink-400/80 hover:bg-pink-500/10 hover:shadow-[0_0_26px_rgba(244,114,182,0.55)]",
                    },
                    {
                      id: "nca-academy",
                      date: "Early 2024",
                      title: "National Cybersecurity Academy",
                      org: "SITE & National Cybersecurity Authority",
                      description:
                        "Immersive training covering SOC operations, Network+, Security+, and threat simulation in realistic lab environments.",
                      tag: "Bootcamps",
                      icon: Terminal,
                      accent:
                        "hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:shadow-[0_0_26px_rgba(34,211,238,0.55)]",
                    },
                    {
                      id: "awareness-show",
                      date: "2023",
                      title: "Cybersecurity Awareness Show Member",
                      org: "Umm Al-Qura University",
                      description:
                        "Helped spread security culture through interactive shows and demonstrations for the university community.",
                      tag: "Volunteering",
                      icon: Shield,
                      accent:
                        "hover:border-purple-400/80 hover:bg-purple-500/10 hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]",
                    },
                    {
                      id: "ux-workshop",
                      date: "Workshop",
                      title: "UX Design Principles",
                      org: "Design & Security Focus",
                      description:
                        "Explored user experience design fundamentals to build secure interfaces that are intuitive and human‑centric.",
                      tag: "Workshop",
                      icon: BookOpen,
                      accent:
                        "hover:border-amber-400/80 hover:bg-amber-500/10 hover:shadow-[0_0_24px_rgba(251,191,36,0.55)]",
                    },
                  ].map((item, index) => {
                    const { id, date, title, org, description, tag, icon: Icon, accent } = item;
                    const isLeft = index % 2 === 0;

                    return (
                      <motion.article
                        key={id ?? `${date}-${title}`}
                        variants={{
                          hidden: { opacity: 0, y: 18, x: isLeft ? -28 : 28 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            x: 0,
                            transition: { duration: 0.45, ease: "easeOut" },
                          },
                        }}
                      >
                        <div className="relative">
                          <div className="absolute left-4 top-4 translate-x-0 md:left-1/2 md:-translate-x-1/2">
                            <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(8,47,73,0.9)]" />
                          </div>
                          <div
                            className={`relative ${index === 0 ? "mt-10" : "mt-8"} w-full pl-10 pr-3 sm:pr-4 md:w-1/2 md:pl-0 md:pr-0 ${
                              isLeft ? "md:pr-10 md:mr-auto" : "md:pl-10 md:ml-auto"
                            }`}
                          >
                            <div
                              className={`group relative rounded-2xl border border-zinc-800/80 bg-[#0b0616]/80 p-4 sm:p-5 backdrop-blur-md transition-colors duration-300 ${
                                id === "kaust-3" || id === "kaust-2"
                                  ? "border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                  : ""
                              } ${accent}`}
                            >
                              <span
                                className={`pointer-events-none absolute top-6 hidden h-3 w-3 rotate-45 bg-[#0b0616] md:inline-block ${
                                  isLeft ? "-right-1.5" : "-left-1.5"
                                }`}
                                aria-hidden
                              />
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                                    {date}
                                  </p>
                                  <h3 className="mt-1 text-sm font-semibold text-zinc-100 sm:text-base">
                                    {title}
                                  </h3>
                                  <p className="text-xs text-cyan-300/90">{org}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-900/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-300">
                                  <Icon className="h-3.5 w-3.5 text-cyan-300" strokeWidth={1.7} />
                                  {tag}
                                </span>
                              </div>
                              <p className="mt-3 text-xs leading-relaxed text-zinc-300/90">
                                {description}
                              </p>
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

          {/* Projects – scroll reveal */}
          <motion.section
            id="projects"
            className="scroll-mt-24 mt-24 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-left">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 06. Featured Projects /&gt;
              </h2>
            </div>
            <motion.div
              className="grid gap-5 text-sm md:grid-cols-2 lg:grid-cols-4"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.08, delayChildren: 0.08, ease: "easeOut" },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {/* Project 1 – Cryptographic Algorithm Design */}
              <motion.article
                className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b0616]/80 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-md"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">
                  Cryptography
                </p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  Cryptographic Algorithm Design
                </h3>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                  Tech Stack
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["Java", "Cryptography", "Modular Arithmetic", "Security Analysis"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[0.65rem] font-medium text-cyan-200"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-zinc-300">
                  <li>Designed a custom block-based encryption algorithm from first principles.</li>
                  <li>Analyzed key space, brute‑force resistance, and side‑channel exposure.</li>
                  <li>Built an interactive web interface to visualize encryption and decryption flows.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="https://jix17345.github.io/Simple-crypto-web/cipher"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 text-[0.7rem] font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    Live Demo
                  </a>
                  <a
                    href="/crypto-design-report.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-[0.7rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200"
                  >
                    View PDF Report
                  </a>
                </div>
              </motion.article>

              {/* Project 2 – Exploit Development & Memory Corruption */}
              <motion.article
                className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b0616]/80 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-md"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">
                  Offensive Security
                </p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  Exploit Development &amp; Memory Corruption
                </h3>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                  Tech Stack
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["C", "Python", "GDB", "Buffer Overflow", "Linux Security"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[0.65rem] font-medium text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-zinc-300">
                  <li>Developed vulnerable C binaries to demonstrate stack/heap overflows and format string flaws.</li>
                  <li>Wrote Python exploit scripts to automate memory corruption and controlled EIP/RIP hijacking.</li>
                  <li>Evaluated mitigations including Stack Canaries, ASLR, and NX, documenting their impact.</li>
                </ul>
                <div className="mt-4 flex justify-center">
                  <a
                    href="/exploit-dev-report.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-[9rem] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-[0.7rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200"
                  >
                    View PDF Report
                  </a>
                </div>
              </motion.article>

              {/* Project 3 – Secure Web App */}
              <motion.article
                className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b0616]/80 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-md"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">
                  Web Security
                </p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  Secure Web App – Threat Analysis &amp; Mitigation
                </h3>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                  Tech Stack
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["PHP", "SQL", "STRIDE/DREAD", "Web Security", "Authentication"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[0.65rem] font-medium text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-zinc-300">
                  <li>Built a secure learning platform for cybersecurity students to practice real-world scenarios.</li>
                  <li>Performed structured STRIDE threat modeling and DREAD risk scoring across core modules.</li>
                  <li>Implemented CSRF defenses, bcrypt-based password hashing, and a strict Content Security Policy.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="https://secureapp.free.nf/login.php?i=1"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 text-[0.7rem] font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    Live Demo
                  </a>
                  <a
                    href="/secure-web-analysis.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-[0.7rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200"
                  >
                    View PDF Report
                  </a>
                </div>
              </motion.article>

              {/* Project 4 – Secure Network Infrastructure & Traffic Analysis */}
              <motion.article
                className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b0616]/80 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)] backdrop-blur-md"
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 26 },
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300">
                    Network Security
                  </p>
                  <Server className="h-3.5 w-3.5 text-cyan-300" strokeWidth={1.6} />
                </div>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  Secure Network Infrastructure &amp; Traffic Analysis
                </h3>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                  Tech Stack
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["Linux Admin", "Wireshark", "UFW Firewall", "SSH Security", "Networking"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[0.65rem] font-medium text-cyan-200"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-zinc-300">
                  <li>Architected a secure virtual lab with multiple Ubuntu nodes and segmented network zones.</li>
                  <li>Hardened remote access by tightening SSH configuration and enforcing UFW-based least-privilege rules.</li>
                  <li>Performed deep packet inspection in Wireshark to analyze TCP, ICMP, and SSH flows and identify traffic patterns.</li>
                  <li>Executed secure file transfers (SCP) and remote administration workflows across distributed machines.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="/network-security-lab.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-[0.7rem] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-cyan-200"
                  >
                    View Lab Report
                  </a>
                </div>
              </motion.article>
            </motion.div>
          </motion.section>

          {/* Connect – scroll reveal */}
          <motion.section
            id="connect"
            className="scroll-mt-24 mt-24 space-y-4 pb-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scrollReveal}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-mono text-lg font-medium text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)] sm:text-xl">
                &lt; 07. Get In Touch /&gt;
              </h2>
            </div>
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-5 rounded-2xl border border-purple-700/40 bg-[#100020]/80 px-6 py-5 text-sm backdrop-blur-md">
              <p className="text-center text-xs text-zinc-400">
                Quick ways to reach me and follow my work.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-7">
                {/* Email */}
                <a
                  href="mailto:ghalhajaji@gmail.com"
                  className="group flex flex-col items-center gap-2 text-xs text-zinc-300"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-fuchsia-500/70 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_16px_rgba(217,70,239,0.6)] transition transform group-hover:scale-110 group-hover:brightness-125 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.95)]">
                    <Mail size={40} strokeWidth={1.7} />
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                    Email
                  </span>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ghada-al-hajaji"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 text-xs text-zinc-300"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/80 bg-purple-500/15 text-purple-100 shadow-[0_0_16px_rgba(168,85,247,0.6)] transition transform group-hover:scale-110 group-hover:brightness-125 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.98)]">
                    <Linkedin size={40} strokeWidth={1.7} />
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                    LinkedIn
                  </span>
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com/GhadoAlhajaji"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 text-xs text-zinc-300"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-purple-400/80 bg-purple-500/10 text-purple-100 shadow-[0_0_16px_rgba(129,140,248,0.55)] transition transform group-hover:scale-110 group-hover:brightness-125 group-hover:shadow-[0_0_30px_rgba(129,140,248,0.98)]">
                    <Github size={40} strokeWidth={1.7} />
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                    GitHub
                  </span>
                </a>
                {/* Medium */}
                <a
                  href="https://medium.com/@ghadohajaji"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 text-xs text-zinc-300"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-purple-300/80 bg-purple-500/10 text-purple-100 shadow-[0_0_16px_rgba(192,132,252,0.55)] transition transform group-hover:scale-110 group-hover:brightness-125 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.98)]">
                    <ExternalLink size={40} strokeWidth={1.7} />
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                    Blog
                  </span>
                </a>
              </div>
            </div>
          </motion.section>
        </section>
      </main>

      {/* Certificate lightbox modal */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl"
            onClick={() => setActiveCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 260, damping: 24 }}
              className="relative mx-4 w-full max-w-3xl rounded-2xl border border-purple-500/60 bg-black/90 p-3 shadow-[0_0_40px_rgba(168,85,247,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close certificate preview"
                onClick={() => setActiveCertificate(null)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/60 bg-black/70 text-zinc-200 shadow-[0_0_16px_rgba(168,85,247,0.7)] transition hover:bg-purple-500/25 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mt-6 flex justify-center">
                <img
                  src={activeCertificate.src}
                  alt={activeCertificate.alt}
                  className="max-h-[80vh] w-full max-w-full rounded-lg border border-purple-500/60 object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-900/80 bg-black/80 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 text-[0.7rem] text-zinc-500 sm:px-6">
          <span>&copy; 2026 Ghada Alhajajji. All rights reserved.</span>
          <span className="hidden sm:inline">
            Focused on AI security, cryptography, and digital forensics.
          </span>
        </div>
      </footer>
    </div>
  );
}
