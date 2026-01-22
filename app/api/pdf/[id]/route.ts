import { NextRequest, NextResponse } from 'next/server'
import { getSPKById } from '@/app/actions/spk'
import { getPaymentsBySPK } from '@/app/actions/payment'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data: spk, success } = await getSPKById(params.id)

        if (!success || !spk) {
            return new NextResponse('SPK not found', { status: 404 })
        }

        const { data: payments } = await getPaymentsBySPK(params.id)

        // Generate HTML version of the PDF
        const html = generateSPKHTML(spk, payments || [])

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
            },
        })
    } catch (error) {
        console.error('Error generating PDF:', error)
        return new NextResponse('Failed to generate PDF', { status: 500 })
    }
}

function generateSPKHTML(spk: any, payments: any[]) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SPK ${spk.spk_number}</title>
  <style>
    @media print {
      @page { margin: 2cm; }
    }
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #1e40af;
      margin: 0;
      font-size: 28px;
    }
    .spk-number {
      font-size: 16px;
      color: #666;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      background: #eff6ff;
      padding: 10px 15px;
      font-weight: bold;
      color: #1e40af;
      border-left: 4px solid #2563eb;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      font-size: 14px;
    }
    .info-value {
      margin-top: 3px;
      color: #000;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: bold;
      color: #374151;
    }
    .total-row {
      font-weight: bold;
      background-color: #f9fafb;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      margin-top: 60px;
    }
    .signature-box {
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 80px;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SURAT PERINTAH KERJA (SPK)</h1>
    <div class="spk-number">No: ${spk.spk_number}</div>
    <div class="spk-number">Tanggal: ${formatDate(spk.created_at)}</div>
  </div>

  <div class="section">
    <div class="section-title">INFORMASI VENDOR</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nama Vendor:</div>
        <div class="info-value">${spk.vendor_name}</div>
      </div>
      ${spk.vendor_email ? `
      <div class="info-item">
        <div class="info-label">Email:</div>
        <div class="info-value">${spk.vendor_email}</div>
      </div>
      ` : ''}
      ${spk.vendor_phone ? `
      <div class="info-item">
        <div class="info-label">Telepon:</div>
        <div class="info-value">${spk.vendor_phone}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">DETAIL PROYEK</div>
    <div class="info-item">
      <div class="info-label">Nama Proyek:</div>
      <div class="info-value">${spk.project_name}</div>
    </div>
    ${spk.project_description ? `
    <div class="info-item">
      <div class="info-label">Deskripsi:</div>
      <div class="info-value">${spk.project_description}</div>
    </div>
    ` : ''}
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nilai Kontrak:</div>
        <div class="info-value" style="font-size: 18px; font-weight: bold; color: #059669;">
          ${formatCurrency(spk.contract_value)}
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Mata Uang:</div>
        <div class="info-value">${spk.currency}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Tanggal Mulai:</div>
        <div class="info-value">${formatDate(spk.start_date)}</div>
      </div>
      ${spk.end_date ? `
      <div class="info-item">
        <div class="info-label">Tanggal Selesai:</div>
        <div class="info-value">${formatDate(spk.end_date)}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">RINCIAN PEMBAYARAN</div>
    <table>
      <thead>
        <tr>
          <th>Termin</th>
          <th>Persentase</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Down Payment (DP)</td>
          <td>${spk.dp_percentage}%</td>
          <td>${formatCurrency(spk.dp_amount)}</td>
        </tr>
        <tr>
          <td>Progress Payment</td>
          <td>${spk.progress_percentage}%</td>
          <td>${formatCurrency(spk.progress_amount)}</td>
        </tr>
        <tr>
          <td>Final Payment</td>
          <td>${spk.final_percentage}%</td>
          <td>${formatCurrency(spk.final_amount)}</td>
        </tr>
        <tr class="total-row">
          <td>TOTAL</td>
          <td>100%</td>
          <td>${formatCurrency(spk.contract_value)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${spk.notes ? `
  <div class="section">
    <div class="section-title">CATATAN</div>
    <div class="info-value">${spk.notes}</div>
  </div>
  ` : ''}

  <div class="footer">
    <div class="section-title">SYARAT DAN KETENTUAN</div>
    <ul>
      <li>Vendor wajib menyelesaikan pekerjaan sesuai dengan spesifikasi yang telah disepakati.</li>
      <li>Pembayaran akan dilakukan sesuai dengan termin yang tercantum dalam SPK ini.</li>
      <li>Vendor bertanggung jawab atas kualitas pekerjaan yang dilakukan.</li>
      <li>Perubahan scope pekerjaan harus mendapat persetujuan tertulis dari kedua belah pihak.</li>
    </ul>

    <div class="signature-section">
      <div class="signature-box">
        <div>Vendor</div>
        <div class="signature-line">${spk.vendor_name}</div>
      </div>
      <div class="signature-box">
        <div>Authorized By</div>
        <div class="signature-line">${spk.created_by}</div>
      </div>
    </div>
  </div>

  <script>
    // Auto-print on load for better UX
    window.onload = function() {
      // Uncomment the line below to auto-print
      // window.print();
    };
  </script>
</body>
</html>
  `
}
