-- Ölçme rızası geri alınan (ya da okulca geçersiz sayılan) öğrencilerin, geri almadan önce başlamış
-- bütün uygulamaları "geçersiz" sayılır. Uygulama kodu bunu artık geri alma anında yapıyor; bu
-- geçiş, önceki kayıtları aynı kurala getirir. Yeniden çalıştırılması bir şey değiştirmez.
UPDATE "attempts" a
SET "status" = 'invalidated'
WHERE a."status" <> 'invalidated'
  AND EXISTS (
    SELECT 1
    FROM "consent_records" cr
    JOIN "legal_documents" d ON d."id" = cr."document_id"
    WHERE cr."subject_student_id" = a."student_id"
      AND d."kind" = 'consent_assessment'
      AND cr."revoked_at" IS NOT NULL
      AND cr."revoked_at" >= a."started_at"
  );
--> statement-breakpoint
-- Silinmiş profillerin uygulamaları da geçersizdir (veriler günlük temizlikte silinir).
UPDATE "attempts" a
SET "status" = 'invalidated'
FROM "students" s
WHERE s."id" = a."student_id" AND s."deleted_at" IS NOT NULL AND a."status" <> 'invalidated';
