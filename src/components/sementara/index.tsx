// components/PackageCard.tsx
import React from 'react';
import Image from 'next/image';

// Types
interface Service {
  name: string;
  logo: string;
  alt: string;
}

interface PackageData {
  id: string;
  title: string;
  description: string;
  speed: number;
  quota: number;
  price: number;
  originalPrice: number;
  tvChannels?: number;
  services: Service[];
  headerImage: string;
  headerAlt: string;
}

interface PackageCardProps {
  packageData: PackageData;
  onViewPackage: (packageId: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  packageData,
  onViewPackage,
}) => {
  const {
    id,
    title,
    description,
    speed,
    quota,
    price,
    originalPrice,
    tvChannels,
    services,
    headerImage,
    headerAlt,
  } = packageData;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  return (
    <div className="bg-white rounded-4xl shadow-lg overflow-hidden max-w-[317px] mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-center bg-[#ECF9FF] p-4 relative h-43 rounded-4xl overflow-hidden">
        {/* Title & Desc */}
        <div className="relative z-10">
          <h3 className="text-[16px] font-bold text-[#18448A] mb-1.5">
            {title}
          </h3>
          <p className="text-[12px] text-[#18448A] leading-[20px] max-w-[190px]">
            {description}
          </p>
        </div>

        {/* Image */}
        <div
          className={`absolute ${title.includes('Streaming') ? 'right-[-30px]' : 'right-[-20px]'} bottom-0`}
        >
          <div
            className={`relative z-2 ${title.includes('Streaming') ? 'w-42 h-42' : 'w-40 h-40'}`}
          >
            <Image src={headerImage} alt={headerAlt} fill />
          </div>
        </div>

        <Image
          src="/images/vektor.svg"
          alt="vector background"
          width={500}
          height={300}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain z-0"
        />
      </div>

      {/* Specifications */}
      <div className="p-4 w-[317px] text-[#18448A]">
        {/* Speed and Quota */}
        <div className="flex justify-between items-center pb-4 border-b border-[#E2E2E2]">
          <div className="flex items-end space-x-2">
            <Image
              src="/icons/speed.svg"
              alt="Speed Icon"
              width={20}
              height={5}
              className="h-[30px]"
            />
            <div>
              <p className="text-xs">Up to</p>
              <p className="font-bold text-xl">
                {speed} <span className="text-lg font-normal">Mbps</span>
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs">Gratis Kuota Bersama XL</p>
            <div className="flex items-center space-x-2">
              <Image
                src="/icons/family.svg"
                alt="Additional Feature Icon"
                width={16}
                height={16}
              />
              <div>
                <p className="font-bold text-xl">
                  {quota} <span className="text-lg font-normal">Gb/bln</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[94px] my-4">
          {/* TV Channels */}
          {tvChannels && (
            <div className="bg-[#F2F2F2] rounded-xl p-3">
              <p className="text-[#667085] font-bold mb-2 text-xs">
                {tvChannels} TV Channels
              </p>
              <div className="flex items-center space-x-2">
                {services.slice(0, 4).map((service, index) => (
                  <Image
                    key={index}
                    src={service.logo}
                    alt={service.alt}
                    height={32}
                    width={0}
                    className="h-8 w-auto"
                  />
                ))}
                {services.length > 1 && (
                  <div className="bg-[#E3E7EA] p-1.5 rounded-lg">
                    <span className="text-black text-sm font-bold">+14</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Streaming Apps (for non-TV packages) */}
          {!tvChannels && services.length > 0 && (
            <div className="bg-[#F2F2F2] rounded-xl p-3">
              <p className="text-gray-700 font-medium mb-2">
                {services.length} Apps{' '}
                {tvChannels ? `+ ${tvChannels} TV Channels` : ''}
              </p>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 relative bg-white rounded-md shadow-sm overflow-hidden"
                  >
                    <Image
                      src={service.logo}
                      alt={service.alt}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <p className="text-sm mb-0.5">Harga mulai dari</p>
          <p className="font-bold mb-0.5">
            <span className="text-2xl">{formatPrice(price)}</span>
            <span className="text-[28px]">/</span>
            <span className="text-lg font-normal">bln</span>
          </p>
          <p className="text-[#8C96A2] text-xs">
            Harga setelah PPN {formatPrice(originalPrice)}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewPackage(id)}
          className="w-full bg-[#18448A] hover:bg-[#2f5695] text-white font-semibold py-3 px-4 rounded-[22px] transition-colors duration-200"
        >
          Lihat Penawaran Paket
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
