import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router-dom";
import {
  BarChart2,
  Award,
  FileText,
  Youtube,
  Star,
  ChevronRight,
  ArrowRight,
  Check,
} from "lucide-react";
import Navbar from "./ui/Navbar";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Smooth scroll for anchor links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href") || "");
        if (target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50/80 via-orange-100/30 to-transparent"></div>
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-200/20 blur-3xl"></div>
          <div className="absolute top-[60%] -left-[5%] w-[30%] h-[30%] rounded-full bg-orange-300/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                AI-Powered YouTube Optimization
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-800 dark:text-orange-300 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                Optimize Your YouTube Content for{" "}
                <span className="text-orange-600 dark:text-orange-400">
                  Maximum Reach
                </span>
              </h1>

              <p className="text-lg md:text-xl text-orange-700/80 dark:text-orange-200/80 mb-8 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                Analyze and enhance your video metadata with AI-powered
                recommendations to improve discoverability and engagement. Get
                detailed insights and actionable tips.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                <Button
                  onClick={() => navigate("/signup")}
                  className="py-6 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl text-lg group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="py-6 px-8 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 rounded-lg transition-colors text-lg"
                >
                  Sign In
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-orange-700/70 dark:text-orange-200/70 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Free tier available</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-xl blur-md opacity-30 animate-pulse"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-orange-100 dark:border-orange-800/30 rounded-xl shadow-2xl overflow-hidden">
                  <img
                    src="/dashboard-actual.png"
                    alt="Reach Optimizer Dashboard"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/1200x600/orange/white?text=Reach+Optimizer+Dashboard";
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        4.9/5 Rating
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        From 500+ users
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50/50 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
              <span>FEATURES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300 mb-4">
              Powerful Features to Boost Your YouTube Presence
            </h2>
            <p className="text-lg text-orange-700/80 dark:text-orange-200/80">
              Our comprehensive toolkit helps you optimize your content for
              maximum reach and engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 className="h-12 w-12 text-orange-600" />}
              title="Detailed SEO Analysis"
              description="Get comprehensive scoring on title and description optimization factors including keyword relevance, placement, and uniqueness."
              gradient="from-orange-500/20 to-orange-600/10"
              delay="0"
            />

            <FeatureCard
              icon={<Award className="h-12 w-12 text-orange-600" />}
              title="AI-Powered Recommendations"
              description="Receive intelligent suggestions to improve your metadata based on competitive analysis and SEO best practices."
              gradient="from-orange-600/20 to-orange-700/10"
              delay="100"
            />

            <FeatureCard
              icon={<FileText className="h-12 w-12 text-orange-600" />}
              title="Professional Reports"
              description="Generate detailed professional reports with actionable insights to enhance your video's discoverability."
              gradient="from-orange-500/20 to-orange-600/10"
              delay="200"
            />
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={() => navigate("/signup")}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors py-3 px-6 text-lg group"
            >
              Explore All Features
              <ChevronRight className="ml-1 h-5 w-5 inline transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <img
            src="/wave-pattern.svg"
            alt=""
            className="absolute bottom-0 left-0 w-full"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300 mb-4">
              Simple Three-Step Process
            </h2>
            <p className="text-lg text-orange-700/80 dark:text-orange-200/80">
              Our intuitive workflow makes it easy to optimize your YouTube
              content in minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-1 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 -translate-y-1/2 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-orange-100 dark:border-orange-800/30 relative z-10 h-full">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="pt-6 pb-4 text-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Youtube className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Enter Your Video Metadata
                    </h3>
                    <p className="text-orange-700/80 dark:text-orange-200/80">
                      Input your video title and description to begin the
                      optimization process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-orange-100 dark:border-orange-800/30 relative z-10 h-full">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="pt-6 pb-4 text-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Get Detailed Analysis
                    </h3>
                    <p className="text-orange-700/80 dark:text-orange-200/80">
                      Our system analyzes your content against key SEO factors
                      and provides comprehensive scoring.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-orange-100 dark:border-orange-800/30 relative z-10 h-full">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="pt-6 pb-4 text-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Implement Recommendations
                    </h3>
                    <p className="text-orange-700/80 dark:text-orange-200/80">
                      Apply our AI-generated suggestions to improve your video's
                      discoverability and engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl py-3 px-6 text-lg"
              >
                Try It Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50/50 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-orange-700/80 dark:text-orange-200/80">
              Join thousands of content creators who have improved their YouTube
              performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Content Creator"
              quote="Reach Optimizer helped me increase my video views by 45% in just one month. The AI recommendations were spot on!"
              delay="0"
            />

            <TestimonialCard
              name="Michael Chen"
              role="YouTube Educator"
              quote="I've tried many SEO tools, but this one actually delivers results. My channel growth has been exponential since I started using it."
              delay="100"
            />

            <TestimonialCard
              name="Jessica Williams"
              role="Marketing Manager"
              quote="The detailed analytics and actionable recommendations make this tool invaluable for our content strategy. Highly recommended!"
              delay="200"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/5"></div>
          <img
            src="/wave-pattern.svg"
            alt=""
            className="absolute bottom-0 left-0 w-full transform rotate-180 opacity-10"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-12 border border-orange-200 dark:border-orange-800/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300 mb-6">
                Ready to Optimize Your YouTube Content?
              </h2>
              <p className="text-xl text-orange-700/80 dark:text-orange-200/80 mb-10 max-w-2xl mx-auto">
                Join thousands of content creators who are improving their
                YouTube performance with Reach Optimizer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/signup")}
                  className="py-6 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl text-lg group"
                >
                  Start Optimizing Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="py-6 px-8 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 rounded-lg transition-colors text-lg"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-orange-100 dark:border-orange-800/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.svg"
                  alt="Reach Optimizer Logo"
                  className="h-10 w-10"
                />
                <h2 className="text-xl font-bold text-orange-800 dark:text-orange-300">
                  Reach Optimizer
                </h2>
              </div>
              <p className="text-orange-700/80 dark:text-orange-200/80 max-w-md mb-6">
                The ultimate YouTube metadata optimization tool to help content
                creators improve discoverability and engagement.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-orange-700/80 dark:text-orange-200/80 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-100 dark:border-orange-800/30 mt-12 pt-8 text-center text-orange-700/60 dark:text-orange-200/60">
            <p>
              © {new Date().getFullYear()} Reach Optimizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient,
  delay,
}) => {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-5 duration-700 delay-${delay}`}
    >
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-orange-100 dark:border-orange-800/30 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] h-full overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 bg-orange-100 dark:bg-orange-900/30 w-20 h-20 rounded-full flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-3">
              {title}
            </h3>
            <p className="text-orange-700/80 dark:text-orange-200/80">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  delay: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  quote,
  delay,
}) => {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-5 duration-700 delay-${delay}`}
    >
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-orange-100 dark:border-orange-800/30 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] h-full">
        <CardContent className="p-8">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <svg
                className="h-8 w-8 text-orange-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-orange-700/90 dark:text-orange-200/90 mb-6 flex-grow italic">
              "{quote}"
            </p>
            <div className="flex items-center mt-auto">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {name.charAt(0)}
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                  {name}
                </h4>
                <p className="text-sm text-orange-600/70 dark:text-orange-400/70">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
