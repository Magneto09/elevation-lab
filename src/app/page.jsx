"use client";
/* =============================================
   ELEVATION LAB — Full App with Supabase Backend
   ============================================= */
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";


const C = {
  bg: "#FFFFFF",
  bgCard: "#FFFFFF",
  purple: "#0A0A0A",
  magenta: "#0A0A0A",
  cyan: "#0A0A0A",
  gold: "#806600",
  orange: "#D97706",
  pink: "#0A0A0A",
  lime: "#0A0A0A",
  blue: "#2563EB",
  red: "#DC2626",
  textPrimary: "#0A0A0A",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  green: "#059669",
  greenLight: "#10B981",
  beige: "#F9FAFB",
  cream: "#F3F4F6",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased}
body{background:#FFFFFF;color:#0A0A0A;font-family:'Inter',sans-serif}

.title-rainbow{
  color:#0A0A0A;
  background:none;
  -webkit-background-clip:initial;background-clip:initial;
  -webkit-text-fill-color:#0A0A0A;
}

@keyframes warpIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes rotateSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes pulseGlow{0%,100%{opacity:0.7}50%{opacity:1}}

.rainbow-spin{background:#0A0A0A;animation:rotateSlow 8s linear infinite}
.rainbow-spin-reverse{background:#374151;animation:rotateSlow 10s linear infinite reverse}

.text-glow-pulse{animation:pulseGlow 2.5s ease-in-out infinite}

.input-glow:focus{
  border-color:#0A0A0A !important;
  box-shadow:0 0 0 3px rgba(10,10,10,0.08) !important;
}

input::placeholder,textarea::placeholder{color:#9CA3AF}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#9CA3AF}
`;


const Icons = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Bulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-.85-3.25-2.03-3.79A1.07 1.07 0 0114 17v-2.34"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Bag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>,
};

// Elevate™ brand logo — tri-symmetrical looping knot
function ElevateLogo({ size = 48, color = "currentColor", glow, style = {} }) {
  return (
    <svg viewBox="-80 -80 160 140" width={size} height={size * 0.875} style={style} fill="none">
      {glow && <defs>
        <filter id="elGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>}
      <g filter={glow ? "url(#elGlow)" : undefined}>
        {/* Top loop */}
        <path d="M-4,-8 C-8,-32 -16,-52 -2,-64 C8,-72 18,-62 14,-48 C10,-34 4,-18 4,-8"
          stroke={color} strokeWidth="13" strokeLinecap="round" fill="none"/>
        {/* Bottom-left arm with loop */}
        <path d="M-4,-8 C-12,4 -28,20 -46,34 C-58,44 -66,38 -62,26 C-58,14 -44,10 -32,14"
          stroke={color} strokeWidth="13" strokeLinecap="round" fill="none"/>
        {/* Bottom-right arm with loop */}
        <path d="M4,-8 C12,4 28,20 46,34 C58,44 66,38 62,26 C58,14 44,10 32,14"
          stroke={color} strokeWidth="13" strokeLinecap="round" fill="none"/>
        {/* Center crossing */}
        <path d="M-4,-8 L4,-8" stroke={color} strokeWidth="13" strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  );
}

// Full brand lockup — knot + ELEVATE text as HTML
function ElevateBrand({ size = 48, color = C.cyan, glow, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.08, ...style }}>
      <ElevateLogo size={size} color={color} glow />
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size * 0.22,
          letterSpacing: size * 0.06, color: color, textTransform: "uppercase",
          textShadow: glow ? `0 0 15px ${color}60` : "none",
        }}>ELEVATE</span>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: size * 0.1,
          color: color, opacity: 0.7,
        }}>\u2122</span>
      </div>
    </div>
  );
}

const PROMPTS = ["What do you want to elevate today?","What idea is calling from the void?","What patterns is your mind weaving?","What would your highest self create?","What creative truth wants to be born?"];
const RPROMPTS = ["What idea stayed with you today?","What did your elevated mind create?","What cosmic pattern are you seeing?","What dimension did your creativity visit?","What colors does your subconscious paint in?"];
const CHALLENGES = [{ title: "Draw Your Mind", desc: "Sketch what your thoughts look like right now", days: 3, entries: 47 }];
const CIRCLES = [
  { name: "Visual Artists", members: 1243, emoji: "🎨", g: `linear-gradient(135deg,${C.purple},${C.magenta})` },
  { name: "Writers & Poets", members: 876, emoji: "✍️", g: `linear-gradient(135deg,${C.gold},${C.orange})` },
  { name: "Musicians", members: 654, emoji: "🎵", g: `linear-gradient(135deg,${C.cyan},${C.purple})` },
  { name: "Designers", members: 932, emoji: "🖥️", g: `linear-gradient(135deg,${C.magenta},${C.orange})` },
  { name: "Deep Thinkers", members: 1567, emoji: "🧠", g: `linear-gradient(135deg,${C.cyan},${C.lime})` },
  { name: "Entrepreneurs", members: 445, emoji: "🚀", g: `linear-gradient(135deg,${C.gold},${C.magenta})` },
];
const FEED = [
  { user: "luna_creates", avatar: "🌙", type: "art", caption: "Late night sketch — letting the pen flow into fractal patterns", rx: {"🙏":34,"✨":12,"🤔":8}, time: "2h" },
  { user: "mindful_beats", avatar: "🎧", type: "music", caption: "New ambient loop from a 45-min session. Headphones on.", rx: {"🙏":67,"✨":45,"🤔":3}, time: "4h" },
  { user: "cosmic_writer", avatar: "🔮", type: "poetry", caption: "Words that poured through during morning reflection", rx: {"🙏":23,"✨":31,"🤔":15}, time: "6h" },
  { user: "sketch_daily", avatar: "🌀", type: "art", caption: "Challenge: Drawing my mind — more chaotic than expected", rx: {"🙏":89,"✨":22,"🤔":7}, time: "8h" },
];

const SHOP = [
  { name: "Drogon Signature Artisanal Bong", price: 3499, orig: 4999, cat: "Bongs", rating: 5.0, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/drogon-signature-artisinal-bong" },
  { name: "Dark Knight Bong", price: 2399, orig: 3499, cat: "Bongs", rating: 4.8, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/dark-knight-bong" },
  { name: "Psychedelic Paisley Bong", price: 2399, orig: 2799, cat: "Bongs", rating: 4.7, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/subway-surfer-bong-copy-copy-copy" },
  { name: "High Circuit Bong", price: 2399, orig: 2799, cat: "Bongs", rating: 4.8, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/high-circuit-bong" },
  { name: "Lost Atlas Bong", price: 2399, orig: 2799, cat: "Bongs", rating: 4.6, popular: true, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/lost-atlas-bong" },
  { name: "Pop Culture Bong", price: 2399, orig: 2799, cat: "Bongs", rating: 4.5, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/subway-surfer-bong-copy" },
  { name: "Blaze Banner Bong", price: 2399, orig: 3499, cat: "Bongs", rating: 4.8, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/blaze-banner-marvel-series-bong" },
  { name: "Eternal Beetle Artisanal Ash Tray", price: 1799, orig: 4999, cat: "Ash Trays", rating: 4.9, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/eternal-beetle-signature-artisinal-ash-tray" },
  { name: "Blue Cosmic Bud Rolling Tray", price: 899, orig: 1499, cat: "Rolling Trays", rating: 4.7, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/blue-cosmic-bud-rolling-tray" },
  { name: "Green Organic Haze Rolling Tray", price: 899, orig: 1499, cat: "Rolling Trays", rating: 4.6, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/green-organic-haze-rolling-tray" },
  { name: "Gothic Cult Flip Joint Case", price: 899, orig: 1499, cat: "Joint Cases", rating: 4.3, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/gothic-cult-flip-joint-case" },
  { name: "Graffiti Art Flip Joint Case", price: 899, orig: 1499, cat: "Joint Cases", rating: 4.8, img: "data:image/jpeg;base64,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", url: "https://elevatestores.in/collections/shop-all/products/graffiti-art-flip-joint-case" },
  { name: "Manga Pop Flip Joint Case", price: 899, orig: 1499, cat: "Joint Cases", rating: 4.7, img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCADIAMgDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAQGAgMFAQf/xABAEAABAwIDBAgEAwUHBQAAAAABAAIDBBEFEiETMUFRBiIyYXGBkaEUQrHRUsHwBxUjorIWJDNyguHxQ1Nik8L/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EAB8RAQEBAQEAAgIDAAAAAAAAAAABEQIhAzEiYRJBUf/aAAwDAQACEQMRAD8AvCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC5XSHGDhFNG5rbvkcQDa9rLqqp/tDuKCmI067tfJBzT08qQT1WHxj/3RvT2pvqyL/1n7qnE6rxBdD0+nAuI4SeWRwv7o39oFSSL0sI9fuqWvUF6HTx3GKH+Zbo+nLHdqOEf6nfZfP1k0oPpEPTCGVwbaHMeAefsuxSYpBU5Gkhj33ygm+bwK+RQzGKZrxrY7irtBNH8NAyVt2EE35a70WTauiLg0OPxx1HwtW8DcGyk3B8fZd7fuQss+xEREEREBERAREQEREBERAREQFVv2hMzYVARwlP9JVpVa6fA/uRhH/eA/lKD5qvF6g3oCLINushHdBhZLLeI7cFMrMKfSQte6RriXZHNAPVNr+e9BzLKzUtWXU7Gud1GhwAtuJ/JcDYmy7MNLnpY5WyFgLXF/Vve3Aeylb4sl9ZyymJpkb2majTjwVy6L1Ek9BZ7y8MABLjc34qlNeZGkuY5hvYtcrt0VgEWDMeAbyuLzf0/JI7fNma7CIirzCIiAiIgIiICIiAiIgIiICr3TthfgGnCZp+q7VbWQ0NO6aoeGsHqTyHevm3SHpNU4rK6JjjHTXtswdD480HEML+XugicN9vC+qFyxv3BBtDCN4PotjQFGuV7tHc0HWpKB872ZyI4nDMXkjRv37lKxVks0jHhkhIiG0aQeq4Cx9gCq/tHcyfNZiV1u06/DVES7LvYK4fAxHfs5nMPmAR9FXaXbTytjjALnEAXAVho3tZBWkFrAzKLaDrs+6lajRLE81lXCxukIDgeYJX0KigFLRwwD/psDfQKnwwSP6TULogNnO3LKCODdfyCuyRvvq3yiIirmIiICIiAiIgIiICIiAo2IYhT4bTmapeGjgOJUlVfpE1slRWPmjZK2KJrWNeLgOP6CCodIMdnxarcc7hCNGt3Cy45NzdW+PDaR9Ax81HGJGjO/QgkB2u7uWw4Fhjsp+H6u0LHFsjh4ceSmr/G1T443yXyMc62/KL2QseAbscAN5Ldyu1NglHR4g4RbVgczT+JdacRoGS0uxL5f4gbIdxsSbAfU+SpZimIu9SdHY6uQtbUSMGXNcxg6XNuPcsqvoy2mDj8YCA2+sduIHPvU1HAC2xsMhsNOZO4Lq/2ck+MdTipju3e7KV0DQRQQPp4WglrQ4OI6zuBBPgVVk1nhtAyhaWuy7XKbvB36gKxYZRxYjHJI+OSFgfZtrDON97WXGI2oiDb2kY5l+V4wR7hWTo/n+GmzEWEmVoHAABQSKTC4KSXaMzOcAQM3C+9TERVBERAREQEREBERAREQEREBVfHnXfK0b5KhjfQD7K0Kq4q7Ni0THCwbI959QAiybXkrclYxjuxIzIfMWKiUQfknp3dtgv5tNj7WUiWOTEJckUhjMZLi8C+86D6qLSunhxpzaoDO52pG5wItcegUjpevf2m1bnSUcdQztAWPnotNWT8SWN+V1h/pZ93LdC7ZufSu4yNy+oXNrKoCVw1zzZg0jhdxufSyM/J95CmqJ6d7qiOLNSaMJtrlGlwp9XB8S+N1wYxfN3jgoIpahlK2s2hDALCHgI/+NVNonf3DKTfZ5meQ3e1ljr/AFZJiFhQfM+V7nkuIDWuPMDT6BYOlLaoGTRty0/5bfb6Lo1ZZDBI+IBlnANI5gjX1UCpyulJHZc0Ob4O/RC1pzG9jn5HMuBI12W/DMDmafAglWbBmtEMxbxlN/GwVUphcNLHXcGNY8E8d7Hf/KtWA2NAXD55HO171WK6KIiqCIiAiIgIiICIiAiIgIiICq8rBNj1YX6hrcg/XmrQq6+NraiqlPzSv9jp9FK1yhCp/d9FJM2PPI6QMDfAf8rytkZWUEdfADmi7Q4gX1HkbLXiT27KEWux5kJ5XJ0WjAptk/ZTD+FU3aL7sw+4WpPGb1+Wp8zmvxSme3iM58gSuTLcuawj/Ehbl9dfqpTaWSjxGfO4ujZTvMRPK1lpLmuraaPi11vK4H5LONXr8pjrVhbsDGC2zrtIJ4blAw1znwFoIsXdbvGULZjNHHUxse9zgWAmw43K0Ya5tPRPkeeqy2vg0LHX03G7GLR4U8N3AtA9Vz4ZtrQZvmiOv+U/Y6+a9r2zzU75Z5gy9rQA7h396h4VKPizE/sSDIfA6fWysnjNuVnK50Ti4PcOqNGm1yOHhoFeOjchmwlktwRI5zh3d3kqTJH22P8ACx5g6q6dFmtbgkeQWBe/+orUX5OcrrIiKuYiIgIiICIiAiIgIiICIiAq28iR9UxxsQ91vC97qyKj4niMlLV1kLI+u9xAd3KVvmyNlU1j9jTONo3wm7uRc67T7KDkdsXw1BLXw9Ww57w5TqmIvqjEO0Y44gD4XK1YpG5rGucesBsZHEb+LXeeq7c/jn7ebqXu39NzK01dHK2XSeKIsf33IAPmuVtiypLyCXiS4PcBmsp7I20tPVHNmZtWRh3MN6xXNkYTIHl2UtDLE7g4g/YLnXXm+zXTxGW81hJeOWJpjHM7j7G6jGW9JC2IZiXuflHE3s0e49FopoTUTmGON0b7dZxdcMB5BSsOiP7wG0YGOj1cOZaN/uFiu08YVWHRx4cyoLnuqHjM4k77i5C48NxMCN9ifYqwY08GF7R1XQltgOOl/uuTaJxEVKHOmlAbr8oO+yaxn9pdeAal/DMQ8eYB/NXHo1rgsLh8xcf5iqhijWsrDr2Gtb7K4dGxbAqXwP8AUUn2693eJXSREWnAREQEREBERARLry6D1FjmXheEGaLWZQvDMOaDaq1LQQVdUKqUE5bi3DQnUrv7dvNVWpzTwzbMvEEUxMjGjrPabaD3QZQHa4vIdCQ95HkAAvcSb/BDKgtzyMcCW7hbVvv9VyoniKqDqJ7g17iGA9oHcW6+VlnG99TXwxvl2jnyNzDNfQam44Ld9YkxsxCJ4ghoIXRAxtDntLrFznX0Hv6rQ21TJLG+MsOl2O3i27y0PqpfxsD3VAqYHFj3utI5t2l1+fDSywq4cj25ZL5f8KU6kf8Ai7mDzWVsRYS6mr3sGr2AZSeLeXoVKp5XS4i90LcwebE3tYXbdRXyCWqiky5X2yPbxBF17SVLqasMjozYEktG8tPEeYCzZ67c3eW/GwDC+bi+RoPkTb2WjAJIYop5JWjNE2+a1yBcg29lqxWt25bcOay9g077Hie/d6JhMkb6t8cYDRIx7N56xNiPDcolZ7Korah0ga122IfbNbIN2vhZXbAWtbg9M1ly0NNieOp1VLDmOoZWufllifmFjYlpAurpgLcmC0jTvEYVS3zE9ERVkREQEREBERBgSsCVsIWJag0ueVpfIQpLo7rU+G6CHJO4KPJVuCmSU91GlpCeCCFJXubxWdNVwRTNDntvUvJFj2QBpf8AXFYzUBPBQZsNcb6IIc4ZJUwz5WgkukefEm1/YKdSU5poZ5srdrllc0jXUAC9/UqBLhkgNxcHuWnYV0NtlPK2xJFnIXN1Ppap0MT6aRplgaQHAtGa3McwtTnNpZcgcJKR+jXE3Avw8Fy3Q1rJBI2Qhw3GyzdUVhBbJDC5p3gNsD5K6JdQzZTNl1OTefxN5+IWcsYlaCCQRq1wUBtVUBga6AEN7Ou7u7ws4ap7G5dk6w3a3spXT4+pPKzq6eJ+WNj8rrNIc89pxFzf1Wqmhkpqhhu3PmblDXAkm4/3UmkkhFLkniL39vrNuCb6DwspDK1kRvSUEULvxHUhRnY1YhBHFiFQ7UEuDmkcCRfzVqweqEWF0sbj1mxgFVMQummMspLnu3n9bl04Hva0AaAaBEuYtLaoHitjZwVX4pnqXHK5VHYEgKyDlzmSlb2yFBLuvbrQ16zDkGxFiCiDJLIiDyy8LVkiDAsCxMQPBbUQRzTg8FrdSNPBTLJZBznULTwWp2HMPyrq2TKg4rsKYflWp2EM/Cu9kCZAgrxwdn4VgcGb+FWPZhebMckFd/c7fwr0YSB8qsOzHJNkOSDgjDAOC2Nw+3BdrZDkmzCDlNo7cFtbTW4LobML3IEENsNlsbHZSMi9yoNIaswFnlXtkGICLKyIPUREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//Z", url: "https://elevatestores.in/collections/shop-all/products/manga-pop-flip-joint-case" }
];


// =============================================
// PSYCHEDELIC CANVAS — full kaleidoscope mode
// =============================================
function TripBg() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let f = 0, aid;
    const rs = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    rs(); window.addEventListener("resize", rs);

    const draw = () => {
      f++;
      const w = cv.width, h = cv.height, t = f * 0.004;

      // Fade trail — faster clear for subtler background
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(0, 0, w, h);

      // === PLASMA FIELD — dimmed hue cycling blobs ===
      for (let i = 0; i < 5; i++) {
        const phase = t * (0.15 + i * 0.06) + i * 1.3;
        const x = w * (0.5 + 0.35 * Math.sin(phase) * Math.cos(phase * 0.3 + i));
        const y = h * (0.5 + 0.35 * Math.cos(phase * 0.7) * Math.sin(phase * 0.5 + i * 0.8));
        const r = Math.max(1, 80 + 80 * Math.sin(t * 0.3 + i * 0.9));
        const hue = (f * 0.3 + i * 52) % 360;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${hue},80%,50%,0.04)`);
        g.addColorStop(0.5, `hsla(${hue + 30},70%,40%,0.015)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // === SPIROGRAPH / SACRED GEOMETRY — very subtle ===
      ctx.save();
      ctx.translate(w * 0.5, h * 0.38);
      ctx.globalAlpha = 0.03;
      for (let layer = 0; layer < 3; layer++) {
        const lr = 120 + layer * 60;
        const pts = 200;
        const spdA = (1 + layer * 0.5);
        const spdB = (3 + layer * 1.7);
        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const a = (j / pts) * Math.PI * 2;
          const px = Math.cos(a * spdA + t * 0.2) * lr + Math.cos(a * spdB + t * 0.15) * (lr * 0.4);
          const py = Math.sin(a * spdA + t * 0.2) * lr + Math.sin(a * spdB + t * 0.15) * (lr * 0.4);
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        const hue = (f * 0.5 + layer * 120) % 360;
        ctx.strokeStyle = `hsla(${hue},80%,55%,1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // === MANDALA RINGS — ghostly ===
      ctx.save();
      ctx.translate(w * 0.5, h * 0.38);
      for (let ring = 0; ring < 4; ring++) {
        const radius = 40 + ring * 45 + 10 * Math.sin(t * 0.8 + ring);
        const petals = 6 + ring * 2;
        ctx.beginPath();
        for (let p = 0; p <= petals * 2; p++) {
          const a = (p / (petals * 2)) * Math.PI * 2 + t * 0.05 * (ring % 2 === 0 ? 1 : -1);
          const wobble = radius + 8 * Math.sin(a * petals + t);
          const px = Math.cos(a) * wobble;
          const py = Math.sin(a) * wobble;
          p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        const hue = (f * 0.4 + ring * 72) % 360;
        ctx.strokeStyle = `hsla(${hue},80%,50%,0.03)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // === SWIRLING PARTICLES — fewer, dimmer ===
      for (let i = 0; i < 18; i++) {
        const angle = t * (0.5 + i * 0.03) + i * 2.4;
        const dist = 50 + (i * 17 + f * 0.08) % 300;
        const px = w * 0.5 + Math.cos(angle) * dist + Math.sin(t + i) * 40;
        const py = h * 0.38 + Math.sin(angle) * dist + Math.cos(t * 0.7 + i) * 40;
        const sz = Math.max(0.5, 0.8 + 1.2 * Math.sin(f * 0.02 + i * 0.5));
        const hue = (f * 0.6 + i * 25) % 360;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},80%,60%,${0.12 + 0.12 * Math.sin(f * 0.03 + i)})`;
        ctx.fill();
      }

      // === WARP WAVES — whisper thin ===
      for (let wave = 0; wave < 2; wave++) {
        ctx.beginPath();
        const baseY = h * 0.75 + wave * 50;
        for (let x = 0; x <= w; x += 4) {
          const y = baseY + Math.sin(x * 0.008 + t * (1 + wave * 0.3) + wave * 2) * 15 + Math.sin(x * 0.02 + t * 2) * 5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const hue = (f * 0.5 + wave * 120) % 360;
        ctx.strokeStyle = `hsla(${hue},70%,50%,0.02)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      aid = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(aid); window.removeEventListener("resize", rs); };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={ref} style={{ width: "100%", height: "100%" }} />
      {/* Noise grain */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      {/* Vignette — stronger to keep edges dark */}
      <div style={{ position: "absolute", inset: 0, background: "transparent" }} />
    </div>
  );
}

// =============================================
// RAINBOW BORDER CARD — animated hue cycling
// =============================================
function Card({ children, style = {}, onClick, intense }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: intense ? "#F7F6F3" : "#FFFFFF", borderRadius: 8, position: "relative",
        border: `1px solid ${h ? "#D3D1CB" : "#EBEBEA"}`,
        boxShadow: h && onClick ? "0 2px 8px rgba(15,15,15,0.04)" : "none",
        transition: "all 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden", ...style,
      }}
    >
      {children}
    </div>
  );
}

// =============================================
// PULSING NEON BUTTON
// =============================================
function Btn({ children, color = "#0F7B6C", onClick, disabled, full, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: "8px 16px", borderRadius: 6, border: "none",
        background: disabled ? "#EBEBEA" : (h ? "#0A6359" : "#0F7B6C"),
        color: disabled ? "#9B9B9B" : "#FFFFFF",
        fontSize: 14, fontWeight: 500,
        fontFamily: "'Inter',sans-serif",
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.15s ease",
        width: full ? "100%" : "auto",
        ...style,
      }}
    >{children}</button>
  );
}

// =============================================
// ONBOARDING
// =============================================
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [interests, setInterests] = useState([]);
  const [goal, setGoal] = useState("");
  const allI = ["Art","Writing","Music","Design","Entrepreneurship","Philosophy","Photography","Dance"];
  const goals = ["Create daily","Build a portfolio","Find my voice","Connect with creators","Start a project","Explore ideas"];
  const toggle = i => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        {/* Pulsing kaleidoscope logo */}
        <div style={{ position: "relative", width: 140, height: 160, margin: "0 auto 8px" }}>
          <div className="rainbow-spin" style={{ position: "absolute", left: 20, top: 10, width: 100, height: 100, borderRadius: "50%", opacity: 0.4, filter: "blur(25px)" }} />
          <div className="rainbow-spin-reverse" style={{ position: "absolute", left: 30, top: 20, width: 80, height: 80, borderRadius: "50%", opacity: 0.25, filter: "blur(15px)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", animation: "floatTrip 3s ease-in-out infinite", paddingTop: 8 }}>
            <ElevateBrand size={100} color={C.cyan} glow style={{ filter: `drop-shadow(0 0 10px rgba(27,94,59,0.2))` }} />
          </div>
        </div>

        <h1 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Elevation Lab</h1>
        <p className="text-glow-pulse" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 52, color: C.gold }}>
          ✦ Elevate your mind · Create something real ✦
        </p>

        {step === 0 && (
          <div style={{ animation: "warpIn 0.7s ease" }}>
            {!isLogin && (
              <>
                <label style={{ display: "block", textAlign: "left", color: C.textSecondary, fontSize: 11, marginBottom: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>YOUR NAME</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                  className="input-glow"
                  style={{ width: "100%", padding: "14px 18px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 16, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box", backdropFilter: "blur(10px)", marginBottom: 12 }}
                />
              </>
            )}
            <label style={{ display: "block", textAlign: "left", color: C.textSecondary, fontSize: 11, marginBottom: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              className="input-glow"
              style={{ width: "100%", padding: "14px 18px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 16, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box", backdropFilter: "blur(10px)", marginBottom: 12 }}
            />
            <label style={{ display: "block", textAlign: "left", color: C.textSecondary, fontSize: 11, marginBottom: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>PASSWORD</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" type="password"
              className="input-glow"
              style={{ width: "100%", padding: "14px 18px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 16, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box", backdropFilter: "blur(10px)" }}
            />
            {authError && <p style={{ color: C.magenta, fontSize: 11, fontFamily: "'Space Mono', monospace", marginTop: 10, textAlign: "left" }}>{authError}</p>}
            <div style={{ marginTop: 24 }}>
              {isLogin ? (
                <Btn onClick={async () => {
                  setAuthError(""); setAuthLoading(true);
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  setAuthLoading(false);
                  if (error) setAuthError(error.message);
                  else onComplete(email.split("@")[0]);
                }} disabled={!email.trim() || !password.trim() || authLoading} full color={C.cyan}>
                  {authLoading ? "Signing in..." : "Sign In →"}
                </Btn>
              ) : (
                <Btn onClick={() => {
                  if (!name.trim() || !email.trim() || !password.trim()) return;
                  setStep(1);
                }} disabled={!name.trim() || !email.trim() || password.length < 6} full color={C.cyan}>
                  Continue →
                </Btn>
              )}
            </div>
            <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace", marginTop: 16, cursor: "pointer" }}
              onClick={() => { setIsLogin(!isLogin); setAuthError(""); }}>
              {isLogin ? "New here? Sign up" : "Already have an account? Sign in"}
            </p>
          </div>
        )}
        {step === 1 && (
          <div style={{ animation: "warpIn 0.7s ease" }}>
            <p style={{ color: C.textSecondary, fontSize: 12, marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>What sparks your creativity?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {allI.map((item, idx) => {
                const a = interests.includes(item);
                const hue = idx * 45;
                return (<button key={item} onClick={() => toggle(item)} className={a ? "chip-active" : ""} style={{
                  padding: "10px 20px", borderRadius: 28,
                  border: `1px solid ${a ? `hsla(${hue},100%,65%,0.7)` : C.border}`,
                  background: a ? `hsla(${hue},100%,50%,0.15)` : "transparent",
                  color: a ? `hsl(${hue},100%,75%)` : C.textSecondary,
                  fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace",
                  transition: "all 0.3s",
                  boxShadow: a ? `0 0 20px hsla(${hue},100%,60%,0.3), inset 0 0 15px hsla(${hue},100%,60%,0.1)` : "none",
                  textShadow: a ? `0 0 12px hsla(${hue},100%,70%,0.8)` : "none",
                }}>{item}</button>);
              })}
            </div>
            <div style={{ marginTop: 28 }}><Btn onClick={() => interests.length > 0 && setStep(2)} disabled={interests.length === 0} full color={C.magenta}>Continue →</Btn></div>
          </div>
        )}
        {step === 2 && (
          <div style={{ animation: "warpIn 0.7s ease" }}>
            <p style={{ color: C.textSecondary, fontSize: 12, marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>Choose your creative intention</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {goals.map((g, i) => {
                const a = goal === g; const hue = i * 60;
                return (<button key={g} onClick={() => setGoal(g)} style={{
                  padding: "14px 20px", borderRadius: 14, textAlign: "left",
                  border: `1px solid ${a ? `hsla(${hue},100%,60%,0.5)` : C.border}`,
                  background: a ? `hsla(${hue},100%,50%,0.1)` : C.bgCard,
                  color: a ? `hsl(${hue},100%,75%)` : C.textSecondary,
                  fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace",
                  transition: "all 0.3s", backdropFilter: "blur(8px)",
                  boxShadow: a ? `0 0 25px hsla(${hue},100%,60%,0.2)` : "none",
                  textShadow: a ? `0 0 10px hsla(${hue},100%,70%,0.6)` : "none",
                }}>{g}</button>);
              })}
            </div>
            <div style={{ marginTop: 28 }}><Btn onClick={async () => {
                  if (!goal) return;
                  setAuthError(""); setAuthLoading(true);
                  const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
                  setAuthLoading(false);
                  if (error) { setAuthError(error.message); setStep(0); }
                  else {
                    // Update profile with interests and goal
                    const { data: { user: u } } = await supabase.auth.getUser();
                    if (u) {
                      await supabase.from("profiles").update({ interests, creative_goal: goal, name }).eq("id", u.id);
                    }
                    onComplete(name);
                  }
                }} disabled={!goal || authLoading} full color={C.purple}>{authLoading ? "Creating account..." : "✦ Enter the Lab ✦"}</Btn></div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
          {[0,1,2].map(i => (<div key={i} className={step === i ? "dot-active" : ""} style={{ width: step === i ? 32 : 8, height: 8, borderRadius: 4, transition: "all 0.5s cubic-bezier(.25,.8,.25,1)" }} />))}
        </div>
      </div>
    </div>
  );
}

// =============================================
// SESSION
// =============================================
function Session({ onClose, onSave }) {
  const [type, setType] = useState(null);
  const [tl, setTl] = useState(0);
  const [run, setRun] = useState(false);
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState("");
  const iRef = useRef(null);
  const ss = [{ l: "Idea Sprint", d: 20*60, c: C.gold, i: "⚡" },{ l: "Sketch Flow", d: 30*60, c: C.cyan, i: "🌀" },{ l: "Deep Create", d: 45*60, c: C.purple, i: "🔮" }];
  useEffect(() => {
    if (run && tl > 0) iRef.current = setInterval(() => setTl(t => t-1), 1000);
    else if (tl === 0 && type !== null && run) { setDone(true); setRun(false); }
    return () => clearInterval(iRef.current);
  }, [run, tl]);
  const fmt = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const prog = type !== null ? 1 - (tl / ss[type].d) : 0;

  if (done) return (
    <div style={{ padding: 24, animation: "warpIn 0.5s" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12, animation: "floatTrip 2s ease-in-out infinite", filter: "drop-shadow(0 0 30px rgba(0,255,204,0.6))" }}>✨</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 22, fontWeight: 700 }}>Session Complete</h2>
      </div>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Log your visions..." className="input-glow" style={{ width: "100%", minHeight: 120, padding: 16, background: "rgba(237,229,216,0.8)", border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 13, fontFamily: "'Space Mono', monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      <div style={{ marginTop: 16 }}><Btn onClick={() => { if (onSave) onSave(ss[type].l, ss[type].d / 60, notes); onClose(); }} full color={C.cyan}>Save & Close</Btn></div>
    </div>
  );
  if (type === null) return (
    <div style={{ padding: 24, animation: "warpIn 0.5s" }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Choose your flow</h2>
      {ss.map((s, i) => (
        <Card key={i} onClick={() => { setType(i); setTl(s.d); }} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 28, filter: `drop-shadow(0 0 15px ${s.c}80)`, animation: "floatTrip 3s ease-in-out infinite", animationDelay: `${i*0.3}s` }}>{s.i}</span>
          <div><div style={{ color: C.textPrimary, fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif" }}>{s.l}</div><div style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{s.d/60} min</div></div>
        </Card>
      ))}
    </div>
  );
  const s = ss[type];
  return (
    <div style={{ padding: 24, textAlign: "center", animation: "warpIn 0.5s" }}>
      <p className="text-glow-pulse" style={{ color: s.c, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>{s.l}</p>
      <div style={{ position: "relative", width: 210, height: 210, margin: "0 auto 24px" }}>
        <svg viewBox="0 0 210 210" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="105" cy="105" r="94" fill="none" stroke="rgba(196,74,255,0.08)" strokeWidth="3" />
          <circle cx="105" cy="105" r="94" fill="none" stroke="url(#tripTimer)" strokeWidth="5"
            strokeDasharray={591} strokeDashoffset={591*(1-prog)} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 12px ${s.c}80) drop-shadow(0 0 25px ${s.c}40)` }} />
          <defs><linearGradient id="tripTimer" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.cyan}/><stop offset="33%" stopColor={s.c}/><stop offset="66%" stopColor={C.magenta}/><stop offset="100%" stopColor={C.cyan}/></linearGradient></defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-glow-pulse" style={{ fontFamily: "'Space Mono', monospace", fontSize: 42, color: C.textPrimary }}>{fmt(tl)}</div>
        </div>
      </div>
      <button onClick={() => setRun(!run)} className="btn-pulse" style={{ width: 68, height: 68, borderRadius: "50%", border: `2px solid ${s.c}50`, background: `radial-gradient(circle, ${s.c}20, transparent)`, color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${s.c}35, 0 0 80px ${s.c}15` }}>
        <span style={{ width: 26, height: 26 }}>{run ? <Icons.Pause /> : <Icons.Play />}</span>
      </button>
      <p style={{ color: C.textMuted, fontSize: 10, marginTop: 16, fontFamily: "'Space Mono', monospace" }}>{run ? "~ dissolve into the flow ~" : "tap to begin"}</p>
    </div>
  );
}

// =============================================
// AI CHAT
// =============================================
function AI() {
  const [msgs, setMsgs] = useState([{ r: "ai", t: "Hey ✦ Share an idea and I'll help expand it into new dimensions." }]);
  const [inp, setInp] = useState("");
  const aiR = ["Consider the tension between order and chaos — what if the chaotic part leads?","Three expansions: 1) emotional core, 2) visual metaphor, 3) cosmic narrative.","Layer in synesthesia — what does this idea taste like? Sound like?","This has fractal energy! Zoom into one detail, then all the way out.","Write a 6-word version, then 60 words. Constraints reveal hidden essence."];
  const send = () => { if (!inp.trim()) return; const nm = [...msgs, { r: "user", t: inp }]; setInp(""); setMsgs(nm); setTimeout(() => setMsgs([...nm, { r: "ai", t: aiR[Math.floor(Math.random()*aiR.length)] }]), 700); };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.r === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "12px 16px", borderRadius: 16, borderBottomRightRadius: m.r === "user" ? 4 : 16, borderBottomLeftRadius: m.r === "ai" ? 4 : 16, background: m.r === "user" ? `linear-gradient(135deg, ${C.purple}30, ${C.magenta}18)` : C.bgCard, border: `1px solid ${m.r === "user" ? C.purple + "25" : C.border}`, color: C.textPrimary, fontSize: 12, lineHeight: 1.7, fontFamily: "'Space Mono', monospace", animation: "warpIn 0.3s", backdropFilter: "blur(8px)", boxShadow: m.r === "user" ? `0 0 15px ${C.purple}15` : "none" }}>{m.t}</div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Share an idea..." className="input-glow" style={{ flex: 1, padding: "12px 16px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", outline: "none" }} />
        <button onClick={send} className="btn-pulse" style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 10px rgba(27,94,59,0.2)` }}>
          <span style={{ width: 18, height: 18 }}><Icons.Send /></span>
        </button>
      </div>
    </div>
  );
}

// =============================================
// MAIN APP
// =============================================
export default function App() {
  const [scr, setScr] = useState("loading");
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [ni, setNi] = useState("");
  const [nt, setNt] = useState("");
  const [showS, setShowS] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [intent, setIntent] = useState("");
  const [refs, setRefs] = useState([]);
  const [nr, setNr] = useState("");
  const [rp] = useState(RPROMPTS[Math.floor(Math.random()*RPROMPTS.length)]);
  const [dp] = useState(PROMPTS[Math.floor(Math.random()*PROMPTS.length)]);
  const [shopCat, setShopCat] = useState("All");
  const [sessionCount, setSessionCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [circles, setCircles] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({});
  const [myReactions, setMyReactions] = useState({});
  const [profilePage, setProfilePage] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  // Check auth on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        setScr("app");
        // Load profile name
        supabase.from("profiles").select("name").eq("id", session.user.id).single()
          .then(({ data }) => { if (data?.name) setUser(data.name); });
      } else {
        setScr("onboard");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setAuthUser(session.user); }
      else { setAuthUser(null); setScr("onboard"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase when logged in
  useEffect(() => {
    if (!authUser) return;
    const uid = authUser.id;
    supabase.from("ideas").select("*").eq("user_id", uid).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setIdeas(data.map(d => ({ id: d.id, text: d.content, time: new Date(d.created_at).toLocaleDateString(), tag: d.tag }))); });
    supabase.from("tasks").select("*").eq("user_id", uid).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setTasks(data.map(d => ({ id: d.id, text: d.title, done: d.status === "done", p: d.is_priority }))); });
    supabase.from("reflections").select("*").eq("user_id", uid).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRefs(data.map(d => ({ id: d.id, text: d.content, date: new Date(d.created_at).toLocaleDateString() }))); });
    supabase.from("sessions").select("id").eq("user_id", uid)
      .then(({ data }) => { if (data) setSessionCount(data.length); });
    // Load all posts from all users for community feed
    supabase.from("posts").select("*, profiles(name)").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setPosts(data); });
    // Load circles from database
    supabase.from("circles").select("*").order("member_count", { ascending: false })
      .then(({ data }) => { if (data) setCircles(data); });
    // Load user's joined circles
    supabase.from("circle_members").select("circle_id").eq("user_id", uid)
      .then(({ data }) => { if (data) setMyCircles(data.map(d => d.circle_id)); });
    // Load reaction counts for all posts
    supabase.from("reactions").select("post_id, reaction_type")
      .then(({ data }) => {
        if (data) {
          const counts = {};
          const mine = {};
          data.forEach(r => {
            if (!counts[r.post_id]) counts[r.post_id] = { appreciation: 0, inspiration: 0, curiosity: 0 };
            counts[r.post_id][r.reaction_type]++;
            if (r.user_id === uid) {
              if (!mine[r.post_id]) mine[r.post_id] = {};
              mine[r.post_id][r.reaction_type] = true;
            }
          });
          setReactionCounts(counts);
          setMyReactions(mine);
        }
      });
    // Load profile for editing
    supabase.from("profiles").select("*").eq("id", uid).single()
      .then(({ data }) => { if (data) { setEditName(data.name || ""); setEditBio(data.bio || ""); } });
  }, [authUser]);

  // CRUD with Supabase
  const togT = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    await supabase.from("tasks").update({ status: task.done ? "pending" : "done" }).eq("id", id);
  };
  const addI = async () => {
    if (!ni.trim() || !authUser) return;
    const { data } = await supabase.from("ideas").insert({ user_id: authUser.id, content: ni, tag: "Creative" }).select().single();
    if (data) setIdeas([{ id: data.id, text: data.content, time: "Now", tag: data.tag }, ...ideas]);
    setNi("");
  };
  const addT = async () => {
    if (!nt.trim() || !authUser) return;
    const { data } = await supabase.from("tasks").insert({ user_id: authUser.id, title: nt }).select().single();
    if (data) setTasks([{ id: data.id, text: data.title, done: false, p: false }, ...tasks]);
    setNt("");
  };
  const addR = async () => {
    if (!nr.trim() || !authUser) return;
    const { data } = await supabase.from("reflections").insert({ user_id: authUser.id, content: nr, prompt: rp }).select().single();
    if (data) setRefs([{ id: data.id, text: data.content, date: "Now" }, ...refs]);
    setNr("");
  };

  // Post to community feed
  const addPost = async () => {
    if (!newPost.trim() || !authUser) return;
    const { data } = await supabase.from("posts").insert({ user_id: authUser.id, caption: newPost, post_type: "thought" }).select("*, profiles(name)").single();
    if (data) setPosts([data, ...posts]);
    setNewPost("");
  };
  // Join/leave circle
  const toggleCircle = async (circleId) => {
    if (!authUser) return;
    if (myCircles.includes(circleId)) {
      await supabase.from("circle_members").delete().eq("circle_id", circleId).eq("user_id", authUser.id);
      setMyCircles(myCircles.filter(id => id !== circleId));
    } else {
      await supabase.from("circle_members").insert({ circle_id: circleId, user_id: authUser.id });
      setMyCircles([...myCircles, circleId]);
    }
  };
  // React to a post
  const reactToPost = async (postId, reactionType) => {
    if (!authUser) return;
    const alreadyReacted = myReactions[postId]?.[reactionType];
    if (alreadyReacted) {
      await supabase.from("reactions").delete().eq("post_id", postId).eq("user_id", authUser.id).eq("reaction_type", reactionType);
      setMyReactions(prev => { const n = {...prev}; if (n[postId]) { delete n[postId][reactionType]; } return n; });
      setReactionCounts(prev => { const n = {...prev}; if (n[postId]) n[postId][reactionType] = Math.max(0, (n[postId][reactionType] || 1) - 1); return n; });
    } else {
      await supabase.from("reactions").insert({ post_id: postId, user_id: authUser.id, reaction_type: reactionType });
      setMyReactions(prev => { const n = {...prev}; if (!n[postId]) n[postId] = {}; n[postId][reactionType] = true; return n; });
      setReactionCounts(prev => { const n = {...prev}; if (!n[postId]) n[postId] = { appreciation: 0, inspiration: 0, curiosity: 0 }; n[postId][reactionType]++; return n; });
    }
  };

  // Loading screen
  if (scr === "loading") return (<div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><TripBg /><div className="text-glow-pulse" style={{ color: C.cyan, fontFamily: "'Syne', sans-serif", fontSize: 20, position: "relative", zIndex: 1 }}>Loading...</div><style>{CSS}</style></div>);

  if (scr === "onboard") return (<div style={{ background: C.bg, minHeight: "100vh" }}><TripBg /><Onboarding onComplete={n => { setUser(n); setScr("app"); }} /><style>{CSS}</style></div>);

  const Modal = ({ children, onClose, title }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(44,36,24,0.5)", backdropFilter: "blur(16px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, maxHeight: "85vh", background: "linear-gradient(180deg,rgba(250,247,242,0.97),rgba(245,239,230,0.99))", borderRadius: "22px 22px 0 0", border: `1px solid ${C.border}`, borderBottom: "none", overflow: "auto", animation: "slideUp 0.4s cubic-bezier(.25,.8,.25,1)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ color: C.textPrimary, fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", width: 24, height: 24 }}><Icons.X /></button>
        </div>
        {children}
      </div>
    </div>
  );

  const NTab = ({ icon: Ic, label, id }) => { const a = tab === id; return (
    <button onClick={() => setTab(id)} className={a ? "nav-active" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", color: a ? C.cyan : C.textMuted, cursor: "pointer", padding: "6px 0", minWidth: 46, transition: "all 0.3s" }}>
      <span style={{ width: 20, height: 20 }}><Ic /></span>
      <span style={{ fontSize: 8, fontFamily: "'Space Mono', monospace", fontWeight: a ? 700 : 400, letterSpacing: "0.04em" }}>{label}</span>
    </button>
  ); };

  const renderHome = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <p style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>Welcome back</p>
          <h1 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: 0 }}>{user}</h1>
        </div>
        <div className="rainbow-spin" style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ElevateLogo size={22} color={C.cyan} style={{ marginTop: -2 }} />
          </div>
        </div>
      </div>

      <Card intense style={{ padding: 20, marginBottom: 20 }}>
        <p className="text-glow-pulse" style={{ color: C.gold, fontSize: 14, fontFamily: "'Syne', sans-serif", fontStyle: "italic", margin: "0 0 12px" }}>"{dp}"</p>
        <input value={intent} onChange={e => setIntent(e.target.value)} placeholder="Set your intention..." className="input-glow" style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, color: C.textPrimary, fontSize: 14, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box" }} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {[{ l: "Capture Idea", i: "💡", a: () => setTab("ideas"), c: C.gold },{ l: "Start Session", i: "🌀", a: () => setShowS(true), c: C.cyan },{ l: "AI Assistant", i: "🔮", a: () => setShowAI(true), c: C.purple },{ l: "Reflect", i: "🪞", a: () => setTab("reflect"), c: C.magenta }].map((q, idx) => (
          <Card key={idx} onClick={q.a} style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24, filter: "none", animation: "floatTrip 3s ease-in-out infinite", animationDelay: `${idx*0.4}s` }}>{q.i}</span>
            <span style={{ color: C.textPrimary, fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{q.l}</span>
          </Card>
        ))}
      </div>

      <h3 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Today's Priorities</h3>
      <p style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: "0 0 12px" }}>{tasks.filter(t => !t.done).length} remaining</p>
      {tasks.filter(t => t.p || !t.done).slice(0,3).map(t => (
        <Card key={t.id} onClick={() => togT(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${t.done ? C.cyan : C.textMuted}`, background: t.done ? `linear-gradient(135deg,${C.cyan},${C.purple})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: t.done ? `0 0 12px ${C.cyan}50, 0 0 25px ${C.cyan}20` : "none", transition: "all 0.4s" }}>{t.done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}</div>
          <span style={{ color: t.done ? C.textMuted : C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.text}</span>
          {t.p && <span style={{ color: C.gold, fontSize: 10, textShadow: `0 0 10px ${C.gold}`, animation: "floatTrip 2s ease-in-out infinite" }}>★</span>}
        </Card>
      ))}

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Weekly Challenge</h3>
        <Card intense style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 16, height: 16, color: C.gold, filter: `drop-shadow(0 0 8px ${C.gold})` }}><Icons.Trophy /></span>
            <span className="text-glow-pulse" style={{ color: C.gold, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>{CHALLENGES[0].days}d left</span>
          </div>
          <h4 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 18, margin: "0 0 4px", fontWeight: 700 }}>{CHALLENGES[0].title}</h4>
          <p style={{ color: C.textSecondary, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: "0 0 8px" }}>{CHALLENGES[0].desc}</p>
          <span style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{CHALLENGES[0].entries} entries</span>
        </Card>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Elevation Planner</h2>
      <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>Plan your creative day</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={nt} onChange={e => setNt(e.target.value)} onKeyDown={e => e.key === "Enter" && addT()} placeholder="Add a task..." className="input-glow" style={{ flex: 1, padding: "12px 16px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", outline: "none" }} />
        <button onClick={addT} className="btn-pulse" style={{ width: 44, height: 44, borderRadius: 14, border: "none", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 10px rgba(27,94,59,0.2)` }}><span style={{ width: 20, height: 20 }}><Icons.Plus /></span></button>
      </div>
      {tasks.map(t => (
        <Card key={t.id} onClick={() => togT(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${t.done ? C.cyan : C.textMuted}`, background: t.done ? `linear-gradient(135deg,${C.cyan},${C.purple})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: t.done ? `0 0 12px ${C.cyan}50` : "none", transition: "all 0.4s" }}>{t.done && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}</div>
          <span style={{ color: t.done ? C.textMuted : C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.text}</span>
        </Card>
      ))}
      <Card intense style={{ marginTop: 24, padding: 18, display: "flex", justifyContent: "space-around" }}>
        {[{ l: "Done", v: tasks.filter(t => t.done).length, c: C.cyan },{ l: "Open", v: tasks.filter(t => !t.done).length, c: C.gold },{ l: "Total", v: tasks.length, c: C.textPrimary }].map((s,i) => (
          <div key={i} style={{ textAlign: "center" }}><div className="text-glow-pulse" style={{ color: s.c, fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{s.v}</div><div style={{ color: C.textMuted, fontSize: 9, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div></div>
        ))}
      </Card>
    </div>
  );

  const renderIdeas = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Idea Notebook</h2>
      <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>Capture every spark from the void</p>
      <Card intense style={{ padding: 16, marginBottom: 24 }}>
        <textarea value={ni} onChange={e => setNi(e.target.value)} placeholder="What's flowing through your mind?" rows={3} className="input-glow" style={{ width: "100%", padding: 0, background: "transparent", border: "none", color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}><Btn onClick={addI} disabled={!ni.trim()} color={C.gold} style={{ padding: "8px 20px", fontSize: 11 }}>✦ Capture</Btn></div>
      </Card>
      {ideas.map((idea, idx) => {
        const hue = idx * 75;
        return (
          <Card key={idea.id} style={{ padding: 16, marginBottom: 10, borderLeft: `3px solid hsla(${hue},100%,60%,0.4)` }}>
            <p style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", margin: "0 0 10px", lineHeight: 1.6 }}>{idea.text}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ padding: "3px 10px", borderRadius: 12, background: `hsla(${hue},100%,50%,0.12)`, color: `hsl(${hue},100%,70%)`, fontSize: 10, fontFamily: "'Space Mono', monospace", textShadow: `0 0 8px hsla(${hue},100%,70%,0.5)` }}>{idea.tag}</span>
              <span style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{idea.time}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderFeed = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Creative Feed</h2>
      {/* Create a post */}
      <Card intense style={{ padding: 16, marginBottom: 20 }}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share something creative with the community..." rows={3} className="input-glow" style={{ width: "100%", padding: 0, background: "transparent", border: "none", color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <Btn onClick={addPost} disabled={!newPost.trim()} color={C.magenta} style={{ padding: "8px 20px", fontSize: 11 }}>✦ Post</Btn>
        </div>
      </Card>
      {/* Posts from all users */}
      {posts.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: C.textMuted, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>No posts yet. Be the first to share!</p>
        </div>
      )}
      {posts.map((p, i) => {
        const hue = (i * 70) % 360;
        const authorName = p.profiles?.name || "Anonymous";
        const timeAgo = new Date(p.created_at).toLocaleDateString();
        return (
          <Card key={p.id} style={{ marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsla(${hue},80%,50%,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: `hsl(${hue},80%,70%)`, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{authorName[0]?.toUpperCase()}</div>
                <span style={{ color: C.textPrimary, fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{authorName}</span>
                <span style={{ color: C.textMuted, fontSize: 9, fontFamily: "'Space Mono', monospace", marginLeft: "auto" }}>{timeAgo}</span>
              </div>
              <p style={{ color: C.textSecondary, fontSize: 12, fontFamily: "'Space Mono', monospace", lineHeight: 1.7, margin: "0 0 14px" }}>{p.caption}</p>
              <div style={{ display: "flex", gap: 8 }}>
                {[{e:"🙏",t:"appreciation"},{e:"✨",t:"inspiration"},{e:"🤔",t:"curiosity"}].map(r => {
                  const active = myReactions[p.id]?.[r.t];
                  const count = reactionCounts[p.id]?.[r.t] || 0;
                  return (
                    <button key={r.t} onClick={() => reactToPost(p.id, r.t)} style={{ display: "flex", alignItems: "center", gap: 4, background: active ? `${C.green}15` : "none", border: active ? `1px solid ${C.green}40` : "1px solid transparent", color: active ? C.cyan : C.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "'Space Mono', monospace", padding: "5px 10px", borderRadius: 16, transition: "all 0.3s" }}>
                      <span>{r.e}</span>
                      {count > 0 && <span style={{ fontSize: 10 }}>{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderCircles = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Creative Circles</h2>
      <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>Find your creative tribe</p>
      {circles.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: C.textMuted, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>Loading circles...</p>
        </div>
      )}
      {circles.map((c, i) => {
        const hue = i * 60;
        const joined = myCircles.includes(c.id);
        const gradients = [`linear-gradient(135deg,${C.purple},${C.magenta})`,`linear-gradient(135deg,${C.gold},${C.orange})`,`linear-gradient(135deg,${C.cyan},${C.purple})`,`linear-gradient(135deg,${C.magenta},${C.orange})`,`linear-gradient(135deg,${C.cyan},${C.lime})`,`linear-gradient(135deg,${C.gold},${C.magenta})`];
        return (
          <Card key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: gradients[i % 6], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: `0 2px 10px hsla(${hue},40%,40%,0.15)` }}>{c.emoji || "🎨"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{c.name}</div>
              <div style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{c.description || ""}</div>
            </div>
            <Btn onClick={() => toggleCircle(c.id)} color={joined ? C.textMuted : `hsl(${hue},100%,60%)`} style={{ padding: "6px 16px", fontSize: 10, borderRadius: 20 }}>{joined ? "Joined" : "Join"}</Btn>
          </Card>
        );
      })}
    </div>
  );

  const renderReflect = () => (
    <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
      <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Reflection Journal</h2>
      <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>Look inward, create outward</p>
      <Card intense style={{ padding: 20, marginBottom: 20 }}>
        <p className="text-glow-pulse" style={{ color: C.gold, fontSize: 14, fontFamily: "'Syne', sans-serif", fontStyle: "italic", margin: 0 }}>"{rp}"</p>
      </Card>
      <Card style={{ padding: 16, marginBottom: 24 }}>
        <textarea value={nr} onChange={e => setNr(e.target.value)} placeholder="Write your reflection..." rows={4} className="input-glow" style={{ width: "100%", padding: 0, background: "transparent", border: "none", color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", resize: "none", outline: "none", lineHeight: 1.7, boxSizing: "border-box" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}><Btn onClick={addR} disabled={!nr.trim()} color={C.purple} style={{ padding: "8px 20px", fontSize: 11 }}>Save</Btn></div>
      </Card>
      {refs.map((r, i) => (
        <Card key={i} style={{ padding: 16, marginBottom: 10, borderLeft: `3px solid ${C.purple}40` }}>
          <p style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", margin: "0 0 8px", lineHeight: 1.6 }}>{r.text}</p>
          <span style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{r.date}</span>
        </Card>
      ))}
    </div>
  );

  const renderProfile = () => {
    if (profilePage === "edit") return (
      <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setProfilePage(null)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 18, cursor: "pointer" }}>←</button>
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 20, fontWeight: 700, margin: 0 }}>Edit Profile</h2>
        </div>
        <label style={{ display: "block", color: C.textSecondary, fontSize: 11, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>NAME</label>
        <input value={editName} onChange={e => setEditName(e.target.value)} className="input-glow" style={{ width: "100%", padding: "12px 16px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 14, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
        <label style={{ display: "block", color: C.textSecondary, fontSize: 11, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>BIO</label>
        <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={4} className="input-glow" style={{ width: "100%", padding: "12px 16px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, color: C.textPrimary, fontSize: 13, fontFamily: "'Space Mono', monospace", outline: "none", boxSizing: "border-box", resize: "none", marginBottom: 16 }} />
        <label style={{ display: "block", color: C.textSecondary, fontSize: 11, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>EMAIL</label>
        <div style={{ padding: "12px 16px", background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 13, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>{authUser?.email || ""}</div>
        <Btn onClick={async () => { if (!authUser) return; await supabase.from("profiles").update({ name: editName, bio: editBio }).eq("id", authUser.id); setUser(editName); setProfilePage(null); }} full color={C.cyan}>Save Changes</Btn>
      </div>
    );
    if (profilePage === "guidelines") return (
      <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setProfilePage(null)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 18, cursor: "pointer" }}>←</button>
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 20, fontWeight: 700, margin: 0 }}>Community Guidelines</h2>
        </div>
        {[
          { t: "Be Creative & Supportive", d: "Encourage others. Give constructive feedback." },
          { t: "No Illegal Activity", d: "No selling, buying, or promoting illegal substances." },
          { t: "Respect Everyone", d: "No harassment, hate speech, or discrimination." },
          { t: "Keep It Mindful", d: "A space for creativity, productivity, and mindful living." },
          { t: "Original Content", d: "Share your own work. Credit others when inspired." },
          { t: "No Spam", d: "No promotional content, ads, or repetitive posts." },
          { t: "Report Issues", d: "Flag content that violates guidelines. Reviewed in 24hrs." },
        ].map((g, i) => (
          <Card key={i} style={{ padding: 16, marginBottom: 10 }}>
            <div style={{ color: C.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{g.t}</div>
            <div style={{ color: C.textSecondary, fontSize: 11, fontFamily: "'Space Mono', monospace", lineHeight: 1.6 }}>{g.d}</div>
          </Card>
        ))}
      </div>
    );
    if (profilePage === "about") return (
      <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setProfilePage(null)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 18, cursor: "pointer" }}>←</button>
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 20, fontWeight: 700, margin: 0 }}>About</h2>
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <ElevateBrand size={80} color={C.cyan} glow />
          <h3 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "16px 0 8px" }}>Elevation Lab</h3>
        </div>
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <p style={{ color: C.textSecondary, fontSize: 12, fontFamily: "'Space Mono', monospace", lineHeight: 1.7, margin: 0 }}>A creative productivity platform for transforming elevated thinking into meaningful creativity.</p>
        </Card>
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <p style={{ color: C.gold, fontSize: 13, fontFamily: "'Syne', sans-serif", fontStyle: "italic", margin: "0 0 8px" }}>"Don't just get high. Get elevated."</p>
          <p style={{ color: C.textSecondary, fontSize: 11, fontFamily: "'Space Mono', monospace", lineHeight: 1.6, margin: 0 }}>We promote creativity, productivity, art, community, and reflection.</p>
        </Card>
        <Card style={{ padding: 16 }}>
          <p style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: "0 0 4px" }}>Version 1.0.0 (MVP)</p>
          <p style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: "0 0 4px" }}>Website: elevatestores.in</p>
          <p style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: 0 }}>2026 Elevate. All rights reserved.</p>
        </Card>
      </div>
    );
    if (profilePage === "portfolio") return (
      <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setProfilePage(null)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 18, cursor: "pointer" }}>←</button>
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: C.textPrimary, fontSize: 20, fontWeight: 700, margin: 0 }}>Creator Portfolio</h2>
        </div>
        <Card intense style={{ padding: 20, textAlign: "center", marginBottom: 16 }}>
          <p style={{ color: C.textPrimary, fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 8 }}>Your Creative Showcase</p>
          <p style={{ color: C.textSecondary, fontSize: 11, fontFamily: "'Space Mono', monospace", lineHeight: 1.6, margin: 0 }}>Your posts from the Feed appear here!</p>
        </Card>
        {posts.filter(p => authUser && p.user_id === authUser.id).map((p) => (
          <Card key={p.id} style={{ padding: 14, marginBottom: 8 }}>
            <p style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", margin: "0 0 6px", lineHeight: 1.5 }}>{p.caption}</p>
            <span style={{ color: C.textMuted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{new Date(p.created_at).toLocaleDateString()}</span>
          </Card>
        ))}
      </div>
    );
    return (
      <div style={{ padding: "20px 16px 110px", animation: "warpIn 0.5s" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 14px" }}>
            <div className="rainbow-spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: 0.6, filter: "blur(15px)" }} />
            <div className="rainbow-spin-reverse" style={{ position: "absolute", inset: 8, borderRadius: "50%", opacity: 0.4, filter: "blur(10px)" }} />
            <div style={{ position: "absolute", inset: 5, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ElevateLogo size={40} color={C.cyan} glow style={{ filter: `drop-shadow(0 0 8px rgba(27,94,59,0.25))` }} />
            </div>
          </div>
          <h2 className="title-rainbow" style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>{user}</h2>
          <p style={{ color: C.textSecondary, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: "0 0 10px" }}>{editBio || "Creator · Thinker · Maker"}</p>
          <button onClick={() => setProfilePage("edit")} style={{ background: "none", border: `1px solid ${C.cyan}40`, borderRadius: 20, padding: "5px 16px", color: C.cyan, fontSize: 10, fontFamily: "'Space Mono', monospace", cursor: "pointer" }}>Edit Profile</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[{ l: "Ideas", v: ideas.length, c: C.gold },{ l: "Sessions", v: sessionCount, c: C.cyan },{ l: "Circles", v: myCircles.length, c: C.magenta }].map((s,i) => (
            <Card key={i} style={{ textAlign: "center", padding: "16px 8px" }}>
              <div className="text-glow-pulse" style={{ color: s.c, fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{s.v}</div>
              <div style={{ color: C.textMuted, fontSize: 9, fontFamily: "'Space Mono', monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
            </Card>
          ))}
        </div>
        <Card onClick={() => setProfilePage("portfolio")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🎨</span>
          <span style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", flex: 1 }}>Creator Portfolio</span>
          <span style={{ color: C.textMuted }}>→</span>
        </Card>
        <Card onClick={() => setProfilePage("guidelines")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <span style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", flex: 1 }}>Community Guidelines</span>
          <span style={{ color: C.textMuted }}>→</span>
        </Card>
        <Card onClick={() => setProfilePage("about")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🌿</span>
          <span style={{ color: C.textPrimary, fontSize: 12, fontFamily: "'Space Mono', monospace", flex: 1 }}>About Elevation Lab</span>
          <span style={{ color: C.textMuted }}>→</span>
        </Card>
        <Card onClick={async () => { await supabase.auth.signOut(); setScr("onboard"); setAuthUser(null); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", marginBottom: 8, marginTop: 16, border: `1px solid ${C.magenta}30` }}>
          <span style={{ color: C.magenta, fontSize: 12, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>Sign Out</span>
        </Card>
        <p style={{ textAlign: "center", marginTop: 28, color: C.textMuted, fontSize: 9, fontFamily: "'Space Mono', monospace", lineHeight: 1.5 }}>Elevation Lab promotes creativity,<br/>productivity, and mindful living.</p>
      </div>
    );
  };

  const tabs = { home: renderHome, tasks: renderTasks, ideas: renderIdeas, feed: renderFeed, circles: renderCircles, reflect: renderReflect, profile: renderProfile };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <TripBg />
      <div style={{ position: "relative", zIndex: 1 }}>{tabs[tab]?.() || renderHome()}</div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FFFFFF", backdropFilter: "blur(24px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "10px 4px", paddingBottom: "max(10px, env(safe-area-inset-bottom))", zIndex: 50 }}>
        <NTab icon={Icons.Home} label="Home" id="home" />
        <NTab icon={Icons.Check} label="Tasks" id="tasks" />
        <NTab icon={Icons.Bulb} label="Ideas" id="ideas" />
        <NTab icon={Icons.Users} label="Feed" id="feed" />
        <NTab icon={Icons.Star} label="Circles" id="circles" />
        <NTab icon={Icons.Book} label="Reflect" id="reflect" />
        <NTab icon={Icons.Settings} label="Profile" id="profile" />
      </div>
      {showS && <Modal title="✦ Creative Session" onClose={() => setShowS(false)}><Session onClose={() => setShowS(false)} onSave={async (type, mins, notes) => {
        if (!authUser) return;
        await supabase.from("sessions").insert({ user_id: authUser.id, session_type: type, duration_minutes: mins, notes });
        setSessionCount(prev => prev + 1);
      }} /></Modal>}
      {showAI && <Modal title="✨ AI Assistant" onClose={() => setShowAI(false)}><div style={{ height: 420 }}><AI /></div></Modal>}
      <style>{CSS}</style>
    </div>
  );
}
