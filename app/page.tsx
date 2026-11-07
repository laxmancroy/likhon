import TypingTest from "@/components/TypingTest";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10">

      <section className="flex flex-1 flex-col justify-center pb-20">
        <TypingTest />
      </section>

    </main>
  );
}
