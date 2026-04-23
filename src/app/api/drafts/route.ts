import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type DraftLead = {
  id: string;
  step: number;
  updatedAt: string;
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

type StoreShape = {
  drafts: Record<string, DraftLead>;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "draft-leads.json");

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    return parsed?.drafts ? parsed : { drafts: {} };
  } catch {
    return { drafts: {} };
  }
}

async function writeStore(store: StoreShape) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const store = await readStore();
  const draft = store.drafts[id];
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(draft);
}

export async function POST(req: Request) {
  let body: DraftLead | null = null;
  try {
    body = (await req.json()) as DraftLead;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Never persist sensitive fields (SSN/DL/DOB/etc.). The client sends a sanitized payload,
  // and we keep it constrained here as an extra guardrail.
  const lead: DraftLead = {
    id: String(body.id),
    step: Number(body.step || 1),
    updatedAt: String(body.updatedAt || new Date().toISOString()),
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
      ? body.owners.slice(0, 8).map(o => ({
          fullName: String(o?.fullName || ""),
          title: String(o?.title || ""),
          phone: String(o?.phone || ""),
          email: String(o?.email || ""),
        }))
      : [],
  };

  const store = await readStore();
  store.drafts[lead.id] = lead;
  await writeStore(store);

  return NextResponse.json({ ok: true });
}

