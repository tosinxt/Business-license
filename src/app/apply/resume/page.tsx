"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "../../components/AppHeader";

const LS_DRAFT_PREFIX = "bl_wizard_draft_v2:";

function getDraftKey(id: string) {
  return `${LS_DRAFT_PREFIX}${id}`;
}

export default function ResumeDraftPage() {
  return (
    <Suspense fallback={<ResumeDraftInner draftId="" />}>
      <ResumeDraftFromSearchParams />
    </Suspense>
  );
}

function ResumeDraftFromSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = useMemo(() => searchParams.get("draft") || "", [searchParams]);
  return <ResumeDraftInner draftId={draftId} />;
}

function ResumeDraftInner({ draftId }: { draftId: string }) {
  const router = useRouter();

  const [hasDraftOnDevice, setHasDraftOnDevice] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!draftId) return;
    try {
      setHasDraftOnDevice(Boolean(localStorage.getItem(getDraftKey(draftId))));
    } catch {
      setHasDraftOnDevice(false);
    }
  }, [draftId]);

  async function handleCopy() {
    if (!draftId) return;
    const url = `${window.location.origin}/apply?draft=${encodeURIComponent(draftId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="interior-page">
      <AppHeader />
      <div style={{ flex: 1, padding: "1.75rem 1rem 3rem", background: "var(--page-bg)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="page-card" style={{ padding: "1.5rem" }}>
            <div className="section-header" style={{ marginTop: 0 }}>Progress saved</div>
            <h1 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 650, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              You can come back and finish anytime.
            </h1>

            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.92rem", color: "var(--ink-2)", lineHeight: 1.55, marginTop: "0.75rem" }}>
              We’ll keep your draft on <strong>this device</strong>. If you switch devices or clear browser storage, you may need to start again.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => router.push(`/apply?draft=${encodeURIComponent(draftId)}`)}
                disabled={!draftId || !hasDraftOnDevice}
                style={{ padding: "0.75rem 1rem" }}
              >
                Continue application
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCopy}
                disabled={!draftId}
                style={{ padding: "0.75rem 1rem" }}
              >
                {copied ? "Link copied" : "Copy resume link"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => router.push("/")}
                style={{ padding: "0.75rem 1rem" }}
              >
                Return home
              </button>
            </div>

            {!hasDraftOnDevice && draftId && (
              <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a" }}>
                <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "#78350f" }}>
                  This draft isn’t available in this browser storage yet. If you just saved, refresh this page. If you’re on a new device, you may need to start a new application.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

