'use client';
import { Container, Typography, Box } from '@/components';
import StripeText from '@/components/layout/stripe-text';
import Accordion from '@/components/common/accordion';
import { useState } from 'react';



interface FAQItem {
  question: string;
  answer: React.ReactNode | string;
}

interface FAQSectionProps {
  data?: FAQItem[];
}

export default function FAQSection({ data = [] }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Distribute FAQs into two columns
  const midPoint = Math.ceil(data.length / 2);
  const leftFaqs = data.slice(0, midPoint);
  const rightFaqs = data.slice(midPoint);
  const text = [
    "Let's collaborate",
    "Let's create",
    'Let’s connect',
    'Let’s Play',
    'Have Fun',
    'Let’s learn',
  ];

  return (
    <section className="bg-white">
      <StripeText
        direction="horizontal"
        scrollDirection="left-to-right"
        texts={text}
        className="h-[64px]"
      />
      <Container className="px-4 py-12 md:py-24">
        <Typography
          as="h2"
          type="heading"
          size={32}
          color="text-black"
          className="font-bebas mb-8">
          FAQ
        </Typography>
        <Box className="flex flex-col gap-6 xl:flex-row">
          {/* Left column */}
          <Box className="flex flex-1 flex-col gap-6">
            {leftFaqs.map((faq, idx) => {
              const globalIdx = idx;
              return (
                <Accordion
                  key={idx}
                  id={`btn_faq_${idx + 1}`}
                  question={`${idx + 1}. ${faq.question}`}
                  answer={faq.answer}
                  open={openIdx === globalIdx}
                  onClick={() =>
                    setOpenIdx(openIdx === globalIdx ? null : globalIdx)
                  }
                />
              );
            })}
          </Box>
          {/* Right column */}
          <Box className="flex flex-1 flex-col gap-6">
            {rightFaqs.map((faq, idx) => {
              const globalIdx = idx + midPoint;
              return (
                <Accordion
                  key={globalIdx}
                  id={`btn_faq_${globalIdx + 1}`}
                  question={`${globalIdx + 1}. ${faq.question}`}
                  answer={faq.answer}
                  open={openIdx === globalIdx}
                  onClick={() =>
                    setOpenIdx(openIdx === globalIdx ? null : globalIdx)
                  }
                />
              );
            })}
          </Box>
        </Box>
      </Container>
      <StripeText
        direction="horizontal"
        scrollDirection="left-to-right"
        texts={text}
        className="flex h-[64px]"
      />
    </section>
  );
}
