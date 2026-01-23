export function DevelopmentBanner() {
  return (
    <div className="sticky top-0 z-[60] bg-amber-500 text-amber-950 text-center py-2 px-4 font-medium text-sm">
      <span className="hidden sm:inline">
        ⚠️ ENTWICKLUNGSVERSION – Nur für Testzwecke. Keine echten Patientendaten eingeben.
      </span>
      <span className="sm:hidden">
        ⚠️ ENTWICKLUNGSVERSION – Keine echten Patientendaten!
      </span>
    </div>
  );
}
