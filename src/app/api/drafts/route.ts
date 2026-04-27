import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

type DraftLead = {
  id: string;
  step: number;
  updatedAt: string;
  fullName?: string;
  businessLegalName?: string;
  tradeName?: string;
  businessStructure?: string;
  companyPhone?: string;
  businessPhone?: string;
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  owners?: Array<{ fullName?: string; title?: string; phone?: string; email?: string }>;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = getAdminDb();
  const doc = await db.collection("drafts").doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc.data());
}

export async function POST(req: Request) {
  let body: DraftLead | null = null;
  try {
    body = (await req.json()) as DraftLead;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const lead: DraftLead = {
    id: String(body.id),
    step: Number(body.step || 1),
    updatedAt: String(body.updatedAt || new Date().toISOString()),
    fullName: String(body.fullName || ""),
    businessLegalName: String(body.businessLegalName || ""),
    tradeName: String(body.tradeName || ""),
    businessStructure: String(body.businessStructure || ""),
    companyPhone: String(body.companyPhone || ""),
    businessPhone: String(body.businessPhone || ""),
    contactName: String(body.contactName || ""),
    contactTitle: String(body.contactTitle || ""),
    contactPhone: String(body.contactPhone || ""),
    contactEmail: String(body.contactEmail || ""),
    owners: Array.isArray(body.owners)
      ? body.owners.slice(0, 8).map((o) => ({
          fullName: String(o?.fullName || ""),
          title: String(o?.title || ""),
          phone: String(o?.phone || ""),
          email: String(o?.email || ""),
        }))
      : [],
  };

  const db = getAdminDb();
  await db.collection("drafts").doc(lead.id).set(lead, { merge: true });
  return NextResponse.json({ ok: true });
}
