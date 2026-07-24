export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HouseDesign</h1>
        <p className="text-slate-400">Current Locale: {locale} — Localization is active and running!</p>
      </div>
    </main>
  );
}