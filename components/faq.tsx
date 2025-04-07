import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "How does Amera make money?",
      answer:
        "We take a small percentage of the interest you earn—nothing from your original balance. That means if you don't earn, we don't earn. It's a win-win arrangement that aligns our interests with yours.",
    },
    {
      question: "Is my money safe with Amera?",
      answer:
        "Amera uses institutional-grade security measures and partners with regulated financial institutions. Your Digital USD (USDC) is backed 1:1 by real USD reserves that are regularly audited and transparent.",
    },
    {
      question: "Can I withdraw my money at any time?",
      answer:
        "Yes, you have full control of your funds with no lockup periods. You can withdraw your money at any time to your bank account or convert it to other currencies.",
    },
    {
      question: "Which countries do you support?",
      answer:
        "Amera supports over 180 countries worldwide. You can check if your country is supported during the sign-up process.",
    },
    {
      question: "What is USDC?",
      answer:
        "USDC (USD Coin) is a Digital USD, also known as a stablecoin, that's pegged 1:1 to the US Dollar. Each USDC is backed by one US dollar held in reserve, making it a stable digital representation of the US dollar.",
    },
    {
      question: "How is the interest generated?",
      answer:
        "The interest is generated through institutional-grade liquidity pools, which lend your Digital USD to verified borrowers with industry leading credit scores. These borrowers pay interest on the loans, which is then shared with you.",
    },
    {
      question: "How is Amera able to provide such high interest rates?",
      answer:
        "Amera delivers up to 8% interest on your Digital USD—and even higher returns on your crypto assets—by harnessing blockchain technology to eliminate costly middlemen. We partner directly with institutional investors, cutting unnecessary fees and passing the savings directly to you. The result? Better returns, fewer costs, and more growth for your money.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about Amera and Digital USD.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-500">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

