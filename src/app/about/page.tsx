import type { Metadata } from 'next';
import Link from 'next/link';
import {
  HeartHandshake,
  ArrowLeft,
  Shield,
  Eye,
  MessageSquareQuote,
  Users,
  Lock,
  Brain,
  Lightbulb,
  Target,
  Sparkles,
  CheckCircle2,
  Globe,
  Heart,
  Scale,
  BookOpen
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Reconcile AI — Our Mission, Vision & How It Works',
  description:
    'Reconcile AI is an AI communication mediator that helps people understand each other without taking sides. Learn about our mission, vision, and the problem we solve.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-primary-700)] font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <HeartHandshake className="w-6 h-6" />
            <span>Reconcile</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ============================================= */}
        {/* HERO / OPENING                                */}
        {/* ============================================= */}
        <section className="text-center mb-20 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            About Reconcile AI
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            We don&apos;t pick sides.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              We bridge gaps.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Reconcile AI is an AI-powered communication mediator. When two people can&apos;t talk without arguing or shutting down, Reconcile steps in — listens to both sides privately, finds where things got crossed, and helps them actually understand each other.
          </p>
        </section>

        {/* ============================================= */}
        {/* THE PROBLEM                                    */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">The problem we&apos;re solving</h2>
            <div className="space-y-5 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>
                Every day, millions of conversations go wrong. Not because people are bad — but because they misread each other.
              </p>
              <p>
                A parent asks about grades every day. They mean: <em className="text-white font-medium">&ldquo;I love you and I&apos;m scared for your future.&rdquo;</em> Their child hears: <em className="text-white font-medium">&ldquo;I don&apos;t trust you.&rdquo;</em>
              </p>
              <p>
                A friend goes silent after a fight. They mean: <em className="text-white font-medium">&ldquo;I need time to cool down so I don&apos;t say something I&apos;ll regret.&rdquo;</em> Their friend hears: <em className="text-white font-medium">&ldquo;I don&apos;t care about this friendship.&rdquo;</em>
              </p>
              <p className="text-white font-semibold text-lg sm:text-xl pt-2">
                The gap between what people mean and what people hear — that&apos;s where relationships break. That&apos;s exactly where Reconcile works.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* MISSION                                       */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-500 text-sm mt-1">Why we exist</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-16 space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            <p className="text-xl sm:text-2xl font-semibold text-gray-900">
              To make sure no relationship breaks because of a misunderstanding.
            </p>
            <p>
              We believe most conflict between people who care about each other isn&apos;t caused by bad intentions. It&apos;s caused by a gap — between what someone meant and how it felt to the other person.
            </p>
            <p>
              Reconcile AI exists to close that gap. We give people a safe, private place to express what they really feel, help them see the other person&apos;s perspective clearly, and give them the exact words to start a better conversation.
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* VISION                                        */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Vision</h2>
              <p className="text-gray-500 text-sm mt-1">Where we&apos;re headed</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-16 space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            <p className="text-xl sm:text-2xl font-semibold text-gray-900">
              A world where people talk to understand — not to win.
            </p>
            <p>
              We envision a future where anyone in the middle of a conflict has an intelligent, empathetic, and completely neutral place to turn — before things spiral. Where children and parents actually get each other. Where friendships survive the tough conversations. Where partners stop fighting about the same thing over and over.
            </p>
            <p>
              Not because a machine solved their problems for them. But because a machine helped them see what they couldn&apos;t see alone.
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* THE IDEA / HOW IT WORKS                       */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The Idea</h2>
              <p className="text-gray-500 text-sm mt-1">How Reconcile actually works</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-16 space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
            <p>
              Reconcile works like a calm, emotionally intelligent mutual friend who talks to both people separately and helps them see each other&apos;s perspective — without revealing private confessions.
            </p>

            {/* Process diagram */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">The architecture is simple:</h3>
              <div className="text-center text-sm sm:text-base font-semibold text-gray-700 bg-slate-50 rounded-xl p-4 border border-slate-100">
                PERSON A &harr; <span className="text-indigo-600">RECONCILE AI</span> &harr; PERSON B
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-900 mb-1">Person A talks privately</p>
                  <p className="text-sm text-gray-700">Shares their raw feelings, anger, frustration — everything. Reconcile listens, validates their emotions, and identifies the underlying need.</p>
                </div>
                <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-100">
                  <p className="text-sm font-bold text-violet-900 mb-1">Person B talks privately</p>
                  <p className="text-sm text-gray-700">Gets a neutral, compassionate invitation to share their side. No blame. No accusations. Just a chance to be heard too.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <p className="text-sm font-bold text-emerald-900 mb-1">The Mediation Bridge</p>
                <p className="text-sm text-gray-700">Reconcile brings together what both people said (without revealing private confessions) and shows: what was meant, what was felt, where things got crossed, what they have in common, and a ready-to-send message to start a real conversation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CORE PRINCIPLES                                */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What We Believe</h2>
              <p className="text-gray-500 text-sm mt-1">The principles that guide everything we build</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-16">
            {[
              {
                icon: Scale,
                title: 'Never take sides',
                body: 'We validate feelings — not assumptions. Both people deserve to be heard. Always.',
                color: 'indigo'
              },
              {
                icon: Lock,
                title: 'Privacy is sacred',
                body: "Raw words stay private. We only share neutral translations and common ground. Never the messy parts.",
                color: 'emerald'
              },
              {
                icon: Heart,
                title: "Intention isn't the same as impact",
                body: "Someone can hurt you without meaning to. Both the intent and the impact are real. We honor both.",
                color: 'rose'
              },
              {
                icon: Brain,
                title: 'Understanding, not diagnosing',
                body: "We're not therapists. We don't label anyone as \"toxic\" or \"narcissistic\". We help people see each other clearly.",
                color: 'purple'
              },
              {
                icon: Shield,
                title: 'Safety comes first',
                body: "If someone mentions self-harm, violence, or abuse, we don't treat it as a normal disagreement. We provide crisis resources immediately.",
                color: 'amber'
              },
              {
                icon: Globe,
                title: 'Made for everyone',
                body: "A 15-year-old fighting with their parents and a couple married 20 years — both deserve the same quality of help.",
                color: 'sky'
              }
            ].map((principle, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md transition-all">
                <div className={`w-9 h-9 rounded-xl bg-${principle.color}-50 border border-${principle.color}-100 text-${principle.color}-600 flex items-center justify-center mb-3`}>
                  <principle.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{principle.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================= */}
        {/* KEY FEATURES                                   */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Features</h2>
              <p className="text-gray-500 text-sm mt-1">What Reconcile does for you</p>
            </div>
          </div>

          <div className="space-y-4 pl-0 sm:pl-16">
            {[
              {
                title: 'Private two-sided intake',
                description: 'Each person gets their own confidential conversation with Reconcile. Say everything — the anger, the hurt, the confusion. Nothing is shared raw.',
              },
              {
                title: 'Emotional intelligence, not scripts',
                description: 'Reconcile adapts to how you talk. It validates what you feel without validating assumptions. It asks the right follow-up questions to get to what you actually need.',
              },
              {
                title: 'Neutral invitation system',
                description: "When you're ready, Reconcile reaches out to the other person with a calm, neutral invitation — no blame, no accusations, no revealing what you said. Just an open door.",
              },
              {
                title: 'Intention vs. Impact breakdown',
                description: 'The core insight: we show both people exactly where things got crossed — what was meant vs. how it landed. Most conflicts dissolve once both people see this clearly.',
              },
              {
                title: 'Joint Mediation Bridge',
                description: 'A shared view that reveals common ground, validates both perspectives, and shows the exact gap between what was intended and what was received.',
              },
              {
                title: 'Ready-to-send conversation starters',
                description: "Not therapy-speak. Not a corporate script. Real messages that sound like you — but open a door instead of starting another fight. Copy, personalize, send.",
              },
              {
                title: 'Built-in safety system',
                description: 'If someone mentions self-harm, violence, or abuse, Reconcile stops the mediation flow immediately and provides direct links to crisis resources. Safety always comes first.',
              },
              {
                title: 'Works offline — no API key needed',
                description: 'Pre-built demo scenarios work completely offline with no cloud dependencies. Perfect for events, presentations, and quick demonstrations.',
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-2xs hover:shadow-xs transition-all">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================= */}
        {/* WHAT WE'RE NOT                                */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Reconcile is not</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              {[
                'Not a chatbot or ChatGPT clone',
                'Not a therapist or mental health service',
                'Not a relationship judge — we never assign blame',
                'Not a real-time chat between two people',
                'Not a social network or dating app',
                'Not a subscription service — it\'s free to use',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-red-400 font-bold text-base">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CLOSING CTA                                    */}
        {/* ============================================= */}
        <section className="text-center space-y-6 pb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Ready to try it?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            No account. No signup. No data stored. Just tell us what happened and we&apos;ll help you figure out what to say.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white text-base font-semibold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
          >
            <span>Tell Me What Happened</span>
            <MessageSquareQuote className="w-5 h-5" />
          </Link>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
          <p className="text-base font-medium text-gray-700">
            Understanding someone doesn&apos;t mean agreeing with them.
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Reconcile AI &middot; No accounts. No data stored. Just clarity.
          </p>
        </div>
      </footer>
    </main>
  );
}
