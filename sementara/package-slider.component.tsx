'use client';

import { usePathname } from 'next/navigation';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';

import Animated from '@/components/ui/animated/animated.component';
import PackageCard from '@/components/ui/package-card/package-card.component';

import {
  EVENT_ITEM_LIST_ID,
  EVENT_ITEM_LIST_NAME,
  EVENT_PACKAGE_CATEGORY,
  EVENT_PRODUCT_NAME,
  EVENT_TYPE,
} from '@/libs/constants/data-layer.constant';
import { useRouter } from '@/libs/hooks/use-router.hook';
import { useSatuFiberLeadsStore } from '@/libs/hooks/use-satu-fiber-leads.hook';
import { useSatuLiteLeadsStore } from '@/libs/hooks/use-satu-lite-leads.hook';
import { EventType } from '@/libs/types/data-layer.type';
import { IPackages } from '@/libs/types/data.type';
import { firingProduct } from '@/libs/utils/data-layer.util';
import { getMetaContent } from '@/libs/utils/data.util';
import { cn } from '@/libs/utils/style.util';

import styles from './package-slider.module.scss';

import PackageCardV3 from '@/components/ui/package-card/package-card-v3.component';
import BgPackageFamilySaturation from '@/public/imgs/common/bg-package-family-saturation.webp';
import BgPackageSmartSaturation from '@/public/imgs/common/bg-package-smart-saturation.webp';
import BgPackageValueSaturation from '@/public/imgs/common/bg-package-value-saturation.webp';

const PACKAGE_BG_SATURATIONS = [
  BgPackageValueSaturation,
  BgPackageSmartSaturation,
  BgPackageFamilySaturation,
];

const DEFAULT_PROPS = {
  // loop: true,
  initialSlide: 1,
  centeredSlides: true,
  className: '!-mb-4 !pb-4 lg:!px-6',
  breakpoints: {
    0: {
      spaceBetween: 16,
      slidesPerView: 1.2,
    },
    576: { slidesPerView: 1.5, spaceBetween: 24 },
    768: { slidesPerView: 2, spaceBetween: 24 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
  },
};

interface IProps extends SwiperProps {
  packages: IPackages[];
  sliderOnly?: boolean;
  source?: 'home' | 'lite' | 'paket';
}

const PackageSlider = ({
  packages,
  slideClass,
  sliderOnly = false,
  source,
  className,
  ...restProps
}: IProps) => {
  const { setPkg } = useSatuLiteLeadsStore((state) => state);
  const {
    setIsLeadsModalOpen: setIsFiberLeadsModalOpen,
    setOthersData,
    leadsData,
  } = useSatuFiberLeadsStore();

  const router = useRouter();
  const pathname = usePathname();
  const isChoosePackage = pathname.split('/').includes('pilih-paket');

  const firingProductItem = ({
    event,
    pkg,
    position,
  }: {
    event: Extract<EventType, 'view_item_list' | 'select_item'>;
    pkg: IPackages;
    position: number;
  }) => {
    const currentPrice = Number(getMetaContent<number>(pkg.metas, 'harga'));
    const prevPrice = Number(getMetaContent<number>(pkg.metas, 'harga_coret'));

    firingProduct({
      event,
      index: position,
      itemId: pkg.code,
      itemName: pkg.name,
      itemCategory:
        source === 'lite' ? EVENT_PACKAGE_CATEGORY.LITE : EVENT_PACKAGE_CATEGORY.FIBER,
      itemListId:
        source === 'lite'
          ? EVENT_ITEM_LIST_ID.HOMEPAGE_CARD_LITE
          : EVENT_ITEM_LIST_ID.HOMEPAGE_CARD,
      itemListName:
        source === 'lite'
          ? EVENT_ITEM_LIST_NAME.HOMEPAGE_CARD_LITE
          : EVENT_ITEM_LIST_NAME.HOMEPAGE_CARD,
      productName:
        source === 'lite'
          ? EVENT_PRODUCT_NAME.XL_SATU_LITE
          : EVENT_PRODUCT_NAME.XL_SATU_FIBER,
      price: currentPrice,
      discount: prevPrice ? prevPrice - currentPrice : 0,
    });
  };

  const handleClickCTA = (pkg: IPackages, position: number) => {
    firingProductItem({ event: EVENT_TYPE.SELECT_ITEM, pkg, position });

    const price = getMetaContent<number>(pkg.metas, 'harga');
    const pricePpn = getMetaContent<number>(pkg.metas, 'harga_ppn');
    const speed = getMetaContent<number>(pkg.metas, 'speed');
    const speedSatuan = getMetaContent<string>(pkg.metas, 'satuan_speed');

    setOthersData({
      package_img: pkg.thumb_image,
      package_slug: pkg.slug,
      package_name: pkg.name,
      package_name_formatted: `${pkg.name}-${speed}${speedSatuan.toUpperCase()}`,
      package_price: String(price),
      package_price_ppn: String(pricePpn),
      package_ppn: String(pricePpn - price),
      package_speed: String(speed),
      package_speed_unit: speedSatuan,
    });

    if (isChoosePackage) {
      router.push(
        leadsData.order_type === 'home-flex'
          ? '/home-flex/additional-information'
          : '/additional-information',
      );
      return;
    }

    switch (source) {
      case 'home':
      case 'paket':
        setIsFiberLeadsModalOpen(true);
        break;
      case 'lite':
        setPkg(pkg);
        router.push('/xl-satu-lite/checkout?ck=homepage-card-lite');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Swiper
        {...DEFAULT_PROPS}
        {...restProps}
        modules={[Navigation]}
        className={cn(
          '!overflow-visible lg:!hidden',
          sliderOnly && 'lg:!flex',
          className,
          restProps.navigation && styles.withNavigation,
        )}
      >
        {packages.map((pkg: IPackages, idx: number) => (
          <SwiperSlide className={cn(slideClass, '!h-auto')} key={idx}>
            <Animated
              animation="swipe-up"
              interval={400}
              delay={idx < 3 ? idx * 300 : 200}
              className="h-full"
            >
              <PackageCard
                data={pkg}
                saturationBg={PACKAGE_BG_SATURATIONS[idx % 3]}
                className="h-full"
                label={isChoosePackage ? 'Saya Pilih ini' : ''}
                index={idx + 1}
                onClickCTA={(pkg, position) => handleClickCTA(pkg, position)}
                onInView={(pkg, position) =>
                  firingProductItem({
                    event: EVENT_TYPE.VIEW_ITEM_LIST,
                    pkg,
                    position,
                  })
                }
              />
            </Animated>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        {...DEFAULT_PROPS}
        {...restProps}
        modules={[Navigation]}
        className={cn(
          '!overflow-visible lg:!hidden',
          sliderOnly && 'lg:!flex',
          className,
          restProps.navigation && styles.withNavigation,
        )}
      >
        {packages.map((pkg: IPackages, idx: number) => (
          <SwiperSlide className={cn(slideClass, '!h-auto')} key={idx}>
            <Animated
              animation="swipe-up"
              interval={400}
              delay={idx < 3 ? idx * 300 : 200}
              className="h-full"
            >
              <PackageCardV3
                data={pkg}
                saturationBg={PACKAGE_BG_SATURATIONS[idx % 3]}
                className="h-full"
                label={isChoosePackage ? 'Saya Pilih ini' : ''}
                index={idx + 1}
                onClickCTA={(pkg, position) => handleClickCTA(pkg, position)}
                onInView={(pkg, position) =>
                  firingProductItem({
                    event: EVENT_TYPE.VIEW_ITEM_LIST,
                    pkg,
                    position,
                  })
                }
              />
            </Animated>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {!sliderOnly && (
        <div className="mx-auto hidden max-w-[1168px] flex-wrap gap-6 lg:!flex">
          {packages.map((pkg: IPackages, idx: number) => (
            <Animated key={pkg.slug} className="basis-[calc((100%-48px)/3)]">
              <PackageCard
                data={pkg}
                saturationBg={PACKAGE_BG_SATURATIONS[idx % 3]}
                className="h-full"
                label={isChoosePackage ? 'Saya Pilih ini' : ''}
                index={idx + 1}
                onClickCTA={(pkg, position) => handleClickCTA(pkg, position)}
                onInView={(pkg, position) =>
                  firingProductItem({
                    event: EVENT_TYPE.VIEW_ITEM_LIST,
                    pkg,
                    position,
                  })
                }
              />
            </Animated>
          ))}
        </div>
      )}

      {!sliderOnly && (
        <div className="mx-auto hidden max-w-[1168px] flex-wrap gap-6 lg:!flex">
          {packages.map((pkg: IPackages, idx: number) => (
            <Animated key={pkg.slug} className="basis-[calc((100%-48px)/3)]">
              <PackageCardV3
                className="h-full"
                data={pkg}
                index={idx + 1}
                saturationBg={PACKAGE_BG_SATURATIONS[idx % 3]}

                onInView={(pkg, position) =>
                  firingProductItem({
                    event: EVENT_TYPE.VIEW_ITEM_LIST,
                    pkg,
                    position,
                  })
                }
              />


              {/* <CardGPT/> */}
            </Animated>
          ))}
        </div>
      )}
    </>
  );
};

export default PackageSlider;
