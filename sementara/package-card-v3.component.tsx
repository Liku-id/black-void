'use client'


import { cn } from '@/utils/utils';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { HTMLAttributes, useMemo } from 'react';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  data: any;
  saturationBg?: StaticImport | string;
  mini?: boolean;
  label?: string;
  index: number;
  onClickCTA?: (data: any, position: number) => void;
  onInView?: (data: any, position: number) => void;
}

// Dynamic content configuration based on package type
const getPackageConfig = (packageName: string) => {
  const name = packageName.toLowerCase();
  
  if (name.includes('mobile')) {
    return {
      type: 'mobile',
      title: 'Internet Mobile',
      description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
      headerImage: '/imgs/static-img-prodCard-v3/mobile-header.png',
      tvChannels: null,
      speedIcon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-1.png',
      speedTitle: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-1.png',
      additionalFeature: {
        icon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-2.png',
        title: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-mobile.png',
        value: '/imgs/static-img-prodCard-v3/title/SpeedVal-mobile.png'
      }
    };
  }
  
  if (name.includes('tv') && !name.includes('streaming')) {
    return {
      type: 'tv',
      title: 'Internet & TV',
      description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
      headerImage: '/imgs/static-img-prodCard-v3/tv-header.png',
      tvChannels: {
        count: '200 TV Channels',
        channels: [
          { name: 'Warner Bros', logo: '/imgs/static-img-prodCard-v3/channels/wb.png' },
          { name: 'HBO', logo: '/imgs/static-img-prodCard-v3/channels/hbo.png' },
          { name: '+14', text: '+14' }
        ]
      },
      speedIcon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-1.png',
      speedTitle: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-1.png',
      additionalFeature: {
        icon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-2.png',
        title: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-2.png',
        value: '/imgs/static-img-prodCard-v3/title/SpeedVal-2.png'
      }
    };
  }
  
  if (name.includes('streaming') && !name.includes('tv')) {
    return {
      type: 'streaming',
      title: 'Internet & Streaming',
      description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
      headerImage: '/imgs/static-img-prodCard-v3/streaming-header.png',
      tvChannels: {
        count: '200 TV Channels',
        channels: [
          { name: 'Warner Bros', logo: '/imgs/static-img-prodCard-v3/channels/wb.png' },
          { name: 'HBO', logo: '/imgs/static-img-prodCard-v3/channels/hbo.png' },
          { name: '+14', text: '+14' }
        ]
      },
      speedIcon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-1.png',
      speedTitle: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-1.png',
      additionalFeature: {
        icon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-2.png',
        title: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-2.png',
        value: '/imgs/static-img-prodCard-v3/title/SpeedVal-2.png'
      }
    };
  }
  
  if (name.includes('tv') && name.includes('streaming')) {
    return {
      type: 'combo',
      title: 'Internet, TV & Streaming',
      description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
      headerImage: '/imgs/static-img-prodCard-v3/combo-header.png',
      tvChannels: {
        count: '4 Apps + 14 TV Channels',
        channels: [
          { name: 'VidIO', logo: '/imgs/static-img-prodCard-v3/channels/vidio.png' },
          { name: 'Cinema World', logo: '/imgs/static-img-prodCard-v3/channels/cinema.png' },
          { name: 'HBO GO', logo: '/imgs/static-img-prodCard-v3/channels/hbo-go.png' },
          { name: 'Disney+', logo: '/imgs/static-img-prodCard-v3/channels/disney.png' },
          { name: '+14', text: '+14' }
        ]
      },
      speedIcon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-1.png',
      speedTitle: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-1.png',
      additionalFeature: {
        icon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-2.png',
        title: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-2.png',
        value: '/imgs/static-img-prodCard-v3/title/SpeedVal-2.png'
      }
    };
  }
  
  // Default configuration
  return {
    type: 'default',
    title: 'Internet Mobile',
    description: 'Speed upgrade hingga 200mbps, Kuota HP hingga 100GB',
    headerImage: '/imgs/static-img-prodCard-v3/ProductDescription.png',
    tvChannels: null,
    speedIcon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-1.png',
    speedTitle: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-1.png',
    additionalFeature: {
      icon: '/imgs/static-img-prodCard-v3/title/IconSpeedVal-2.png',
      title: '/imgs/static-img-prodCard-v3/title/SpeedValTitle-2.png',
      value: '/imgs/static-img-prodCard-v3/title/SpeedVal-2.png'
    }
  };
};

const PackageCardV3 = ({
    className,
    mini,
    data,
    label,
    index,
    onClickCTA = () => {}
} : IProps) =>  {
    
    
    const packageConfig = useMemo(() => getPackageConfig(data.name), [data.name]);

    const packageMeta = {}

    // const packageMeta = useMemo(
    //     () => ({
    //       caption: getMetaContent<string>(data?.metas, 'caption'),
    //       currentPrice: getMetaContent<string>(data?.metas, 'harga'),
    //       prevPrice: getMetaContent<string>(data?.metas, 'harga_coret'),
    //       priceWithPpn: getMetaContent<string>(data?.metas, 'harga_ppn'),
    //       speed: getMetaContent<string>(data?.metas, 'speed'),
    //       speedUnit: getMetaContent<string>(data?.metas, 'satuan_speed'),
    //       prevSpeed: getMetaContent<string>(data?.metas, 'speed_coret'),
    //       prevSpeedUnit: getMetaContent<string>(data?.metas, 'satuan_speed_coret'),
    //       devicePrice: getMetaContent<string>(data?.metas, 'biaya_perangkat'),
    //       barMeterImg: getMetaContent<string>(data?.metas, 'barmeter'),
    //       usages: getMetaContent<IPackageUsage[]>(data?.metas, 'usage', true, []),
    //       usageCaption: getMetaContent<string>(data?.metas, 'fungsi_value'),
    //       features: getMetaContent<IPackageFeature[]>(data?.metas, 'fitur', true, []),
    //     }),
    //     [data],
    // );

    return (
        <div
            className={cn(
                'flex flex-col max-w-[317px] justify-between gap-3 overflow-hidden rounded-[32px] bg-white p-4 drop-shadow-1 xl:p-6 mt-5',
                className,
            )}
        >   
            {/* DYNAMIC HEADER SECTION */}
            <div>
                <div className='relative bg-[#ECF9FF] h-44 max-h-[172px] -m-4 !mb-0 overflow-hidden xl:-m-6 rounded-[32px] rounded-br-[28px]'>
                    {/* Package Title & Description */}
                    <div className="absolute top-4 left-4 z-50">
                        <h3 className="text-sm font-semibold text-[#4A90A4] mb-1">
                            {packageConfig.title}
                        </h3>
                        <p className="text-xs text-gray-600 max-w-[180px]">
                            {packageConfig.description}
                        </p>
                    </div>
                    
                    {/* Dynamic Header Image */}
                    <Image
                        src={packageConfig.headerImage}
                        width={100}
                        height={100}
                        alt={packageConfig.title}
                        className="w-[182px] h-[88px] absolute bottom-11 left-5 object-contain z-50"
                    />
                    
                    {/* TV Channel Container - Only show for TV/Streaming packages */}
                    {packageConfig.tvChannels && (
                        <div className="absolute bottom-0 right-0 z-50">
                            <Image
                                src="/imgs/static-img-prodCard-v3/TVChannelContainer.png"
                                alt="TV Channels"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                    )}

                    {/* Background Vector */}
                    <Image
                        src="/imgs/static-img-prodCard-v3/Vector16.png"
                        alt="vector background"
                        width={500}
                        height={300}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain z-0"
                    />
                </div>
            </div>

            {/* MAIN CONTENT - Speed & Additional Features */}
            <div className='border-b border-basic-light-grey pb-4'>
                
                {/* Speed & Features Section */}
                <div className='flex justify-between items-start gap-2'>
                    
                    {/* Speed Icon */}
                    <div className='flex items-center'>
                        <Image
                            src={packageConfig.speedIcon}
                            alt="Speed Icon"
                            width={20}
                            height={21} 
                        />
                    </div>

                    {/* Speed Information */}
                    <div className='flex flex-col gap-1 flex-1'>
                        <div className="text-xs text-gray-500">Up to</div>
                        
                        <div className='flex items-end gap-1'>
                            <span className="text-lg font-bold text-[#4A90A4]">
                                {packageMeta.speed || '75'}
                            </span>
                            <span className="text-sm text-[#4A90A4]">
                                {packageMeta.speedUnit || 'Mbps'}
                            </span>
                        </div>
                    </div>

                    {/* Additional Feature */}
                    <div className='flex flex-col gap-1 items-end'>
                        <div className="text-xs text-gray-500">
                            Gratis Kuota Bersama XL
                        </div>
                        
                        <div className='flex items-center gap-1'>
                            <Image
                                src={packageConfig.additionalFeature.icon}
                                alt="Additional Feature Icon"
                                width={16}
                                height={16}
                            />
                            <span className="text-lg font-bold text-[#4A90A4]">
                                100
                            </span>
                            <span className="text-sm text-[#4A90A4]">
                                Gb/bln
                            </span>
                        </div>
                    </div>

                </div>
                
                {/* TV CHANNELS SECTION - Only show for packages with TV/Streaming */}
                {packageConfig.tvChannels && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-2">
                            {packageConfig.tvChannels.count}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {packageConfig.tvChannels.channels.map((channel, idx) => (
                                <div key={idx} className="flex items-center">
                                    {channel.logo ? (
                                        <Image
                                            src={channel.logo}
                                            alt={channel.name}
                                            width={24}
                                            height={24}
                                            className="rounded"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                                            <span className="text-xs font-semibold">
                                                {channel.text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* PRICING & CTA SECTION */}
            {!mini && (
                <div className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col">
                        <div className="text-xs text-basic-medium-grey">
                            Harga mulai dari{' '}
                            {packageMeta.prevPrice && (
                                <span className="font-bold text-basic-dark-grey line-through">
                                    {toRupiah(packageMeta.prevPrice)}/bulan
                                </span>
                            )}
                        </div>
                        <strong className="text-2xl font-bold text-primary">
                            {toRupiah(packageMeta.currentPrice)}/
                            <span className="text-sm text-primary">bln</span>
                        </strong>
                        <div className="text-xs text-basic-medium-grey">
                            Harga setelah PPN {toRupiah(packageMeta.priceWithPpn)}
                        </div>
                    </div>
                    <Button
                        theme={Button.Theme.Primary}
                        onClick={() => {
                            onClickCTA(data, index);
                        }}
                    >
                        {label || 'Lihat Penawaran Paket'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PackageCardV3;