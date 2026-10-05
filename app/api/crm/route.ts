import { NextRequest, NextResponse } from "next/server";
import { 
  updateServerTargetContact, 
  addServerTargetContact, 
  setServerPrimaryContact, 
  logServerCallActivity, 
  updateServerStage, 
  addServerNote,
  logServerActivity,
  logServerOutreach,
  getServerTargets
} from "@/lib/serverStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, targetId } = body;

    let updatedTargets = getServerTargets();

    if (action === "update_contact") {
      const { contact } = body;
      if (!targetId || !contact) throw new Error("Missing targetId or contact");
      updatedTargets = updateServerTargetContact(targetId, contact);
    } else if (action === "add_contact") {
      const { contact, setAsPrimary } = body;
      if (!targetId || !contact) throw new Error("Missing targetId or contact");
      updatedTargets = addServerTargetContact(targetId, contact, !!setAsPrimary);
    } else if (action === "set_primary_contact") {
      const { contactId } = body;
      if (!targetId || !contactId) throw new Error("Missing targetId or contactId");
      updatedTargets = setServerPrimaryContact(targetId, contactId);
    } else if (action === "log_call") {
      const { callDetails } = body;
      if (!targetId || !callDetails) throw new Error("Missing targetId or callDetails");
      updatedTargets = logServerCallActivity(targetId, callDetails);
    } else if (action === "update_stage") {
      const { stage, priority } = body;
      if (!targetId || !stage) throw new Error("Missing targetId or stage");
      updatedTargets = updateServerStage(targetId, stage, priority);
    } else if (action === "add_note") {
      const { noteText, author } = body;
      if (!targetId || !noteText) throw new Error("Missing targetId or noteText");
      updatedTargets = addServerNote(targetId, noteText, author);
    } else if (action === "log_activity") {
      const { type, summary } = body;
      if (!targetId || !summary) throw new Error("Missing targetId or summary");
      updatedTargets = logServerActivity(targetId, type || "call", summary);
    } else if (action === "log_outreach") {
      const { contactName, summary } = body;
      if (!targetId || !summary) throw new Error("Missing targetId or summary");
      updatedTargets = logServerOutreach(targetId, contactName || "", summary);
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' processed successfully on server`,
      timestamp: new Date().toISOString(),
      action,
      targetId,
      targets: updatedTargets,
    });
  } catch (err: any) {
    console.error("API /api/crm error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
