import dynamic from 'next/dynamic';
import CarouselSection from '@/components/home/carousel-section';
import { SEO_CONFIG } from '@/config/seo';

const EventListSection = dynamic(
  () => import('@/components/home/event-list-section')
);
const CreatorListSection = dynamic(
  () => import('@/components/home/creator-list-section')
);
const FAQSection = dynamic(() => import('@/components/home/faq-section'));

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

export const metadata = SEO_CONFIG.pages.home;

export default function Home() {
  return (
    <main>
      <CarouselSection />
      <EventListSection />
      <CreatorListSection />
      <FAQSection data={faqs} />
    </main>
  );
}
