import { Metadata } from 'next';
import axios from 'axios';
import { generateEventMetadata } from '@/config/seo';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    // Fetch event data untuk metadata menggunakan axios
    const { data: eventData } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/events/${slug}`
    );

    const eventName = eventData?.name;

    return generateEventMetadata(eventName);
  } catch (error) {
    return generateEventMetadata();
  }
}

export default function EventLayout({ children }: Props) {
  return <>{children}</>;
}
