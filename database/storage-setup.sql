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
