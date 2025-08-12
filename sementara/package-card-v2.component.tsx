'use client';

import { HTMLAttributes, useMemo } from 'react';
import Image from 'next/image';

import { IPackageFeature, IPackages, IPackageUsage } from '@/libs/types/data.type';
import { getMetaContent } from '@/libs/utils/data.util';
import { getAssetsUrl } from '@/libs/utils/file.util';
import { toRupiah } from '@/libs/utils/string.util';
import { cn } from '@/libs/utils/style.util';

import Button from '../button/button.component';

import IcBooster from '@/public/imgs/icons/ic-booster.svg';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  data: IPackages;
  bg?: string;
  mini?: boolean;
  btnActionText?: string;
  onClickCTA?: (pkg?: IPackages) => void;
}

const PackageCardV2 = ({
  data,
  bg,
  btnActionText = 'Cek Jangkauan',
  onClickCTA,
  className,
  ...props
}: IProps) => {
  const packageMeta = useMemo(
    () => ({
      caption: getMetaContent<string>(data?.metas, 'caption'),
      currentPrice: getMetaContent<string>(data?.metas, 'harga'),
      prevPrice: getMetaContent<string>(data?.metas, 'harga_coret'),
      priceWithPpn: getMetaContent<string>(data?.metas, 'harga_ppn'),
      speed: getMetaContent<string>(data?.metas, 'speed'),
      speedUnit: getMetaContent<string>(data?.metas, 'satuan_speed'),
      prevSpeed: getMetaContent<string>(data?.metas, 'speed_coret'),
      usages: getMetaContent<IPackageUsage[]>(data?.metas, 'usage', true, []).filter(
        (usg: IPackageUsage) => usg.value || usg.name,
      ),
      features: getMetaContent<IPackageFeature[]>(data?.metas, 'fitur', true, []),
    }),
    [data],
  );

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {/* Header */}
      <div
        className="relative rounded-t-2xl p-4 pt-7"
        style={{
          backgroundImage: ` ${bg}`,
          backgroundBlendMode: 'overlay',
          backgroundPosition: 'center -28px',
        }}
      >
        <span className="absolute left-0 top-0 flex items-center gap-1 rounded-br-2xl rounded-tl-2xl bg-gradient-to-r from-home-primary to-primary px-4 py-1 text-2xs font-bold text-white">
          +Speed Booster
          <Image
            src={IcBooster}
            alt="XL Satu Fiber Speed Booster"
            width={12}
            height={12}
          />
        </span>
        {data.best_seller === 'yes' && (
          <span className="absolute -right-1 top-3 inline-block drop-shadow-1">
            <span className="inline-block bg-home-primary bg-gradient-to-r from-primary p-2 text-2xs font-bold leading-loose text-white [clip-path:polygon(100%_0%,_100%_50%,_100%_100%,_0_100%,_4px_50%,_0_0)]">
              Best Seller
            </span>
            {/* Below is the small fold of best seller */}
            <span className="absolute right-0 top-full border-r-4 border-t-4 border-r-transparent border-t-basic-dark-grey" />
          </span>
        )}
        <div className="flex flex-col">
          <div className="py-3 text-xl font-bold text-white">{data.name}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xs text-white">
            Internet lebih cepat dengan Speed Booster
          </div>
          <div className="flex items-end justify-end gap-1">
            <span className="pb-[2px] text-lg font-bold text-white line-through">
              {packageMeta.prevSpeed}
            </span>
            <span className="text-3xl font-bold text-white">{packageMeta.speed}</span>
            <span className="pb-1 text-xs uppercase text-white">
              {packageMeta.speedUnit}
            </span>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="flex-grow bg-white px-4">
        {packageMeta.usages?.length > 0 && (
          <div className="flex min-h-16 flex-wrap items-start gap-2 py-2">
            {packageMeta.usages?.map((usage: { name?: string; value?: string }) => (
              <span
                key={usage?.name || usage?.value}
                className="rounded-2xl bg-[#3E8BC3] px-2 text-2xs font-bold leading-[18px] text-white"
              >
                {usage?.name || usage?.value}
              </span>
            ))}
          </div>
        )}
        {packageMeta.features?.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl bg-soft-xl-home p-3">
            {packageMeta.features.map((feature: IPackageFeature) => (
              <div key={feature.label} className="flex items-center gap-2">
                {feature.icon ? (
                  <Image
                    src={getAssetsUrl(feature.icon)}
                    alt={feature.label}
                    width={24}
                    height={24}
                  />
                ) : (
                  <span />
                )}
                <div className="flex-grow text-2xs font-bold">{feature.label}</div>
                <div className="basis-24 text-right text-2xs font-bold">
                  {feature.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex flex-wrap gap-2 rounded-b-2xl border-basic-light-grey bg-white p-4">
        <div className="flex flex-grow flex-col">
          {packageMeta.prevPrice && (
            <span className="text-xs font-bold text-basic-medium-grey line-through">
              {toRupiah(packageMeta.prevPrice)}/bulan
            </span>
          )}
          <strong className="text-xl font-bold text-primary">
            {toRupiah(packageMeta.currentPrice)}/
            <span className="text-sm text-primary">bulan*</span>
          </strong>
        </div>
        <Button
          size={Button.Size.S}
          theme={Button.Theme.Primary}
          onClick={() => onClickCTA?.(data)}
          className="h-[38px] flex-grow basis-[120px]"
        >
          {btnActionText}
        </Button>
      </div>
    </div>
  );
};

export default PackageCardV2;
