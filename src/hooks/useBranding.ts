// ============================================
// Dynamic Branding Hook - Firebase থেকে সব নাম/লোগো লোড
// ============================================
import { useState, useEffect } from "react";
import { db, ref, onValue } from "@/lib/firebase";

export interface BrandingConfig {
  siteName: string;
  siteDescription: string;
  siteTagline: string;
  loginTitle: string;
  loginSubtitle: string;
  premiumTitle: string;
  footerText: string;
  footerCopyright: string;
  splashText: string;
  adminTitle: string;
  aboutTitle: string;
  logoUrl: string;           // Default logo (header, splash, etc.)
  playerLogoUrl: string;     // Video player loading logo
  playerName: string;        // Video player title (e.g. "NX CINEMA PLAYER")
  rsCardLabel: string;       // NX source card label
  anCardLabel: string;       // AnimeSalt source card label
}

const DEFAULT_BRANDING: BrandingConfig = {
  siteName: "NX CINEMA",
  siteDescription: "Your ultimate destination for watching anime series and movies.",
  siteTagline: "Premium Series & Movies Streaming",
  loginTitle: "NX CINEMA",
  loginSubtitle: "Premium Series & Movies Streaming",
  premiumTitle: "NX CINEMA Premium",
  footerText: "Unlimited Series & Movies",
  footerCopyright: "© 2026 NX CINEMA. All rights reserved.",
  splashText: "NX CINEMA",
  adminTitle: "NX CINEMA Admin",
  aboutTitle: "About NX CINEMA",
  logoUrl: "",
  playerLogoUrl: "",
  playerName: "NX CINEMA PLAYER",
  rsCardLabel: "NX",
  anCardLabel: "AN",
};

let cachedBranding: BrandingConfig | null = null;
const listeners = new Set<(b: BrandingConfig) => void>();

// Initialize listener once
let initialized = false;
function initBrandingListener() {
  if (initialized) return;
  initialized = true;
  onValue(ref(db, "settings/branding"), (snap) => {
    const val = snap.val();
    cachedBranding = val ? { ...DEFAULT_BRANDING, ...val } : { ...DEFAULT_BRANDING };
    listeners.forEach(fn => fn(cachedBranding!));
  });
}

export function useBranding(): BrandingConfig {
  const [branding, setBranding] = useState<BrandingConfig>(cachedBranding || DEFAULT_BRANDING);

  useEffect(() => {
    initBrandingListener();
    if (cachedBranding) setBranding(cachedBranding);
    
    const listener = (b: BrandingConfig) => setBranding(b);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return branding;
}

export function getBrandingSync(): BrandingConfig {
  return cachedBranding || DEFAULT_BRANDING;
}

export { DEFAULT_BRANDING };
