import { getPaymentsBySPK } from "@/app/actions/payment";
import { getSPKById } from "@/app/actions/spk";
import { supabaseAdmin } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import SPKDocument from "./spk-document";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { data: spk, success } = await getSPKById(params.id);

    if (!success || !spk) {
      return new NextResponse("SPK not found", { status: 404 });
    }

    const { data: payments } = await getPaymentsBySPK(params.id);

    // Check if PDF already exists in storage
    const fileName = `spk-${spk.spk_number}.pdf`;
    const filePath = `pdfs/${fileName}`;

    // Try to get existing PDF
    const { data: existingFile } = await supabaseAdmin.storage
      .from("spk-files")
      .download(filePath);

    if (existingFile) {
      // Return existing PDF
      return new NextResponse(existingFile, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fileName}"`,
        },
      });
    }

    // Generate new PDF
    const pdfBuffer = await renderToBuffer(
      <SPKDocument spk={spk} payments={payments || []} />,
    );

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("spk-files")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading PDF:", uploadError);
      throw uploadError;
    }

    // Update SPK with PDF URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("spk-files")
      .getPublicUrl(filePath);

    await supabaseAdmin
      .from("spk")
      .update({ pdf_url: publicUrlData.publicUrl })
      .eq("id", params.id);

    // Return the generated PDF
    const arrayBuffer = new Uint8Array(pdfBuffer).buffer;
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
