# Draft rollout

No article content is included in this change. Do not add private notes until rollout and verification are complete.

1. Back up the database using the existing provider workflow.
2. Apply `scripts/sql/add-note-drafts.sql` once to the target database. It preserves existing public notes and defaults future records to private. It is safe to rerun. The project has no Prisma migration history; do not substitute `prisma db push` because that would hide existing notes by default.
3. Deploy the draft-aware application from this change. Do not import drafts during the interval between steps 2 and 3: the old application does not filter public reads.
4. In the admin dashboard, create a harmless test draft. Verify it is absent from `/`, `/notes`, the public slug URL (404), and public metadata. Sign out and verify the admin editor cannot be opened.
5. Verify an existing published note remains available. Delete the disposable test using the normal admin workflow.
6. Import private content through the admin only after those checks pass. New notes always save as drafts. Review/edit each note and use its separate Publish Note action only on individual approval.

Never roll back to the old unfiltered application while private drafts exist. A rollback must retain the public `published: true` filters, or the site must be put into maintenance until that is possible.
