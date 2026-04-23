"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "../components/AppHeader";
import ProgressBar from "../components/apply/ProgressBar";
import StepApplicationSetup from "../components/apply/StepApplicationSetup";
import StepBusinessInfo from "../components/apply/StepBusinessInfo";
import StepOwnerInfo from "../components/apply/StepOwnerInfo";
import StepPropertyTax from "../components/apply/StepPropertyTax";
import StepDocumentChecklist from "../components/apply/StepDocumentChecklist";
import StepReviewSubmit from "../components/apply/StepReviewSubmit";
import { WizardFormData, defaultFormData } from "../components/apply/types";

type Draft = {
  id: string;
  step: number;
  updatedAt: string;
  data: WizardFormData;
};

const LS_LAST_DRAFT_ID = "bl_wizard_last_draft_id";
const LS_DRAFT_PREFIX = "bl_wizard_draft_v2:";

function getDraftKey(id: string) {
  return `${LS_DRAFT_PREFIX}${id}`;
}

function safeRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function readDraft(id: string): Draft | null {
  try {
    const raw = localStorage.getItem(getDraftKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed?.id || !parsed?.data) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft) {
  localStorage.setItem(getDraftKey(draft.id), JSON.stringify(draft));
  localStorage.setItem(LS_LAST_DRAFT_ID, draft.id);
}

function extractLead(draft: Draft) {
  const d = draft.data;
  return {
    id: draft.id,
    step: draft.step,
    updatedAt: draft.updatedAt,
    businessLegalName: d.businessLegalName || "",
    tradeName: d.tradeName || "",
    businessStructure: d.businessStructure || "",
    companyPhone: d.companyPhone || "",
    businessPhone: d.businessPhone || "",
    contactName: d.contactName || "",
    contactTitle: d.contactTitle || "",
    contactPhone: d.contactPhone || "",
    contactEmail: d.contactEmail || "",
    owners: (d.owners || []).map(o => ({
      fullName: o.fullName || "",
      title: o.title || "",
      phone: o.phone || "",
      email: o.email || "",
    })),
  };
}

function WizardContent({ initialDraftId }: { initialDraftId: string }) {
  const router = useRouter();
  const [draftId, setDraftId] = useState<string>("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(defaultFormData);

  const lastLeadSentAtRef = useRef(0);
  const leadSendAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Establish a draft id, then try to hydrate draft data/step.
    let id = initialDraftId;
    if (!id) {
      try {
        id = localStorage.getItem(LS_LAST_DRAFT_ID) || "";
      } catch {
        // ignore
      }
    }
    if (!id) id = safeRandomId();

    setDraftId(id);

    const existing = readDraft(id);
    if (existing) {
      setFormData(existing.data);
      setStep(existing.step || 1);
      return;
    }
  }, [initialDraftId]);

  function handleChange(field: keyof WizardFormData, value: unknown) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // Autosave draft locally and emit a sanitized lead server-side for follow-up.
  useEffect(() => {
    if (!draftId) return;
    const t = window.setTimeout(async () => {
      const draft: Draft = {
        id: draftId,
        step,
        updatedAt: new Date().toISOString(),
        data: formData,
      };
      try {
        writeDraft(draft);
      } catch {
        // ignore (private browsing / quota / etc.)
      }

      const now = Date.now();
      // Throttle network writes.
      if (now - lastLeadSentAtRef.current < 5000) return;
      lastLeadSentAtRef.current = now;

      try {
        leadSendAbortRef.current?.abort();
        const controller = new AbortController();
        leadSendAbortRef.current = controller;
        await fetch("/api/drafts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(extractLead(draft)),
          signal: controller.signal,
        });
      } catch {
        // ignore
      }
    }, 450);

    return () => window.clearTimeout(t);
  }, [draftId, formData, step]);

  function handleNext() {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveExit() {
    try {
      if (!draftId) return;
      const draft: Draft = { id: draftId, step, updatedAt: new Date().toISOString(), data: formData };
      writeDraft(draft);
    } catch {
      // ignore
    }
    router.push(`/apply/resume?draft=${encodeURIComponent(draftId)}`);
  }

  function handleSubmit() {
    const refNumber = `MOB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const application = {
      refNumber,
      businessName: formData.businessLegalName || formData.tradeName || "Unnamed Business",
      submittedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("bl_applications") || "[]");
      localStorage.setItem("bl_applications", JSON.stringify([...existing, application]));
      localStorage.setItem("bl_last_ref", refNumber);
    } catch {
      // ignore
    }
    router.push("/apply/confirmation");
  }

  const stepProps = {
    data: formData,
    onChange: handleChange,
    onNext: step < 6 ? handleNext : handleSubmit,
    onBack: handleBack,
    onSaveExit: handleSaveExit,
    goToStep: (n: number) => { setStep(n); window.scrollTo({ top: 0, behavior: "smooth" }); },
  };

  return (
    <div className="interior-page">
      <AppHeader />
      <div style={{ flex: 1, padding: "1.75rem 1rem 3rem", background: "var(--page-bg)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <ProgressBar step={step} />
          {step === 1 && <StepApplicationSetup {...stepProps} />}
          {step === 2 && <StepBusinessInfo {...stepProps} />}
          {step === 3 && <StepOwnerInfo {...stepProps} />}
          {step === 4 && <StepPropertyTax {...stepProps} />}
          {step === 5 && <StepDocumentChecklist {...stepProps} />}
          {step === 6 && <StepReviewSubmit {...stepProps} />}
        </div>
      </div>
    </div>
  );
}

function ApplyPageInner() {
  const searchParams = useSearchParams();
  const initialDraftId = useMemo(() => searchParams.get("draft") || "", [searchParams]);
  return <WizardContent initialDraftId={initialDraftId} />;
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<WizardContent initialDraftId="" />}>
      <ApplyPageInner />
    </Suspense>
  );
}
