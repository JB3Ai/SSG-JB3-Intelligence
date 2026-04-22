# SSG / MZANZI VoiceGrid POC Final Draft

**Project:** OS3 VoiceGrid MZANZI_CORE  
**Prepared for:** SSG POC stakeholder review  
**Prepared by:** JB3Ai / OS3 Universal Chassis  
**Draft date:** 2026-04-22  
**Status:** Final POC draft

---

## 1. Executive Summary

The SSG / MZANZI VoiceGrid proof of concept demonstrates a multilingual AI voice operations layer for mining security, perimeter response, and community liaison workflows in South Africa.

The POC connects a command-center web interface, real-time outbound calling, AI conversation logic, multilingual speech services, and a POPIA-aware audit ledger. It is designed to prove that SSG can use voice AI to contact, verify, brief, qualify, and record community or operational engagements with stronger speed, consistency, and governance than manual call workflows.

The current build is a working technical prototype based on the OS3 VoiceGrid chassis and localized through the MZANZI_CORE node.

---

## 2. POC Purpose

The purpose of this POC is to validate whether an AI-assisted voice grid can support SSG-style field, mining, security, and community engagement operations through:

- Fast outbound voice engagement from a controlled command dashboard.
- Localized language handling for South African communities.
- AI-led verification, briefing, and qualification conversations.
- Structured call outcomes written back to an intelligence ledger.
- POPIA-aware consent capture and transcript retention.
- Real-time operational visibility for supervisors.

The POC is not intended to replace human operators. It is intended to prove that routine calls, first-line verification, scripted briefings, and structured data capture can be automated while keeping escalation and oversight available to human teams.

---

## 3. Target Use Cases

### 3.1 Mining and Site Operations

- Shift-aware briefings for managers, supervisors, contractors, and site representatives.
- Area-specific notifications for shafts, perimeters, gates, routes, or community zones.
- Rapid verification of attendance, awareness, or incident acknowledgement.

### 3.2 Security and Perimeter Response

- Automated outbound alerts for security personnel or approved contact lists.
- Structured incident follow-up calls.
- Confirmation of receipt, location, status, and next action.

### 3.3 Community Liaison

- Localized community updates in appropriate language and tone.
- Event, meeting, or consultation reminders.
- Consent-aware collection of interest, feedback, or acknowledgement.

### 3.4 Compliance and Audit

- Call transcript capture.
- AI-generated outcome classification.
- POPIA consent status tracking.
- Exportable records for audit, CRM, or board reporting.

---

## 4. Solution Overview

MZANZI_CORE is a localized deployment profile of the OS3 VoiceGrid ecosystem. It combines:

- **React / Vite Command UI:** Operator dashboard for pipeline management, live terminal control, language node selection, call archive, and system testing.
- **Node.js / Express Backend:** API gateway, WebSocket bridge, call lifecycle manager, and ledger integration layer.
- **Twilio Voice:** Outbound PSTN call initiation and live media streaming.
- **Azure Speech:** Speech-to-text and text-to-speech for real-time voice conversations.
- **Azure OpenAI / Gemini Logic Layer:** AI reasoning, conversation control, and structured output generation.
- **Google Sheets Ledger:** Lightweight POC intelligence ledger for lead intake, call status, transcript summaries, and qualification outcomes.
- **Render Backend Hosting:** Current backend target for POC runtime validation.

Current production backend target:

```text
https://jb3ail-qualify-ai-telephone.onrender.com
```

---

## 5. POC Scope

### Included

- Command dashboard for the MZANZI VoiceGrid node.
- Outbound call triggering through Twilio.
- Real-time Twilio media stream handling.
- Azure speech recognition and synthesis.
- AI-led conversation logic with language-aware behavior.
- Google Sheets sync for lead intake and result logging.
- POPIA consent prompts and compliance archive flow.
- Call archive view for completed signals.
- Language node support for English, isiZulu, isiXhosa, Afrikaans, Sepedi, Portuguese, Greek, and Mandarin.
- Operational status checks for backend, voice, logic, and ledger services.

### Excluded From POC

- Full enterprise identity and access management.
- Production-grade role-based permissions.
- Formal SOC / SIEM integration.
- Long-term encrypted evidence vault.
- Native CRM integration beyond the Google Sheets ledger.
- Human call-center handoff routing into a live agent queue.
- Final SLA-backed production deployment.

These exclusions are suitable for the POC stage and should be addressed during the production hardening phase.

---

## 6. Demo Flow

1. Operator opens the MZANZI_CORE command dashboard.
2. Operator verifies backend, speech, AI logic, Twilio, and ledger readiness.
3. Operator syncs leads from the MZANZI_ENGINE Google Sheet or loads demo records.
4. Operator selects the relevant language nodes and pipeline targets.
5. Operator starts an outbound call.
6. Twilio connects the call and streams live audio to the backend.
7. Azure Speech converts caller audio into text.
8. The AI logic layer responds according to the configured run protocol.
9. Azure Speech synthesizes the AI reply back into phone-compatible audio.
10. Call outcome is classified as qualified, failed, pending, or completed.
11. POPIA consent and structured results are written back to the intelligence ledger.
12. Operator reviews the completed record in the archive.

---

## 7. Success Criteria

The POC should be considered successful if it can demonstrate:

- A live outbound phone call can be initiated from the dashboard.
- The caller can hear AI-generated speech clearly.
- The AI can understand caller responses through speech recognition.
- The system can operate in at least three relevant South African language contexts during review.
- The AI can capture consent, status, and structured outcome data.
- The dashboard can show operational state before and during the call.
- The result can be written to the ledger with traceable status.
- A completed call can be reviewed in the archive.
- Latency is acceptable for a natural call experience during the demo.

---

## 8. Governance and POPIA Position

The POC is designed around POPIA-aware operating principles:

- Consent is requested before personal data is persisted.
- The system records whether consent was granted or declined.
- Call outputs are structured for audit visibility.
- The ledger can separate operational call status from personal data capture.
- Production deployment should place client credentials, telephony, storage, and logs inside the client-approved tenancy or cloud boundary.

Before production use, SSG should complete a formal POPIA operator/responsible-party review, define data retention periods, confirm lawful basis for outbound calls, and approve transcript storage rules.

---

## 9. Risks and Mitigations

| Risk | POC Impact | Mitigation |
| --- | --- | --- |
| Speech recognition errors in noisy environments | Incorrect transcription or misunderstood responses | Use controlled demo calls first, then test with real site audio conditions |
| Language or dialect mismatch | Reduced trust or lower completion rate | Tune language prompts and add reviewed local scripts per site |
| Latency across cloud services | Awkward call pacing | Keep Azure Speech and AI services regionally aligned where possible |
| Telephony setup issues | Failed outbound calls | Pre-demo Twilio verification and approved caller ID setup |
| POPIA uncertainty | Delayed production approval | Formal compliance review before live personal-data processing |
| Ledger dependency | Missed or delayed write-back | Add retry handling and production database option after POC |

---

## 10. Recommended POC Timeline

### Phase 1: Technical Readiness

- Confirm credentials for Twilio, Azure Speech, Azure OpenAI or Gemini, and Google Sheets.
- Validate `/api/health` on the Render backend.
- Run internal voice and logic tests.
- Confirm language scripts and call objectives.

### Phase 2: Controlled Demo

- Run 5 to 10 controlled calls using approved demo numbers.
- Test at least three language nodes.
- Validate transcript capture and ledger write-back.
- Review call archive output with stakeholders.

### Phase 3: Field-Representative Pilot

- Run a limited pilot with approved SSG contacts or community liaison representatives.
- Measure completion rate, latency, consent capture, and outcome accuracy.
- Gather operator and recipient feedback.

### Phase 4: Production Decision

- Decide whether to proceed to production hardening.
- Define integration targets such as CRM, incident management, or secure evidence storage.
- Approve security, POPIA, identity, and infrastructure requirements.

---

## 11. Production Hardening Roadmap

Recommended next steps after successful POC:

- Replace Google Sheets ledger with a secured production database or approved CRM integration.
- Add authenticated operator login and role-based access control.
- Add tenant isolation for multiple sites, clients, or operational units.
- Add encrypted transcript storage and retention policies.
- Add supervisor review, redaction, and export controls.
- Add alerting and observability through Application Insights or equivalent.
- Add formal escalation routing to human operators.
- Add disaster recovery and deployment rollback procedure.
- Perform security review, POPIA review, and telephony compliance review.

---

## 12. Decision Request

SSG stakeholders are requested to approve the POC for controlled demonstration under the following conditions:

- Demo numbers and participants are authorized.
- POC call scripts are approved before execution.
- Personal data used in the POC is minimized.
- POPIA consent language is included in call flow.
- Results are reviewed as technical validation, not final production performance.

Approval of this POC will allow JB3Ai / OS3 to proceed with a controlled demonstration and gather the evidence needed for a production-readiness decision.

---

## 13. Appendix: Current Technical Baseline

| Area | Current POC Baseline |
| --- | --- |
| Frontend | React 18, Vite, TypeScript |
| Backend | Node.js, Express, WebSockets |
| Telephony | Twilio outbound calls and media streams |
| Speech | Azure Cognitive Services Speech SDK |
| AI Logic | Azure OpenAI and Gemini fallback logic |
| Ledger | Google Sheets API / MZANZI_ENGINE range |
| Hosting | Render backend target |
| Compliance | POPIA consent prompt, archive, structured outcome capture |
| Primary Repo | `OS3_VoiceGrid_MZANZI_CORE` |

---

## 14. Final POC Statement

The SSG / MZANZI VoiceGrid POC is ready to be positioned as a controlled demonstration of multilingual AI voice operations for mining security, community liaison, and compliance-aware call workflows.

The system has enough capability to prove the core operating model: initiate calls, conduct AI-guided conversations, handle localized language contexts, capture consent and outcomes, and write auditable records into an intelligence ledger.

The recommended next action is to run a controlled stakeholder demo, capture measurable outcomes, and use those results to define the production hardening scope.
