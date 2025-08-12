'use client';

import PackageCard from '@/components/sementara';
import React from 'react';

export const packageData = [
  {
    id: 'internet-mobile',
    title: 'Internet Mobile',
    description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
    speed: 75,
    quota: 100,
    price: 249000,
    originalPrice: 349950,
    services: [],
    headerImage: '/images/mobile-header.svg',
    headerAlt: 'Mobile internet illustration',
  },
  {
    id: 'internet-tv',
    title: 'Internet & TV',
    description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
    speed: 75,
    quota: 100,
    price: 350000,
    originalPrice: 349950,
    tvChannels: 200,
    services: [
      {
        name: 'Warner Bros',
        logo: '/icons/warner.svg',
        alt: 'Warner Bros logo',
      },
      { name: 'HBO', logo: '/icons/hbo.svg', alt: 'HBO logo' },
    ],
    headerImage: '/images/tv-header.svg',
    headerAlt: 'TV and internet illustration',
  },
  {
    id: 'internet-streaming',
    title: 'Internet & Streaming',
    description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
    speed: 75,
    quota: 100,
    price: 985000,
    originalPrice: 349950,
    tvChannels: 200,
    services: [
      {
        name: 'Warner Bros',
        logo: '/icons/warner.svg',
        alt: 'Warner Bros logo',
      },
      { name: 'HBO', logo: '/icons/hbo.svg', alt: 'HBO logo' },
    ],
    headerImage: '/images/streaming-header.svg',
    headerAlt: 'Streaming services illustration',
  },
  {
    id: 'internet-tv-streaming',
    title: 'Internet, TV & Streaming',
    description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
    speed: 75,
    quota: 100,
    price: 1285000,
    originalPrice: 349950,
    services: [
      { name: 'plus', logo: '/icons/plus.svg', alt: 'plus logo' },
      { name: 'cinema world', logo: '/icons/cinema-world.svg', alt: 'cinema world logo' },
      { name: 'HBO GO', logo: '/icons/hbo-go.svg', alt: 'HBO GO logo' },
      { name: 'Lionsgate', logo: '/icons/lion-sgate.svg', alt: 'Lion Sgate logo' },
    ],
    tvChannels: 14,
    headerImage: '/images/combine-pacage.svg',
    headerAlt: 'Complete package illustration',
  },
];

const PackagesPage = () => {
  const handleViewPackage = (packageId: string) => {
    console.log(`Viewing package: ${packageId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="px-14 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket Sesuai Kebutuhan Keluarga Kamu
          </h1>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packageData.map((pkg) => (
            <PackageCard
              key={pkg.id}
              packageData={pkg}
              onViewPackage={handleViewPackage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
