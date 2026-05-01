import Header from "./components/Header";
import Footer from "./components/Footer";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, TrendingUp, Users, BarChart3, Activity, Video, FileText, MessageSquare, Search, MapPin, Star, ArrowRight, CheckCircle, Calendar } from 'lucide-react';

export default async function HomePage() {
  const session = await auth();
  if(session?.userName){
    redirect(`/dashboard/${session.role}/${session.userName}`);
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-cyan-50">
      <Header />
      
      {/* Hero Section */}
      <section className="px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-50/50 via-blue-50/30 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white border-2 border-cyan-500 text-cyan-700 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Start Your Healthcare Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-slate-900">Instant Healthcare.</span>
            <br />
            <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Intelligent Solutions.</span>
            <br />
            <span className="text-slate-900">Your Wellness.</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mt-8 leading-relaxed">
            Connect with expert doctors, get AI-powered health insights, and manage your prescriptions all from the comfort of your home.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link 
              href="/login" 
              className="group px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              Consult a Doctor Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="ml-0 md:ml-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Your Complete Healthcare{' '}
              <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-6 max-w-3xl leading-relaxed">
              Our platform leverages cutting edge technology to provide seamless, accessible, and intelligent healthcare for everyone.
            </p>
            
            <p className="text-lg text-slate-600 mb-16 max-w-4xl leading-relaxed">
              Connect with expert doctors, get AI-powered health insights, and manage your prescriptions—all from the comfort of your home. Join thousands of patients already transforming their healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-10 text-center hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-100/0 to-blue-100/0 group-hover:from-cyan-100/50 group-hover:to-blue-100/50 rounded-3xl transition-all duration-300"></div>
              <Users className="w-14 h-14 text-cyan-600 mx-auto mb-6 relative z-10" />
              <div className="text-6xl font-extrabold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 relative z-10">10,000+</div>
              <div className="text-slate-700 text-lg font-semibold relative z-10">Active Patients</div>
            </div>
            
            <div className="group relative bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-10 text-center hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-blue-100/0 to-cyan-100/0 group-hover:from-blue-100/50 group-hover:to-cyan-100/50 rounded-3xl transition-all duration-300"></div>
              <BarChart3 className="w-14 h-14 text-blue-600 mx-auto mb-6 relative z-10" />
              <div className="text-6xl font-extrabold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 relative z-10">5,000+</div>
              <div className="text-slate-700 text-lg font-semibold relative z-10">Consultations Daily</div>
            </div>
            
            <div className="group relative bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-10 text-center hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-100/0 to-blue-100/0 group-hover:from-cyan-100/50 group-hover:to-blue-100/50 rounded-3xl transition-all duration-300"></div>
              <TrendingUp className="w-14 h-14 text-cyan-600 mx-auto mb-6 relative z-10" />
              <div className="text-6xl font-extrabold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 relative z-10">500+</div>
              <div className="text-slate-700 text-lg font-semibold relative z-10">Expert Doctors</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 bg-linear-to-b from-blue-50/50 to-cyan-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              How It{' '}
              <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              Get started in four simple steps and join HealthDesk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group relative bg-white border-2 border-blue-200 rounded-3xl p-8 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-6 right-6 text-8xl font-black text-cyan-100 group-hover:text-cyan-200 transition-colors">1</div>
              <Users className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-900">Create Profile</h3>
              <p className="text-slate-600 relative z-10 leading-relaxed">
                Sign up and set up your patient profile in seconds
              </p>
              <CheckCircle className="w-6 h-6 text-green-500 mt-4 relative z-10" />
            </div>

            <div className="group relative bg-white border-2 border-blue-200 rounded-3xl p-8 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-6 right-6 text-8xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">2</div>
              <Calendar className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-900">Connect & Book</h3>
              <p className="text-slate-600 relative z-10 leading-relaxed">
                Find and book appointments with expert doctors instantly
              </p>
              <CheckCircle className="w-6 h-6 text-green-500 mt-4 relative z-10" />
            </div>

            <div className="group relative bg-white border-2 border-blue-200 rounded-3xl p-8 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-6 right-6 text-8xl font-black text-cyan-100 group-hover:text-cyan-200 transition-colors">3</div>
              <Video className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-900">Get Consultation</h3>
              <p className="text-slate-600 relative z-10 leading-relaxed">
                Video or audio consultation with AI-powered health reports
              </p>
              <CheckCircle className="w-6 h-6 text-green-500 mt-4 relative z-10" />
            </div>

            <div className="group relative bg-white border-2 border-blue-200 rounded-3xl p-8 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-6 right-6 text-8xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">4</div>
              <Heart className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-900">Track Health</h3>
              <p className="text-slate-600 relative z-10 leading-relaxed">
                Monitor your health records and medication in one place
              </p>
              <CheckCircle className="w-6 h-6 text-green-500 mt-4 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Why{' '}
              <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Choose
              </span>{' '}
              HealthDesk?
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to level up your healthcare experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-8 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Real-Time Video Consultations</h3>
              <p className="text-slate-600 leading-relaxed">
                Instantly connect with online doctors through high-quality, secure video calls. Our presence indicators show you who's available right when you need them.
              </p>
            </div>

            <div className="group bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-8 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">AI-Generated Reports & Transcription</h3>
              <p className="text-slate-600 leading-relaxed">
                During your consultation, our AI transcribes the conversation and generates a structured, easy-to-understand health report, which is automatically saved to your records.
              </p>
            </div>

            <div className="group bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Multilingual Medical Chatbot</h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant answers to your health queries in your native language. Our intelligent chatbot uses a RAG system for precise, context-aware information.
              </p>
            </div>

            <div className="group bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-8 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Predictive Symptom Analyzer</h3>
              <p className="text-slate-600 leading-relaxed">
                Enter your symptoms and our offline-capable machine learning model will predict the most likely condition, helping you understand your health better.
              </p>
            </div>

            <div className="group bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Location-Based Pharmacy Services</h3>
              <p className="text-slate-600 leading-relaxed">
                Find nearby pharmacies with the medicine you need. Our AI even helps pharmacies predict local demand, ensuring essential medications are always in stock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-6 py-20 bg-linear-to-b from-cyan-50/50 to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Community{' '}
              <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Reviews
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Hear from our patients and doctors it's easier to reach your wellness goals when you have the right healthcare partner. Take a look and join the community!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-cyan-300 hover:scale-105">
              <div className="flex justify-center mb-6 gap-1">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                {/* <Star className="w-6 h-6 text-gray-300" /> */}
              </div>
              <p className="text-slate-700 mb-6 text-center italic leading-relaxed">
                "HealthDesk made my consultation seamless and stress-free. The AI reports were spot on, and I felt heard every step of the way."
              </p>
              <div className="flex items-center justify-center pt-4 border-t border-blue-100">
                <img src="data:image/jpeg;base64,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" alt="Priya Sharma" className="w-14 h-14 rounded-full mr-4 border-2 border-cyan-300" />
                <div>
                  <div className="font-bold text-slate-900">Priya Sharma</div>
                  <div className="text-sm text-slate-500">Patient</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-cyan-300 hover:scale-105">
              <div className="flex justify-center mb-6 gap-1">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
              <p className="text-slate-700 mb-6 text-center italic leading-relaxed">
                "As a busy professional, the asynchronous video feature is a game-changer. Quick, reliable, and incredibly user-friendly."
              </p>
              <div className="flex items-center justify-center pt-4 border-t border-blue-100">
                <img src="https://lirp.cdn-website.com/69c0b277/dms3rep/multi/opt/Dr.+Shriniwas+Rajamouli+Dussa+-+Best+Cardiothoracic+and+Vascular+Surgeon+in+Hyderabad-+Telangana-+India-640w.jpg" alt="Dr. Arjun Mehta" className="w-14 h-14 rounded-full mr-4 border-2 border-cyan-300" />
                <div>
                  <div className="font-bold text-slate-900">Dr. Arjun Mehta</div>
                  <div className="text-sm text-slate-500">Doctor</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-cyan-300 hover:scale-105">
              <div className="flex justify-center mb-6 gap-1">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-slate-700 mb-6 text-center italic leading-relaxed">
                "The multilingual chatbot and symptom analyzer saved me hours. HealthDesk truly understands diverse needs."
              </p>
              <div className="flex items-center justify-center pt-4 border-t border-blue-100">
                <img src="https://i.pravatar.cc/150?u=3" alt="Ananya Iyer" className="w-14 h-14 rounded-full mr-4 border-2 border-cyan-300" />
                <div>
                  <div className="font-bold text-slate-900">Ananya Iyer</div>
                  <div className="text-sm text-slate-500">Patient Advocate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}