import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Video, FileText, Bot, HeartPulse } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function PatientDashboard({ params }) {

  const resolvedParams = await params;
  const patName = resolvedParams?.patName ? decodeURIComponent(resolvedParams.patName) : resolvedParams?.patName;

  const session = await auth();

  const name = session.userName;
  const phonenum = session.phone;

  if (name !== patName) {
    redirect(`/dashboard/patient/${encodeURIComponent(name)}`);
  }

  const features = [
    {
      id: "video-consultation",
      title: "Video Consultation",
      description:
        "Connect with doctors through secure video calls for remote consultations and medical advice.",
      icon: Video,
      href: `/consultation`,
    },
    {
      id: "ai-assistant",
      title: "Medical AI Assistant",
      description:
        "Get instant answers to health questions and personalized health insights from our AI helper.",
      icon: Bot,
      href: `/medicalAssistant`,
    },
    {
      id: "health-records",
      title: "Health Records",
      description:
        "Access and manage your complete medical history, test results, and health documents.",
      icon: FileText,
      href: `/records/options`,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-br from-cyan-50 via-white to-slate-100">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-200 opacity-20 blur-3xl"></div>

        <div className="absolute -bottom-16 -left-16 h-56 w-56 rotate-45 bg-sky-300 opacity-15 blur-2xl"></div>

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 opacity-10 blur-3xl"></div>

        <div className="absolute -bottom-12 -right-12 h-48 w-48 rotate-12 bg-sky-400 opacity-12 blur-2xl"></div>

        <div className="absolute left-[20%] top-[10%] h-24 w-24 rounded-full bg-cyan-200 opacity-15 blur-2xl"></div>
        <div className="absolute left-[15%] top-[70%] h-20 w-20 rotate-30 bg-sky-300 opacity-12 blur-xl"></div>
        <div className="absolute left-[75%] top-[50%] h-32 w-32 rounded-full bg-cyan-100 opacity-10 blur-3xl"></div>
        <div className="absolute left-[60%] top-[25%] h-28 w-28 rotate-12 bg-sky-400 opacity-18 blur-2xl"></div>
      </div>

      <Header />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-8">

        <div className="mx-auto mb-12 max-w-[900px] rounded-2xl border border-cyan-200 bg-white px-7 py-7 text-center">
          <div className="mx-auto mb-4 inline-flex items-center border-b-2 border-cyan-600 px-3 pb-1 text-sm font-semibold text-cyan-700">
            Patient Dashboard
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <HeartPulse size={36} className="text-cyan-600" strokeWidth={2.5} />
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
              Hi {patName ?? "Friend"}, welcome back!
            </h2>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            We will be your Care That Listens, Care That Heals.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-slate-600">
            Book consultations, review your records, and use the AI assistant for your care journey.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto mb-16 md:grid-cols-2">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link key={feature.id} href={feature.href} className="group">
                <div className="relative h-full rounded-2xl border-l-4 border-l-cyan-500 border border-cyan-100 bg-white p-8 transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50/40">

                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-cyan-500 opacity-80"></div>

                  <div className="relative z-10 mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600">
                      <IconComponent size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}