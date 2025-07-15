'use client';
import { Container, Typography, Box } from '@/components';
import StripeText from '@/components/layout/stripe-text';
import Accordion from '@/components/common/accordion';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I buy a ticket??',
    answer:
      "Simply find the event you want to attend, select your ticket category and quantity, click 'Book Ticket', and proceed to checkout. You’ll receive your e-ticket via email after successful payment.",
  },
  { question: 'What payment methods do you accept?', answer: '' },
  { question: 'Where can I find my ticket after purchase?', answer: '' },
  { question: 'Do I need to print my ticket?', answer: '' },
  { question: 'Can I get a refund if I can’t attend?', answer: '' },
  {
    question: 'I didn’t receive my ticket email—what should I do?',
    answer: '',
  },
  { question: 'What if the event is canceled or rescheduled?', answer: '' },
  {
    question: 'Can I buy tickets for multiple people in one transaction?',
    answer: '',
  },
  { question: 'Is it safe to buy tickets on your platform?', answer: '' },
  { question: 'How do I contact customer support?', answer: '' },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const leftFaqs = faqs.slice(0, 5);
  const rightFaqs = faqs.slice(5, 10);
  const text = [
    "Let's collaborate",
    "Let's create",
    'Let’s connect',
    'Let’s Play',
    'Let’s fun',
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
              const globalIdx = idx + 5;
              return (
                <Accordion
                  key={idx + 5}
                  question={`${idx + 6}. ${faq.question}`}
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
