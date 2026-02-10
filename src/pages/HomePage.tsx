import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield, Zap, UserPlus, BarChart3, LogIn, ArrowRight,
  ChevronLeft, ChevronRight, Star, BookOpen, ClipboardList, Users
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: Shield, title: "Admin-first Control", desc: "Full administrative control over exams, users, and results with role-based access." },
  { icon: Zap, title: "Fast Exam Setup", desc: "Create and schedule exams in minutes with flexible types, subjects, and periods." },
  { icon: UserPlus, title: "Student Onboarding", desc: "Simple self-registration for students with instant dashboard access." },
  { icon: BarChart3, title: "Results & Notifications", desc: "Automatic result generation and real-time in-app notifications." },
];

const steps = [
  { icon: LogIn, title: "Register / Login", desc: "Create an account or sign in with your credentials and role." },
  { icon: ClipboardList, title: "Admin Creates Exams", desc: "Admins set up exam types, subjects, periods, and schedule exams." },
  { icon: BarChart3, title: "Students View Results", desc: "Results are auto-generated and published for students to view." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "University Dean", quote: "This platform transformed how we manage examinations. Setup time reduced by 70%.", avatar: "SC" },
  { name: "Prof. James Miller", role: "Department Head", quote: "The automated result generation saves our staff countless hours every semester.", avatar: "JM" },
  { name: "Emily Rodriguez", role: "Student", quote: "I love how easy it is to check my results and stay updated with notifications.", avatar: "ER" },
];

const screenshots = [
  { title: "Admin Dashboard", desc: "Comprehensive overview of all exam activities" },
  { title: "Exam Management", desc: "Create and manage exams with ease" },
  { title: "Student Results", desc: "Auto-generated results at a glance" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ExamManager</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <Button onClick={() => navigate("/login")}>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Exam Management —{" "}
              <span className="text-primary">Simple. Secure. Scalable.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Create, schedule, and manage exams — fast. Role-based admin control, student self-registration, instant results and notifications.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-2xl text-base px-8" onClick={() => navigate("/login")}>
                Get Started — Login <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl text-base px-8" asChild>
                <a href="#features">See Features</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=500&fit=crop"
                alt="Students in an examination hall"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg hidden md:block">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-90">Exams Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose ExamManager?</h2>
            <p className="text-muted-foreground mt-2">Everything you need to run examinations efficiently</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="text-muted-foreground mt-2">Three simple steps to manage your examinations</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Platform Preview</h2>
          <div className="relative max-w-2xl mx-auto">
            <Card className="overflow-hidden">
              <div className="bg-primary/5 h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    {slideIdx === 0 && <BarChart3 className="h-8 w-8 text-primary" />}
                    {slideIdx === 1 && <ClipboardList className="h-8 w-8 text-primary" />}
                    {slideIdx === 2 && <Users className="h-8 w-8 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{screenshots[slideIdx].title}</h3>
                  <p className="text-muted-foreground">{screenshots[slideIdx].desc}</p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="icon" onClick={() => setSlideIdx(i => (i - 1 + screenshots.length) % screenshots.length)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {screenshots.map((_, i) => (
                <button key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slideIdx ? "bg-primary" : "bg-border"}`} onClick={() => setSlideIdx(i)} />
              ))}
              <Button variant="outline" size="icon" onClick={() => setSlideIdx(i => (i + 1) % screenshots.length)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-muted-foreground italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Box */}
      <section className="bg-muted/50 py-16">
        <div className="container max-w-3xl">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Key Concepts</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-foreground">Exam Types:</strong> <span className="text-muted-foreground">Theory, MCQ, Open-book — categorize your exams.</span></div>
                <div><strong className="text-foreground">Exam Periods:</strong> <span className="text-muted-foreground">Semesters or terms that group exams together.</span></div>
                <div><strong className="text-foreground">Subjects:</strong> <span className="text-muted-foreground">Academic subjects linked to specific exams.</span></div>
                <div><strong className="text-foreground">Auto Results:</strong> <span className="text-muted-foreground">Backend calculates marks, percentage, and pass/fail.</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground">ExamManager</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern exam management for educational institutions.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#features" className="hover:text-foreground">Features</a></div>
                <div><a href="#how-it-works" className="hover:text-foreground">How It Works</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Privacy</div>
                <div>Terms</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 ExamManager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
