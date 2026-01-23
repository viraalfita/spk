"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { PaymentUpdateData } from "@/lib/validations/spk";
import { revalidatePath } from "next/cache";

export async function updatePaymentStatus(
  paymentId: string,
  spkId: string,
  data: PaymentUpdateData,
) {
  try {
    const { data: payment, error } = await supabaseAdmin
      .from("payment")
      .update({
        status: data.status,
        paid_date: data.paidDate || null,
        payment_reference: data.paymentReference || null,
        updated_by: "admin@company.com",
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw error;

    // Get SPK details for webhook
    const { data: spk } = await supabaseAdmin
      .from("spk")
      .select("*")
      .eq("id", spkId)
      .single();

    // Trigger n8n webhook
    if (process.env.N8N_WEBHOOK_PAYMENT_UPDATED && spk) {
      try {
        await fetch(process.env.N8N_WEBHOOK_PAYMENT_UPDATED, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "payment.updated",
            id: spk.id,
            spkNumber: spk.spk_number,
            vendorName: spk.vendor_name,
            vendorEmail: spk.vendor_email,
            vendorPhone: spk.vendor_phone,
            projectName: spk.project_name,
            projectDescription: spk.project_description,
            contractValue: spk.contract_value,
            currency: spk.currency,
            startDate: spk.start_date,
            endDate: spk.end_date,
            dpPercentage: spk.dp_percentage,
            dpAmount: spk.dp_amount,
            progressPercentage: spk.progress_percentage,
            progressAmount: spk.progress_amount,
            finalPercentage: spk.final_percentage,
            finalAmount: spk.final_amount,
            status: spk.status,
            createdAt: spk.created_at,
            updatedAt: spk.updated_at,
            createdBy: spk.created_by,
            notes: spk.notes,
            paymentId: payment.id,
            paymentTerm: payment.term,
            paymentAmount: payment.amount,
            paymentPercentage: payment.percentage,
            paymentStatus: payment.status,
            paymentPaidDate: payment.paid_date,
            paymentReference: payment.payment_reference,
            paymentUpdatedAt: payment.updated_at,
            paymentUpdatedBy: payment.updated_by,
          }),
        });
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the update if webhook fails
      }
    }

    revalidatePath(`/dashboard/${spkId}`);
    revalidatePath("/dashboard");

    // Revalidate vendor dashboard if vendor info exists
    if (spk && spk.vendor_name) {
      const vendorSlug = spk.vendor_name.toLowerCase().replace(/\s+/g, "-");
      revalidatePath(`/vendor/${vendorSlug}`);
    }

    return { success: true, data: payment };
  } catch (error) {
    console.error("Error updating payment:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function getPaymentsBySPK(spkId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("payment")
      .select("*")
      .eq("spk_id", spkId)
      .order("term", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { success: false, error: "Failed to fetch payments", data: [] };
  }
}
