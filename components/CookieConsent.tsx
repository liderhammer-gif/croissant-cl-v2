"use client";

import { useEffect, useState } from "react";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "croissant_cookie_consent_v1";

function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    essential: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("croissant:consent", { detail: consent }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setVisible(true);
      return;
    }
    try {
      const saved = JSON.parse(raw) as Consent;
      setAnalytics(Boolean(saved.analytics));
      setMarketing(Boolean(saved.marketing));
      setHasChoice(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setVisible(true);
    }
  }, []);

  function acceptAll() {
    saveConsent(true, true);
    setAnalytics(true);
    setMarketing(true);
    setVisible(false);
    setHasChoice(true);
  }

  function rejectOptional() {
    saveConsent(false, false);
    setAnalytics(false);
    setMarketing(false);
    setVisible(false);
    setHasChoice(true);
  }

  function savePreferences() {
    saveConsent(analytics, marketing);
    setVisible(false);
    setSettings(false);
    setHasChoice(true);
  }

  return (
    <>
      {visible && (
        <div className="cookieOverlay" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
          <div className="cookieCard">
            <div className="cookieCopy">
              <p className="eyebrow">PRIVACIDAD</p>
              <h2 id="cookie-title">Tus preferencias de cookies</h2>
              <p>Usamos cookies esenciales para que el sitio funcione. Las cookies de analítica y marketing solo se activan con tu autorización.</p>
              <a href="/privacidad">Ver política de privacidad</a>
            </div>

            {settings && (
              <div className="cookieSettings">
                <label><span><strong>Esenciales</strong><small>Necesarias para seguridad y funcionamiento.</small></span><input type="checkbox" checked disabled /></label>
                <label><span><strong>Analítica</strong><small>Nos ayuda a medir visitas y conversiones.</small></span><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /></label>
                <label><span><strong>Marketing</strong><small>Reservado para futuras integraciones publicitarias.</small></span><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /></label>
              </div>
            )}

            <div className="cookieActions">
              {!settings ? (
                <>
                  <button className="button cookieSecondary" onClick={rejectOptional}>Rechazar no esenciales</button>
                  <button className="button cookieSecondary" onClick={() => setSettings(true)}>Configurar</button>
                  <button className="button gold" onClick={acceptAll}>Aceptar todo</button>
                </>
              ) : (
                <>
                  <button className="button cookieSecondary" onClick={() => setSettings(false)}>Volver</button>
                  <button className="button gold" onClick={savePreferences}>Guardar preferencias</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {hasChoice && !visible && (
        <button className="cookieManage" onClick={() => setVisible(true)} aria-label="Cambiar preferencias de cookies">Cookies</button>
      )}
    </>
  );
}
