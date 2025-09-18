import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navigation/navbar"
import { Search, Calendar, Star, ArrowRight, CheckCircle, Briefcase, UserCheck, Facebook, Twitter, Linkedin, CheckCircle2, Quote } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-28 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div
            className="text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
          >
            Connect with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Professional Services
            </span>
          </div>

          <div
            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find trusted providers or offer your expertise. ServiceHub makes it
            simple to connect, book, and grow.
          </div>

          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Find Services <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-4 rounded-2xl border-2 hover:bg-blue-50"
              >
                Become a Provider <Briefcase className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A secure and efficient way to connect providers with customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Search className="w-8 h-8 text-blue-600" />,
                title: "Browse Services",
                desc: "Search through hundreds of categories to find the right fit."
              },
              {
                icon: <Calendar className="w-8 h-8 text-green-600" />,
                title: "Book & Schedule",
                desc: "Seamless booking with calendar integration and instant confirmation."
              },
              {
                icon: <UserCheck className="w-8 h-8 text-purple-600" />,
                title: "Get It Done",
                desc: "Work with verified pros and track your service progress."
              }
            ].map((f, i) => (
              <div
                className="bg-white rounded-2xl shadow-lg p-8 text-center border"
              >
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ServiceHub?</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Verified Providers", desc: "All providers are background checked and verified." },
                  { title: "Secure Payments", desc: "Safe and protected payment process." },
                  { title: "24/7 Support", desc: "Round-the-clock support for any issue." },
                  { title: "Quality Guarantee", desc: "Money-back guarantee if not satisfied." },
                ].map((item, i) => (
                  <div
                    className="flex items-start space-x-4 p-4 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
                  >
                    <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Card */}
            <div
              className="bg-white p-8 rounded-2xl shadow-2xl relative"
            >
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg">
                <Quote className="w-6 h-6" />
              </div>
              <div className="flex justify-center mb-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                “ServiceHub made it incredibly easy to find a reliable web developer. The booking process was smooth and the quality of work exceeded my expectations.”
              </blockquote>
              <div className="flex items-center space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Sarah Johnson"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <cite className="text-sm text-gray-600">Sarah Johnson, Small Business Owner</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-300 to-blue-700 py-24 text-center overflow-hidden">
        <div
          className="container mx-auto px-6 relative z-10"
        >
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers and providers on ServiceHub today.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-10 py-4 text-lg rounded-2xl bg-white text-blue-700 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition">
              Join ServiceHub Now 🚀
            </Button>
          </Link>
        </div>
        {/* Animated background blob */}
        <div className="absolute inset-0 opacity-30 blur-3xl">
          <div className="bg-pink-400 w-72 h-72 rounded-full absolute top-10 left-1/4 mix-blend-multiply animate-pulse" />
          <div className="bg-blue-400 w-72 h-72 rounded-full absolute bottom-10 right-1/4 mix-blend-multiply animate-pulse delay-1000" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SH</span>
              </div>
              <span className="text-2xl font-bold text-white">ServiceHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting service providers with customers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "For Customers", links: ["Browse Services", "How It Works", "Support"] },
            { title: "For Providers", links: ["Become a Provider", "Provider Resources", "Success Stories"] },
            { title: "Company", links: ["About Us", "Privacy Policy", "Terms of Service"] },
          ].map((col, i) => (
            <div key={i}>
              <h3 className="font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href="/login" className="hover:text-white transition">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

