# Setup Supabase Storage untuk PDF Files

## Langkah Setup

### 1. Buat Storage Bucket di Supabase

Login ke Supabase Dashboard dan jalankan SQL berikut di SQL Editor:

```sql
-- Create storage bucket for SPK PDF files
INSERT INTO storage.buckets (id, name, public)
VALUES ('spk-files', 'spk-files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'spk-files');

CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'spk-files');

CREATE POLICY "Authenticated Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'spk-files');

CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'spk-files');
```

**ATAU** Buat secara manual:

1. Buka Supabase Dashboard > Storage
2. Klik "Create new bucket"
3. Nama: `spk-files`
4. Centang "Public bucket"
5. Klik "Create bucket"

### 2. Test PDF Generation

1. Buka aplikasi di http://localhost:3001/dashboard
2. Buka salah satu SPK yang sudah ada
3. Klik tombol "Download PDF"
4. PDF akan di-generate dan disimpan ke Supabase Storage
5. File akan tersimpan di path: `pdfs/spk-{spk_number}.pdf`

### 3. Verifikasi

Check Supabase Storage untuk memastikan file PDF ter-upload:

- Buka Supabase Dashboard > Storage > spk-files
- Anda akan melihat folder `pdfs/` dengan file PDF di dalamnya

## Cara Kerja

1. **Generate PDF**: Saat endpoint `/api/pdf/[id]` dipanggil, sistem akan:
   - Check apakah PDF sudah ada di Storage
   - Jika sudah ada, return file yang ada
   - Jika belum, generate PDF baru menggunakan @react-pdf/renderer
   - Upload ke Supabase Storage
   - Update kolom `pdf_url` di database
   - Return PDF file

2. **Webhook n8n**: Saat SPK di-publish:
   - PDF akan di-generate secara otomatis
   - `pdfUrl` di webhook akan berisi URL public dari Supabase Storage
   - Format: `https://sffnysqgstlzjnujdjbq.supabase.co/storage/v1/object/public/spk-files/pdfs/spk-{number}.pdf`

## Perubahan File

- ✅ `app/api/pdf/[id]/route.tsx` - Generate dan return PDF file (bukan HTML)
- ✅ `app/api/pdf/[id]/spk-document.tsx` - React PDF component untuk layout
- ✅ `app/actions/spk.ts` - Update publishSPK untuk kirim URL Storage
- ✅ `database/storage-setup.sql` - SQL untuk setup storage bucket
- ✅ `package.json` - Tambah dependency `@react-pdf/renderer`

## Troubleshooting

### PDF tidak ter-generate

- Pastikan Supabase Storage bucket `spk-files` sudah dibuat
- Check console untuk error messages
- Verifikasi SUPABASE_SERVICE_ROLE_KEY di .env.local

### PDF tidak bisa di-download

- Pastikan bucket di-set sebagai public
- Check RLS policies di Storage
- Verifikasi URL di browser

### Webhook tidak menerima PDF URL

- Check apakah PDF sudah di-generate
- Verifikasi `NEXT_PUBLIC_APP_URL` di .env.local
- Check n8n webhook logs
