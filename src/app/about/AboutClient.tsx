"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutClient() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".fade-in-on-scroll");
    elements.forEach((el) => {
      observer.observe(el);
      // Check immediately on mount in case elements are already in view
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("visible");
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="w-full px-[15%] pt-24 pb-20 space-y-16">
        {/* Main Operator Shell */}
        <section className="fade-in-on-scroll">
          <div className="space-y-8">
 
            {/* Top: Two-column — Bio left, Topics right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              {/* Left: Headline & Bio */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <span className="font-arial text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B6861] block mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    ABOUT
                  </span>
                  <h1
                    className="font-georgia text-[#171714]"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      letterSpacing: "-.045em",
                      marginBottom: "24px",
                      fontSize: "clamp(44px, 7vw, 78px)",
                      fontWeight: 400,
                      lineHeight: ".98",
                    }}
                  >
                    Marc Gaudett
                  </h1>
                </div>
                <div className="font-georgia text-[18px] text-[#6B6861] flex flex-col gap-5 leading-[1.65]">
                  <p>
                    I’m a SaaS growth and partnerships operator with more than 15 years of experience building systems that connect products with customers, partners and new channels of distribution.
                  </p>
                  <p>
                    My work has included partnerships, affiliate and referral programs, outbound growth, API integrations, data partnerships and the operating systems required to make those channels measurable and repeatable.
                  </p>
                  <p>
                    I’m particularly interested in the points where product, distribution and incentives meet: why some integrations produce meaningful adoption, why some partner programs scale while others stall and how better data can improve the way companies identify and reach their markets.
                  </p>
                  <p>
                    Operator Notes is my public record of those observations. It is where I document useful lessons, frameworks and questions from the work itself.
                  </p>
                </div>
 
                {/* Experience section */}
                <div className="pt-8 border-t border-[#c5c1b9] space-y-4">
                  <h3 className="font-georgia font-normal text-[#171714] text-[32px] leading-tight">Experience</h3>
                  <div className="font-georgia text-[18px] text-[#6B6861] flex flex-col gap-4 leading-[1.65]">
                    <p>
                      Across my career, I have helped build and scale growth programs across B2B SaaS and technology businesses, including partnership motions that produced multi-seven-figure revenue, outbound systems that materially increased qualified lead flow and data and integration programs designed to become part of the product experience.
                    </p>
                    <p>
                      The purpose of this site is not to present a complete résumé. It is to share the thinking behind how these systems are evaluated, built and improved.
                    </p>
                  </div>
                </div>
                {/* Selected Wins section */}
                <div className="pt-8 border-t border-[#c5c1b9] space-y-4">
                  <h3 className="font-georgia font-normal text-[#171714] text-[32px] leading-tight">Selected Wins</h3>
                  <ul className="space-y-3 font-sans text-[15px] text-[#6B6861]">
                    {[
                      {
                        title: "New company data sources in SuperSearch",
                        href: "https://www.linkedin.com/posts/marcgaudett_new-company-sources-in-supersearch-activity-7493426428487651329-jq7O",
                        description: "Expanding SuperSearch's B2B data coverage for lead discovery.",
                      },
                      {
                        title: "SuperSearch's Engagement Score upgrade",
                        href: "https://www.linkedin.com/posts/marcgaudett_new-supersearch-just-got-two-upgrades-for-activity-7460660053004402690-LdIG",
                        description: "Prioritizing leads most likely to convert.",
                      },
                      {
                        title: "Global outbound webinar with HubSpot",
                        href: "https://www.linkedin.com/posts/marcgaudett_we-just-wrapped-a-global-outbound-webinar-activity-7429570466836656128-FiIM",
                        description: "On why cold outreach fails, and what actually works.",
                      },
                      {
                        title: "Where AI is taking GTM",
                        href: "https://www.linkedin.com/posts/marcgaudett_the-biggest-shift-in-ai-right-now-isnt-a-activity-7425666634561810432-JRs4",
                        description: "Tools to agents, interfaces to infrastructure — why ecosystems are the strategy.",
                      },
                    ].map((win) => (
                      <li key={win.href} className="flex items-start gap-2">
                        <span aria-hidden="true" className="w-1.5 h-1.5 mt-2 rounded-full bg-black shrink-0"></span>
                        <span>
                          <a
                            href={win.href}
                            target="_blank"
                            rel="noopener"
                            className="text-gray-600 hover:text-black transition-colors"
                          >
                            {win.title}
                          </a>
                          {" — "}{win.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
 
              {/* Right Column: Topics */}
              <div className="md:col-span-4 flex flex-col gap-8 w-full">
                {/* Topics I write about */}
                <div className="border-t border-[#c5c1b9] pt-6 space-y-4 w-full">
                  <h4 className="font-arial text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B6861] text-center md:text-left block" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Topics I write about</h4>
                  <ul className="space-y-3 font-sans text-[15px] text-[#6B6861]">
                    <li>
                      <Link href="/notes" className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-black transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                        Partnerships and distribution
                      </Link>
                    </li>
                    <li>
                      <Link href="/notes" className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-black transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                        Data products and integrations
                      </Link>
                    </li>
                    <li>
                      <Link href="/notes" className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-black transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                        Affiliates and referrals
                      </Link>
                    </li>
                    <li>
                      <Link href="/notes" className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-black transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                        Outbound and GTM systems
                      </Link>
                    </li>
                    <li>
                      <Link href="/notes" className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-black transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                        AI discovery and emerging channels
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
 
          </div>
        </section>
 
        {/* Bottom CTA Block */}
        <section className="border-t border-[#c5c1b9] pt-12 sm:pt-16 fade-in-on-scroll">
          <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
            {/* Thumbnail portrait of Marc */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-black/12 bg-[#7b8f96] shadow-sm">
              <Image
                src="/images/Marc.webp"
                alt="Marc Gaudett"
                fill
                className="object-cover object-top"
                sizes="112px"
              />
            </div>
 
            <p className="font-georgia text-[21px] text-[#6B6861] leading-[1.65]">
              You can follow my writing here or connect with me on LinkedIn.
            </p>
            <div className="flex justify-center items-center gap-4 w-full">
              <Link
                href="/notes"
                className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer text-sm font-sans"
              >
                Read Operator Notes
              </Link>
              <a
                href="https://www.linkedin.com/in/marcgaudett/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer text-sm font-sans"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
 
      <Footer />
    </>
  );
}
