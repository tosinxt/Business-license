# City of Mobile — Business License Portal

**Date:** 2026-04-21
**Status:** Approved (spec updated to reflect official form — BUSINESS_LICENSE_TAX_APPLICATION_10202023)

---

## Overview

A Next.js web portal for residents of Mobile, Alabama to apply for new business licenses online. The application form mirrors the official City of Mobile Revenue Department form (8-page PDF, issued October 20, 2023). The landing page is a cinematic video hero; all interior pages use a clean light government style. Auth is simulated client-side (no backend required).

---

## Design System

### Two Visual Modes

**Public (Landing page only)**
- Full-screen video background, no overlay
- Liquid glass navbar and cards
- Inter font, white text on black
- Unchanged from current HeroSection structure

**Authenticated (All interior pages)**
- Page background: `#f0f4f8`
- Card background: `#ffffff`
- Primary action: `#0066cc` (buttons, links, focus rings, active states)
- Header/nav: `#1e3a5f` navy
- Body text: `#111827`, secondary text: `#6b7280`
- Borders: `#e5e7eb`
- Font: Inter (globally loaded)
- Success: `#16a34a`, Error: `#dc2626`, Warning: `#d97706`

### Shared Components (Interior)
- `AppHeader` — navy top bar, City of Mobile wordmark, user name, "Sign Out" link. Present on all interior pages.
- `PageCard` — white card, `border-radius: 8px`, `box-shadow: 0 1px 4px rgba(0,0,0,0.08)`, `padding: 32px`
- Form fields — white fill, `#e5e7eb` border, `#0066cc` focus ring, `border-radius: 6px`, label above field
- Primary button — `#0066cc` bg, white text, hover `#0052a3`
- Secondary button — white bg, `#0066cc` border and text
- `SectionHeader` — small uppercase label in `#6b7280`, `font-size: 11px`, `letter-spacing: 0.08em`, above field groups
- `RequiredBadge` — red asterisk inline after label for required fields

---

## Pages

### `/` — Landing Page
**Changes from current build:**
- Logo wordmark: "VEX" → two-line text: "City of Mobile" (bold) / "Alabama" (smaller, lighter)
- Headline: "Mobile's Official Business License Portal"
- Subheadline: "Apply for your City of Mobile business license online — fast, secure, and paperless."
- Nav links: Home · How It Works · Contact
- Primary CTA: "Sign In" → `/login`
- Secondary CTA: "Create Account" → `/login?tab=register`
- Tag pill (bottom right): "Secure · Official · Paperless"
- Everything else (video, liquid glass, animations, layout) unchanged

---

### `/login`
**Layout:** Full-page `#f0f4f8` background, `AppHeader` at top, centered `PageCard`.

**Card contents:**
- City of Mobile wordmark at top of card
- Tab switcher: "Sign In" | "Create Account"
- Sign In fields: Email, Password, "Forgot password?" link, "Sign In" primary button
- Create Account fields: Full Name, Email, Password, Confirm Password, "Create Account" primary button
- On submit: store `{ name, email, loggedIn: true }` in localStorage → redirect to `/dashboard`

---

### `/dashboard`
**Layout:** `AppHeader` + `#f0f4f8` page + left sidebar (desktop ≥1024px) + centered content.

**Sidebar links:** Dashboard · New Application · Contact. Active: `#0066cc` left border + `#eff6ff` bg.

**Main content:**
- `h1`: "Welcome back, [Name]"
- Subtitle: "City of Mobile Business License Portal"
- "Start New Application" `PageCard`: icon, description ("Apply for a new City of Mobile business license. The process takes approximately 15–20 minutes."), "Begin Application" button → `/apply`
- "Your Applications" section: table with columns — Application #, Business Name, Date Submitted, Status. Empty state: "No applications yet — start your first application."
- Info banner: links to Revenue Department contacts (phone, email, address) for questions

---

### `/apply` — 6-Step Application Wizard

**Layout:** `AppHeader` + `#f0f4f8` page + centered max-width content. No sidebar. Progress bar above `PageCard`.

**Progress bar:** 6 steps, horizontal, full-width above card. Each step: number + short label. States: completed (filled blue + checkmark), active (blue border + label highlighted), incomplete (gray).

**Step navigation:** "Back" secondary button (left) + "Next" / "Submit" primary button (right) at bottom of card. "Save & Exit" text link saves to localStorage and returns to dashboard.

**Validation:** All fields marked required (*) block "Next" until filled. Client-side only.

---

#### Step 1 — Application Setup

**Application Type*** (radio, select one):
- New Business
- Change — Business Name
- Change — New Owner
- Change — FEIN / Business Structure
- Change — Physical Location
- Re-Active Account
- Other (triggers: text field "Please explain")

**Business Operated From*** (radio):
- Commercial Store Front / Office
- Home / Home Office

**Description / Type*** (checkboxes, select all that apply):
- Contractor — State Certified
- Construction — Non-Certified
- Service / Professional
- Retail
- Manufacturer
- Wholesale
- Rental — Tangible Goods
- Peddler
- Food Truck
- Other (triggers: text field)

**Detailed Explanation of Business Activity*** — textarea, minimum 50 characters. Help text: "Describe your specific products or services, target customers, and day-to-day operations."

**Conditional — if Restaurant / Bar / Lounge selected:**
- Will the location cook/serve prepared food? (Yes/No)
- Will the location have alcohol sales? (Yes/No) → if Yes: Has ABC Board application started? (Yes/No)
- Will the location have vending and/or gaming machines? (Yes/No) → if Yes: # gaming machines, # vending machines

**Conditional — if Convenience / Grocery Store selected:**
- Will the location cook/serve prepared food? (Yes/No)
- Will the location sell gasoline? (Yes/No) → if Yes: Owner of pumps (Applicant / Other), distributor name
- Will the location have retail sales / vending machines? (Yes/No) → if Yes: # vending machines
- Will the location have alcohol sales? (Yes/No) → if Yes: Has ABC Board application started? (Yes/No)

**Conditional — if Hotel / Motel selected:**
- Number of rooms available for customer rental*
- Will the location cook/serve prepared food? (Yes/No)
- Will the location have alcohol sales? (Yes/No) → if Yes: Has ABC Board application started? (Yes/No)
- Do you have a management company? (Yes/No) → if Yes: company name + contact info

---

#### Step 2 — Business Information

**Application Date*** — date picker, pre-filled with today
**Start Date of Business*** — date picker

**Business Legal Name*** — text field. Help: "Must match your Alabama Secretary of State registration exactly."
**Trade Name / DBA** — text field. Help: "Leave blank if operating under your legal name."

**Business Structure*** (radio, select one):
- Sole Proprietorship
- Limited Liability Company (LLC)
- Corporation
- Professional Association
- Other (triggers: text field)

**Federal Tax ID (FEIN)** — text field, format XX-XXXXXXX. Help: "Required for all structures except Sole Proprietorship. Obtain at irs.gov." Shown/required unless Sole Proprietorship selected.
**State of Alabama Tax ID** — text field.

**Physical Location*** (radio):
- City Limits
- Police Jurisdiction (PJ)
- Outside City & PJ

**Company Physical Address*** — Street Address + Suite #, City, State (pre-filled AL), ZIP
**Mailing Address** — checkbox "Same as physical address" (default checked). If unchecked: Street / PO Box, City, State, ZIP

**Company Phone*** — (251) format
**Business Phone** — (251) format (can be same)
**Number of Employees*** — number input

**Business Contact Person:**
- Full Name (Last, First, Middle)*
- Title*
- Phone*
- Email*

---

#### Step 3 — Owner & Officer Information

**Instructions banner:** "Complete one section per owner, officer, or partner. All listed individuals must also complete a citizenship form (Form A or Form B)."

**Owner/Officer Section (repeatable — "Add Another Owner" button):**
- Full Name (Last, First, Middle, Suffix)*
- Title*
- Social Security Number* — masked input, format XXX-XX-XXXX
- Driver's License — State* + License Number*
- Contact Phone*
- Email*
- Home Street Address*
- City*, State*, ZIP*
- Date of Birth* — date picker

**Citizenship Form (per owner)*** (radio):
- Form A — I am a U.S. Citizen
- Form B — I am a lawfully present non-U.S. citizen

**If Form A selected — U.S. Citizenship Declaration:**
- Acceptable document type* (dropdown matching official list: AL Driver's License, Birth Certificate, U.S. Passport, Naturalization Certificate, etc. — full 16-item list from the official form)
- Declaration text displayed: "Under penalty of perjury, I declare that I am a citizen of the United States of America."
- Signature field (typed full name as signature)* + Date*

**If Form B selected — Lawful Alien Declaration:**
- Alien Registration Number (A-Number)* — format A + 8–9 digits
- Acceptable document type* (dropdown: Valid AL Driver's License, AL Non-Driver ID, Tribal ID, Government-issued ID, Foreign Passport + US Visa, Visa Waiver Passport — 6 options)
- Declaration text displayed: "Under penalty of perjury, I declare that I am a lawfully present alien of the United States of America."
- Signature field (typed full name)* + Date*
- Info notice: "Your status will be verified through the SAVE Program. A temporary license may be issued pending final verification."

**Related Business Interests:**
- "Do any owners/officers above own or have membership in any other business within City Limits or Police Jurisdiction?" (Yes/No)
- If Yes: repeatable table — Owner Name, Business Name, Business Address

---

#### Step 4 — Property & Tax Information

**Property Ownership*** (radio):
- I own the property
- I rent / lease the property → triggers lease agreement document requirement notice

**Property Owner Information** (shown if renting):
- Property Owner Name*
- Property Owner Address* (Street, City, State, ZIP)
- Property Owner Phone*
- Property Owner Email
- Do you have a property management company? (Yes/No) → if Yes: company name + contact info

**Conditional — if Rental — Residential selected in Step 1:**
- "List all rental property addresses within City Limits & Police Jurisdiction" — repeatable address rows

**Business Tax Type*** (checkboxes, select all that apply):
- Sales Tax
- Sellers Use
- Consumer Use
- Lease / Rental (Tangible Property)
- Lodging
- Wine Tax
- Tobacco Tax
- Liquor Purchase Tax

**Tax Filing Frequency*** (radio — must match Alabama Dept. of Revenue registration):
- Monthly
- Quarterly
- Semi-Annually
- Annually

---

#### Step 5 — Required Documents Checklist

**Informational step — no form inputs.** Renders a personalized checklist based on all prior selections.

**Always required (all applicants):**
- [ ] Completed License/Tax Application (this form)
- [ ] Legible copy of driver's license for each owner/officer listed
- [ ] Detailed explanation of business activity
- [ ] Completed Citizenship Form A or B for each owner/officer

**Conditionally required (shown only if applicable):**
- [ ] Zoning Approval Certificate — if City Limits selected (link: buildmobile.org/zoning-clearance-request)
- [ ] Articles of Organization / Incorporation (all stamped pages) — if LLC, Corporation, or Professional Assoc.
- [ ] FEIN Letter from IRS — if not Sole Proprietorship
- [ ] Alabama Department of Revenue Tax ID Letter
- [ ] Signed Lease / Rental Agreement — if renting property
- [ ] Fire Inspection Report — if Commercial + City Limits (contact: 251.208.7484)
- [ ] Mobile County Health Dept. Inspection — if food service (contact: 251.690.8158)
- [ ] State of Alabama Certification / License — if Contractor or regulated profession
- [ ] Surety Bond Cover Letter — if Contractor (contact Permitting: 251.208.7603)
- [ ] Background Check — if security-sensitive business (contact MPD Records: 251.208.1991)
- [ ] Environmental Approval Letter — if Manufacturer (contact Ryne Smith: 251.208.7529)
- [ ] ABC Board / City / County Approval Letters — if alcohol sales
- [ ] Convenience & Necessity Approval — if applicable (City Clerk: 251.208.7411)

**60-Day Affidavit Notice (always shown):**
> "After your license is approved, you will receive a 60-Day Affidavit with your license paperwork (if applicable). This must be returned within 10 days after your first 60 days of operation. Failure to return it means your permanent license will not be issued and you will be considered to be operating without a license, subject to penalties and court action."

**Acknowledgment checkbox*** — "I understand that I must gather and submit all checked documents above before my application can be processed."

**Submission methods info (informational):**
- Email: Revenue@cityofmobile.org
- Fax: 251.208.7954
- In-Person: 205 Government St, 2nd Floor South Tower, Mobile AL (Mon–Fri 8am–5pm)
- Mail: PO Box 3065, Mobile AL 36652-3065

---

#### Step 6 — Review & Submit

**Read-only summary** of all fields, grouped by step. Each group has an "Edit" link that returns to that step.

**Certification statement (displayed in full):**
> "By signing this application, you certify that all information and statements provided herein are true and correct. You also certify, under penalty of perjury, that you are a US Citizen or lawfully present in the US. In addition, by signing below, you acknowledge and understand that you cannot operate this business in the City of Mobile and/or its Police Jurisdiction until this business license application is approved and a business license issued."

**Printed Name & Title*** — text field
**Signature*** (typed name as signature) — text field
**Date*** — date picker, pre-filled today
**Understanding checkboxes (both required):**
- [ ] "I understand the license may require a 60-Day Affidavit, due 70 days from my business start date. If not returned with payment, I will be considered operating without a license."
- [ ] "I understand all licenses expire December 31st each year and must be renewed by January 31st to avoid penalties and interest."

**"Submit Application" primary button** — generates reference number `MOB-2026-` + 5 random digits, stores in localStorage, redirects to `/apply/confirmation`.
**"Save & Exit" secondary button** → `/dashboard`

---

### `/apply/confirmation`

**Layout:** `AppHeader` + centered `PageCard` on `#f0f4f8`. No sidebar.

**Contents:**
- Large green checkmark icon
- "Application Submitted Successfully"
- Reference number: `MOB-2026-XXXXX` (prominent, copyable)
- "Estimated review time: 5–7 business days (simple) to 12–16 weeks (alcohol license or complex applications)"
- "What happens next":
  1. City of Mobile Revenue Department will review your application and documents
  2. Staff will contact you at the email/phone provided if additional information is needed
  3. Once approved, your license will be issued — remember the 60-Day Affidavit if applicable
- Revenue Dept. contact: Revenue@cityofmobile.org · 251.208.7462
- "Return to Dashboard" button → `/dashboard`
- "Print Confirmation" secondary button (browser print)

---

## Routing & Auth

- Auth state: localStorage `{ name, email, loggedIn: true }`
- `AuthContext` (React context): exposes `login()`, `logout()`, `user`
- Protected routes (`/dashboard`, `/apply`, `/apply/confirmation`): redirect to `/login` if no session
- `/login`: redirect to `/dashboard` if already logged in
- Wizard state: React state in `/apply/page.tsx` (lost on hard refresh — acceptable for demo)
- Submitted application: stored in localStorage as `{ refNumber, submittedAt, businessName }`

---

## File Structure

```
src/
  app/
    page.tsx                          # Landing — HeroSection with updated copy
    login/
      page.tsx                        # Login page ("use client")
    dashboard/
      page.tsx                        # Dashboard ("use client", protected)
    apply/
      page.tsx                        # Wizard shell + state ("use client", protected)
      confirmation/
        page.tsx                      # Confirmation ("use client", protected)
    components/
      HeroSection.tsx                 # Existing — copy/branding updates only
      AppHeader.tsx                   # Navy top bar, shared by all interior pages
      AuthContext.tsx                 # Auth provider + useAuth hook
      ProtectedRoute.tsx              # Checks session, redirects to /login
      apply/
        ProgressBar.tsx               # 6-step progress indicator
        StepApplicationSetup.tsx      # Step 1
        StepBusinessInfo.tsx          # Step 2
        StepOwnerInfo.tsx             # Step 3 (repeatable owner sections + citizenship forms)
        StepPropertyTax.tsx           # Step 4
        StepDocumentChecklist.tsx     # Step 5 (computed from prior step answers)
        StepReviewSubmit.tsx          # Step 6
    globals.css                       # Existing — no changes
    layout.tsx                        # Wrap root with AuthProvider
```

---

## Out of Scope

- Real authentication or backend API
- Actual document upload (checklist is informational only)
- Email sending or PDF generation
- Payment processing
- 60-Day Affidavit form (separate future feature)
- License renewal flow
- Admin/staff review portal
- SAVE Program API integration (Form B verification is display-only)
- ABC Board / zoning status verification
