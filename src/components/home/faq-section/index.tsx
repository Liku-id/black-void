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
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept QRIS and Virtual Accounts.',
  },
  {
    question: 'Where can I find my ticket after purchase?',
    answer:
      'You’ll receive your ticket via email. You can also access it by logging into your account and visiting the “My Tickets” section.',
  },
  {
    question: 'Do I need to print my ticket?',
    answer:
      'Not necessarily! Most events accept e-tickets. Just show the QR code on your phone at the entrance. If the organizer requires printed tickets, you’ll be notified.',
  },
  {
    question: 'Can I get a refund if I can’t attend?',
    answer:
      'Refund policies vary by event. Please check the event’s refund policy before purchasing. If refunds are allowed, you can request one from your ticket dashboard or contact support.',
  },
  {
    question: 'I didn’t receive my ticket email—what should I do?',
    answer:
      'First, check your spam or promotions folder. If it’s not there, log in to your account and go to “My Tickets”. Still can’t find it? Contact our support team.',
  },
  {
    question: 'What if the event is canceled or rescheduled?',
    answer:
      'If an event is canceled or rescheduled, we’ll notify you via email with further instructions. Refunds or ticket validity for the new date will be subject to the event organizer’s policy.',
  },
  {
    question: 'Can I buy tickets for multiple people in one transaction?',
    answer:
      'Yes! Just select the quantity you need during checkout. You’ll receive all tickets under one booking, which you can forward or share.',
  },
  {
    question: 'Is it safe to buy tickets on your platform?',
    answer:
      'Yes, your personal and payment information is protected with industry-standard encryption. We also work directly with verified event organizers.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'You can reach us via email at support@wukong.co.id or through live chat on our website during business hours.',
  },
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
