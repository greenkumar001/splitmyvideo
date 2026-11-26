import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How can I split a video online for free?",
    answer:
      "Upload your video to SplitMyVideo, choose your preferred clip duration, and click Split My Video. Your video will be divided into smaller clips that you can preview and download.",
  },
  {
    question: "Is SplitMyVideo free to use?",
    answer:
      "Yes. SplitMyVideo provides free online video splitting without requiring mandatory registration.",
  },
  {
    question: "Are my uploaded videos private?",
    answer:
      "Video splitting happens locally in your browser. Your original video is not uploaded to our video processing server.",
  },
  {
    question: "Can I split videos into 15-second or 30-second clips?",
    answer:
      "Yes. You can choose your preferred clip duration, including 15 seconds, 30 seconds, 60 seconds, or a custom duration.",
  },
  {
    question: "Can I upload split clips directly to YouTube?",
    answer:
      "Yes. Connect your YouTube account using Google authorization, select a generated video clip, add its title and description, and upload it directly to your YouTube channel.",
  },
  {
    question: "Does SplitMyVideo add a watermark?",
    answer:
      "No. The tool does not intentionally add a watermark to your generated video clips.",
  },
];
export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="border-t border-gray-100 bg-white px-5 py-20 sm:py-24"
    >

      <div className="mx-auto max-w-3xl">

        <div className="mb-12 text-center">

          <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
            FAQ
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            Everything you need to know about splitting videos online.
          </p>

        </div>

        <div className="space-y-3">

          {faqs.map((faq, index) => (

            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-blue-200"
            >

              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                aria-expanded={openFaq === index}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >

                <span className="text-sm font-bold text-gray-800">
                  {faq.question}
                </span>

                <ChevronDown
                  size={19}
                  className={`shrink-0 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""
                    }`}
                />

              </button>

              {openFaq === index && (
                <div className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-500">
                  {faq.answer}
                </div>
              )}

            </div>

          ))}

        </div>

      </div>

    </section>

  )
}