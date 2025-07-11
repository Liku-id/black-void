import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AuthSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-36 xl:pt-40 px-0">
      <Header/>
      {children}
      <Footer/>
    </main>
  );
}
