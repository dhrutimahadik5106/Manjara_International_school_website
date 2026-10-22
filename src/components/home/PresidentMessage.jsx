
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Quote, Sparkles } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const PresidentMessage = () => {
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <section className="bg-gradient-to-b from-slate-50 via-mis-soft/40 to-slate-50 py-12 sm:py-16">
      <div className="section-shell">

        <div className="grid grid-cols-1 lg:grid-cols-[38%_minmax(0,1fr)] gap-6 lg:gap-8 lg:items-stretch">

          {/* LEFT: PRESIDENT PHOTO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full min-h-[340px] sm:min-h-[400px] lg:min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
          >
            <img
              src={imageAssets.principal}
              alt="Dr. S. S. Bellale - President, BMSD Society"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-mis-navy/90 via-mis-navy/40 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-block mb-2 rounded-lg bg-mis-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-mis-navy">
                Leadership
              </span>

              <h3 className="text-xl font-extrabold text-white">
                Dr. S. S. Bellale
              </h3>

              <p className="text-sm text-white/90">
                President, BMSD Society
              </p>
            </div>
          </motion.div>

          {/* RIGHT: PRESIDENT MESSAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-8 shadow-card"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mis-blue/15 bg-mis-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mis-blue-dark">
                <Sparkles size={14} className="text-mis-gold" />
                FROM THE DESK OF PRESIDENT
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">

                <div className="relative rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <Quote
                    size={22}
                    className="absolute right-4 top-4 text-mis-gold/40"
                  />

                  <p className="relative z-10">
                    At MIS, we believe education is not just about academics—it's about building strong character, sparking creativity, and preparing children for a successful life. We're proud to offer a warm and supportive environment with smart classrooms, well-equipped labs, a rich library, and excellent sports facilities. Here, learning goes beyond books. It's about growing as individuals.
                  </p>
                </div>

                <p>
                  Our MIS curriculum is designed to help students grow in every way—not just academically, but also spiritually, socially, emotionally, and physically. We also encourage extracurricular activities that build confidence, leadership, and teamwork.
                </p>

                {showFullMessage && (
                  <>
                    <p>
                      A heartfelt thank you to our dedicated teachers and staff for their passion and hard work. With your continued support, we believe MIS will keep reaching new heights in the years to come. To our dear students—stay curious, keep asking questions, and always do your best. To our wonderful parents—thank you for your constant support. Together, we make learning joyful and meaningful.
                    </p>

                    <p>
                      Wishing everyone a beautiful journey filled with learning, growth, and happiness.
                    </p>

                    <div className="space-y-1 pt-2">
                      <p className="font-bold text-mis-navy">
                        Warm regards!!
                      </p>

                      <p className="font-bold text-mis-navy">
                        Dr. S. S. Bellale
                      </p>

                      <p>
                        (President, BMSD Society
                        <br />
                        I/c Principal, Dayanand Science College, Latur)
                      </p>
                    </div>

                    <div className="pt-3 text-right">
                      <p className="font-bold italic text-mis-navy">
                        "An equation only has meaning if it expresses a thought of God."
                      </p>

                      <p className="font-bold italic text-mis-navy">
                        - Srinivasa Ramanujan
                      </p>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* FOOTER / READ MORE */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">

              <div>
                <p className="text-sm font-bold text-mis-navy">
                  Dr. S. S. Bellale
                </p>
                <p className="text-xs text-slate-500">
                  President, BMSD Society
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFullMessage(!showFullMessage)}
                aria-expanded={showFullMessage}
                className="inline-flex items-center gap-2 rounded-xl border border-mis-blue/20 bg-mis-soft px-4 py-2.5 text-xs font-bold text-mis-blue transition hover:bg-sky-100"
              >
                {showFullMessage ? (
                  <>
                    Show Less
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Read Full Message
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PresidentMessage;
