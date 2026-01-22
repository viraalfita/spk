# PDF Generation Update

## Changes Made

### 1. PDF Library

- Installed `@react-pdf/renderer` for generating PDF files
- Created a React PDF component ([app/api/pdf/[id]/spk-document.tsx](app/api/pdf/[id]/spk-document.tsx))

### 2. PDF Route Updated

- Updated [app/api/pdf/[id]/route.ts](app/api/pdf/[id]/route.ts) to generate actual PDF files
- PDF files are now stored in Supabase Storage bucket `spk-files`
- Returns PDF file instead of HTML

### 3. Supabase Storage Setup

- Created storage bucket configuration: [database/storage-setup.sql](database/storage-setup.sql)
- Run this SQL in your Supabase SQL Editor to create the bucket

### 4. SPK Actions

- Updated `publishSPK` function to generate PDF and send storage URL to webhook
- PDF URL is now a direct link to the file in Supabase Storage (e.g., `https://sffnysqgstlzjnujdjbq.supabase.co/storage/v1/object/public/spk-files/pdfs/spk-SPK-2024-001.pdf`)

## Setup Instructions

1. **Create Storage Bucket in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to Storage section
   - Run the SQL from [database/storage-setup.sql](database/storage-setup.sql) in the SQL Editor

   OR manually create:
   - Create a new bucket named `spk-files`
   - Make it public
   - Set appropriate policies for read/write access

2. **Restart Development Server:**

   ```bash
   npm run dev
   ```

3. **Test PDF Generation:**
   - Publish or view an existing SPK
   - Click "Download PDF" button
   - The first time will generate and upload the PDF to storage
   - Subsequent requests will serve the cached PDF from storage

## How It Works

1. When you click "Download PDF" or publish an SPK:
   - The `/api/pdf/[id]` endpoint is called
   - It checks if PDF already exists in storage
   - If not, it generates a new PDF using React PDF
   - Uploads to Supabase Storage at `pdfs/spk-{spk_number}.pdf`
   - Returns the PDF file

2. When webhook is triggered:
   - `pdfUrl` now contains the Supabase Storage public URL
   - n8n can download the actual PDF file from this URL
   - The PDF is a permanent file, not a temporary HTML page

## File Structure

```
app/
  api/
    pdf/
      [id]/
        route.ts          # Updated to generate PDF files
        spk-document.tsx  # New React PDF component
  actions/
    spk.ts               # Updated publishSPK to use storage URL

database/
  storage-setup.sql      # New SQL for storage bucket setup
```

## PDF URL Format

Before: `http://localhost:3001/api/pdf/{id}` (returns HTML)

After: `https://sffnysqgstlzjnujdjbq.supabase.co/storage/v1/object/public/spk-files/pdfs/spk-{spk_number}.pdf` (direct PDF file link)
