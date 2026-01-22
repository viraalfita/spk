"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { SPK, SPKWithPayments } from "@/lib/supabase/types";
import { generateSPKNumber } from "@/lib/utils";
import type { SPKFormData } from "@/lib/validations/spk";
import { revalidatePath } from "next/cache";

export async function createSPK(data: SPKFormData) {
  try {
    // Generate SPK number if not provided
    const spkNumber = generateSPKNumber();

    // Calculate amounts based on percentages
    const dpAmount = (data.contractValue * data.dpPercentage) / 100;
    const progressAmount = (data.contractValue * data.progressPercentage) / 100;
    const finalAmount = (data.contractValue * data.finalPercentage) / 100;

    // Insert SPK
    const { data: spk, error: spkError } = await supabaseAdmin
      .from("spk")
      .insert({
        spk_number: spkNumber,
        vendor_name: data.vendorName,
        vendor_email: data.vendorEmail || null,
        vendor_phone: data.vendorPhone || null,
        project_name: data.projectName,
        project_description: data.projectDescription || null,
        contract_value: data.contractValue,
        currency: data.currency,
        start_date: data.startDate,
        end_date: data.endDate || null,
        dp_percentage: data.dpPercentage,
        dp_amount: dpAmount,
        progress_percentage: data.progressPercentage,
        progress_amount: progressAmount,
        final_percentage: data.finalPercentage,
        final_amount: finalAmount,
        status: "draft",
        created_by: "admin@company.com",
        notes: data.notes || null,
      })
      .select()
      .single();

    if (spkError) throw spkError;

    // Create payment records
    const payments = [
      { term: "dp" as const, amount: dpAmount, percentage: data.dpPercentage },
      {
        term: "progress" as const,
        amount: progressAmount,
        percentage: data.progressPercentage,
      },
      {
        term: "final" as const,
        amount: finalAmount,
        percentage: data.finalPercentage,
      },
    ];

    const { error: paymentError } = await supabaseAdmin.from("payment").insert(
      payments.map((p) => ({
        spk_id: spk.id,
        term: p.term,
        amount: p.amount,
        percentage: p.percentage,
        status: "pending" as const,
        updated_by: "admin@company.com",
      })),
    );

    if (paymentError) throw paymentError;

    revalidatePath("/dashboard");
    return { success: true, data: spk };
  } catch (error) {
    console.error("Error creating SPK:", error);
    return { success: false, error: "Failed to create SPK" };
  }
}

export async function publishSPK(spkId: string) {
  try {
    const { data: spk, error } = await supabaseAdmin
      .from("spk")
      .update({ status: "published" })
      .eq("id", spkId)
      .select()
      .single();

    if (error) throw error;

    // Trigger n8n webhook
    if (process.env.N8N_WEBHOOK_SPK_PUBLISHED) {
      try {
        // Generate vendor link using vendor name (replace spaces with dashes)
        const vendorSlug = spk.vendor_name.toLowerCase().replace(/\s+/g, "-");
        const vendorLink = `${process.env.NEXT_PUBLIC_APP_URL}/vendor/${encodeURIComponent(vendorSlug)}`;

        await fetch(process.env.N8N_WEBHOOK_SPK_PUBLISHED, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "spk.published",
            id: spk.id,
            spkNumber: spk.spk_number,
            vendorName: spk.vendor_name,
            vendorEmail: spk.vendor_email,
            vendorPhone: spk.vendor_phone,
            vendorLink: vendorLink,
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
            pdfUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/${spk.id}`,
          }),
        });
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the publish if webhook fails
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${spkId}`);
    return { success: true, data: spk };
  } catch (error) {
    console.error("Error publishing SPK:", error);
    return { success: false, error: "Failed to publish SPK" };
  }
}

export async function getSPKs(filter?: {
  status?: string;
  vendorName?: string;
}): Promise<{ success: boolean; data: SPK[]; error?: string }> {
  try {
    let query = supabaseAdmin
      .from("spk")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter?.status) {
      query = query.eq("status", filter.status);
    }

    if (filter?.vendorName) {
      query = query.ilike("vendor_name", `%${filter.vendorName}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching SPKs:", error);
    return { success: false, error: "Failed to fetch SPKs", data: [] };
  }
}

export async function getSPKById(
  id: string,
): Promise<{ success: boolean; data?: SPKWithPayments; error?: string }> {
  try {
    const { data: spk, error: spkError } = await supabaseAdmin
      .from("spk")
      .select("*")
      .eq("id", id)
      .single();

    if (spkError) throw spkError;

    const { data: payments, error: paymentError } = await supabaseAdmin
      .from("payment")
      .select("*")
      .eq("spk_id", id)
      .order("term", { ascending: true });

    if (paymentError) throw paymentError;

    return { success: true, data: { ...spk, payments: payments || [] } };
  } catch (error) {
    console.error("Error fetching SPK:", error);
    return { success: false, error: "Failed to fetch SPK" };
  }
}

export async function deleteSPK(id: string) {
  try {
    const { error } = await supabaseAdmin.from("spk").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting SPK:", error);
    return { success: false, error: "Failed to delete SPK" };
  }
}
