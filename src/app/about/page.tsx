import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Eye,
  MessageSquareQuote,
  Lock,
  Brain,
  Lightbulb,
  Target,
  CheckCircle2,
  Globe,
  Heart,
  Scale,
  BookOpen,
  BarChart3
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Reconcile — Our Mission, Vision & How It Works',
  description:
    'Reconcile is an AI communication mediator that helps people understand each other without taking sides. Learn about our mission, vision, and the problem we solve.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] font-sans text-stone-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-stone-900 font-semibold tracking-tight text-lg hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <svg
                className="w-4 h-4 text-stone-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="12" r="5" stroke="currentColor" fill="none" />
                <circle cx="15" cy="12" r="5" stroke="currentColor" fill="none" opacity="0.6" />
              </svg>
            </div>
            <span>Reconcile</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ============================================= */}
        {/* HERO / OPENING                                */}
        {/* ============================================= */}
        <section className="text-center mb-20 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            About Reconcile
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.1]">
            We don&apos;t pick sides.{' '}
            <span className="block text-stone-600 font-normal">
              We bridge gaps.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Reconcile is an AI-powered communication mediator. When two people can&apos;t talk without
            arguing or shutting down, Reconcile steps in — listens to both sides privately, finds where
            intent and impact got crossed, and helps them actually understand each other.
          </p>
        </section>

        {/* ============================================= */}
        {/* THE PROBLEM                                    */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 text-white space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">The problem we&apos;re solving</h2>
            <div className="space-y-5 text-stone-300 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                Every day, millions of conversations go wrong. Not because people are bad — but because they misread each other.
              </p>
              <p>
                A parent asks about grades every day. They mean: <em className="text-white font-medium">&ldquo;I love you and I&apos;m scared for your future.&rdquo;</em> Their child hears: <em className="text-white font-medium">&ldquo;I don&apos;t trust you.&rdquo;</em>
              </p>
              <p>
                A friend goes silent after a fight. They mean: <em className="text-white font-medium">&ldquo;I need time to cool down so I don&apos;t say something I&apos;ll regret.&rdquo;</em> Their friend hears: <em className="text-white font-medium">&ldquo;I don&apos;t care about this friendship.&rdquo;</em>
              </p>
              <p className="text-white font-medium text-lg sm:text-xl pt-2">
                The gap between what people mean and what people hear — that&apos;s where relationships break. That&apos;s exactly where Reconcile works.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* MISSION                                       */}
        {/* ============================================= */}
        <section className="mb-20 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">Our Mission</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-0.5">Why we exist</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-14 space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
            <p className="text-xl sm:text-2xl font-medium text-stone-900">
              To make sure no relationship breaks because of a misunderstanding.
            </p>
            <p>
              We believe most conflict between people who care about each other isn&apos;t caused by bad intentions. It&apos;s caused by a gap — between what someone meant and how it felt to the other person.
            </p>
            <p>
              Reconcile exists to close that gap. We give people a safe, private place to express what they really feel, help them see the other person&apos;s perspective clearly, and give them the exact words to start a better conversation.
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* VISION                                        */}
        {/* ============================================= */}
        <section className="mb-20 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">Our Vision</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-0.5">Where we&apos;re headed</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-14 space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
            <p className="text-xl sm:text-2xl font-medium text-stone-900">
              A world where people talk to understand — not to win.
            </p>
            <p>
              We envision a future where anyone in the middle of a conflict has an intelligent, empathetic, and completely neutral place to turn — before things spiral. Where children and parents actually get each other. Where friendships survive the tough conversations.
            </p>
            <p>
              Not because a machine solved their problems for them. But because a machine helped them see what they couldn&apos;t see alone.
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* THE IDEA / HOW IT WORKS                       */}
        {/* ============================================= */}
        <section className="mb-20 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">The Idea</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-0.5">How Reconcile actually works</p>
            </div>
          </div>
          <div className="pl-0 sm:pl-14 space-y-6 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
            <p>
              Reconcile works like a calm, emotionally intelligent mutual friend who talks to both people separately and helps them see each other&apos;s perspective — without revealing private confessions.
            </p>

            {/* Process diagram */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="text-center text-xs uppercase tracking-wider font-semibold text-stone-600 bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
                PERSON A (Private) &harr; <span className="text-stone-900 font-bold">RECONCILE MEDIATOR</span> &harr; PERSON B (Private)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">Person A talks privately</p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    Shares raw feelings, anger, and frustration. Reconcile validates the emotion without judgment and identifies the underlying core need.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">Person B talks privately</p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    Receives a neutral, non-accusatory invitation to share their side. No blame, no guilt trips, and zero forwarded raw text.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-300">
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">The Mediation Bridge</p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Reconcile reveals the exact gap between what was intended and what was felt, finds genuine common ground, and provides practical language to move forward.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CORE PRINCIPLES                                */}
        {/* ============================================= */}
        <section className="mb-20 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">What We Believe</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-0.5">The principles that guide our product</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-14">
            {[
              {
                icon: Scale,
                title: 'Never take sides',
                body: 'We validate feelings — not hostile assumptions. Both people deserve to be heard. Always.',
              },
              {
                icon: Lock,
                title: 'Privacy is sacred',
                body: 'Raw words stay strictly private. We only share neutral translations and agreed common ground.',
              },
              {
                icon: Heart,
                title: 'Intention isn’t the same as impact',
                body: 'Someone can hurt you without meaning to. Both the intent and the impact are real. We honor both.',
              },
              {
                icon: Brain,
                title: 'Understanding, not diagnosing',
                body: 'We are not therapists. We don’t label people as “toxic” or “narcissistic”. We help people see each other clearly.',
              },
              {
                icon: Shield,
                title: 'Safety comes first',
                body: 'If someone mentions self-harm, violence, or abuse, we immediately provide direct crisis resources.',
              },
              {
                icon: Globe,
                title: 'Accessible to everyone',
                body: 'A teenager fighting with parents or long-time partners — both deserve calm, dignified resolution.',
              }
            ].map((principle, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-1">
                  <principle.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900">{principle.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================= */}
        {/* RESEARCH & SURVEY INSIGHTS                    */}
        {/* ============================================= */}
        <section className="mb-20 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">User Research &amp; Survey Data</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-0.5">
                Research presented at NanoSpark 2026 &bull; Shivaji University, Kolhapur (UG 22)
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-14 space-y-6">
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
              Reconcile AI was developed following empirical user research analyzing the psychological
              and communicative bottlenecks people face during emotional disagreements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-2xl font-bold text-stone-900 font-mono">82%</span>
                <p className="text-xs font-semibold text-stone-900">Feel Misunderstood</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Report that after an argument, the other person never truly understood what they were trying to say.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-2xl font-bold text-stone-900 font-mono">78%</span>
                <p className="text-xs font-semibold text-stone-900">Want a Neutral Bridge</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Agree that an impartial, neutral third party helps break defensive stalemates between two people.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <span className="text-2xl font-bold text-stone-900 font-mono">Top #1</span>
                <p className="text-xs font-semibold text-stone-900">Fear of Judgment</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Identified fear of escalating the conflict as the primary barrier preventing honest vulnerability.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200 text-xs text-stone-600 space-y-2">
              <span className="font-semibold text-stone-900 block">Future Roadmap from Conference Research:</span>
              <p>
                ❖ WhatsApp-based direct invitation &amp; mediation flow &bull; ❖ Voice-guided conversational intake &bull; ❖ Stress and emotional regulation support &bull; ❖ Full-fledged mobile companion app.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* WHAT WE'RE NOT                                */}
        {/* ============================================= */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 space-y-6 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">What Reconcile is not</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
              {[
                'Not a generic AI chatbot or ChatGPT clone',
                'Not a therapist or clinical mental health service',
                'Not a relationship judge — we never assign blame',
                'Not a real-time peer-to-peer chat between participants',
                'Not a social network or dating app',
                'Not a subscription paywall — free to use in Alpha MVP',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-stone-400 font-bold text-xs">&times;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CLOSING CTA                                    */}
        {/* ============================================= */}
        <section className="text-center space-y-5 pb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900">
            Ready to try it?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-normal">
            No account. No signup. No data stored. Just explain what happened and we&apos;ll help you find the words.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-stone-900 text-white text-sm font-medium shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
          >
            <span>Tell Me What Happened</span>
            <MessageSquareQuote className="w-4 h-4" />
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-stone-700 font-medium">
            Understanding someone doesn&apos;t mean agreeing with them.
          </p>
          <p className="text-stone-400">
            &copy; {new Date().getFullYear()} Reconcile AI &middot; Confidential Two-Sided Mediation
          </p>
        </div>
      </footer>
    </main>
  );
}
