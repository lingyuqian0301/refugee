import RefugeeRegistration from "../components/RefugeeRegistration";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center h-full">
        <RefugeeRegistration />
      </main>
    </div>
  );
}

