-- Apply once BEFORE deploying the draft-aware application.
-- Existing notes are already public: preserve their visibility.
-- The conditional makes rerunning safe without publishing any later drafts.
BEGIN;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'Note' AND column_name = 'published'
  ) THEN
    ALTER TABLE "Note" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE "Note" ALTER COLUMN "published" SET DEFAULT false;
  END IF;
END $$;
COMMIT;
