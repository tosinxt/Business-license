"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";

function ConfirmationContent() {
  const router = useRouter();
  const [refNumber, setRefNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const ref = localStorage.getItem("bl_last_ref");
      if (ref) setRefNumber(ref);
    } catch { /* ignore */ }
  }, []);

  function handleCopy() {
    if (!refNumber) return;
    navigator.clipboard.writeText(refNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="interior-page">
      <AppHeader />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", background: "var(--page-bg)" }}>
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: "520px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-lt)", overflow: "hidden" }}>

            {/* Success header */}
            <div style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", padding: "2rem 2rem 1.75rem", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "2px solid rgba(255,255,255,0.3)" }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>Application Submitted</h1>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>City of Mobile Revenue Department has received your application.</p>
            </div>

            <div style={{ padding: "1.75rem 2rem" }}>

              {/* Reference number */}
              {refNumber && (
                <div style={{ textAlign: "center", padding: "1.25rem", borderRadius: "8px", background: "var(--page-bg)", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Reference Number</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", letterSpacing: "0.05em" }}>{refNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      style={{ padding: "0.3rem 0.75rem", borderRadius: "5px", background: copied ? "#dcfce7" : "#f0f2f5", color: copied ? "#16a34a" : "#6b7280", border: "1px solid " + (copied ? "#bbf7d0" : "#e1e4e9"), fontSize: "0.72rem", fontFamily: "var(--font-ui)", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.03em" }}
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              {/* Estimated timeline */}
              <div style={{ padding: "0.875rem 1rem", borderRadius: "6px", background: "#fffbeb", border: "1px solid #fde68a", marginBottom: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "#374151" }}>
                  <strong style={{ color: "#78350f" }}>Estimated review time:</strong>{" "}
                  5–7 business days for simple applications; 12–16 weeks for alcohol license or complex applications.
                </p>
              </div>

              {/* What happens next */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p className="font-display" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.875rem", letterSpacing: "-0.01em" }}>What happens next</p>
                <ol style={{ display: "flex", flexDirection: "column", gap: "0.625rem", margin: 0, padding: 0, listStyle: "none" }}>
                  {[
                    "City of Mobile Revenue Department will review your application and documents.",
                    "Staff will contact you at the email/phone provided if additional information is needed.",
                    "Once approved, your license will be issued — remember the 60-Day Affidavit if applicable.",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "var(--primary)", flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
                      <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contact */}
              <p style={{ textAlign: "center", fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                Questions?{" "}
                <a href="mailto:Revenue@cityofmobile.org" style={{ color: "var(--primary)", textDecoration: "none" }}>Revenue@cityofmobile.org</a>
                {" "}·{" "}
                <a href="tel:2512087462" style={{ color: "var(--primary)", textDecoration: "none" }}>251.208.7462</a>
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => router.push("/")} className="btn-primary" style={{ flex: 1, padding: "0.75rem" }}>
                  Return home
                </button>
                <button type="button" onClick={() => window.print()} className="btn-secondary" style={{ padding: "0.75rem 1.25rem" }}>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return <ConfirmationContent />;
}
