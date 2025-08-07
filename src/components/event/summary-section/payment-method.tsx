import React, { useState } from 'react';
import { Box, Radio, Typography } from '@/components';
import Image from 'next/image';
import accordionArrow from '@/assets/icons/accordion-arrow.svg';

interface PaymentMethodAccordionProps {
  id: string;
  title: string;
  methods: any[];
  filterKey: string;
  selectedPayment: {
    id: string;
    name: string;
    paymentMethodFee: number;
  } | null;
  setSelectedPayment: (method: {
    id: string;
    name: string;
    paymentMethodFee: number;
  }) => void;
}

const PaymentMethodAccordion: React.FC<PaymentMethodAccordionProps> = ({
  id,
  title,
  methods,
  filterKey,
  selectedPayment,
  setSelectedPayment,
}) => {
  const [open, setOpen] = useState(false);
  const filtered = methods.filter((pm: any) =>
    pm.name?.toUpperCase().includes(filterKey)
  );

  if (!filtered.length) return null;

  return (
    <>
      <Box
        id={id}
        className="flex cursor-pointer items-center justify-between py-3 lg:py-4"
        onClick={() => setOpen(v => !v)}>
        <Typography type="heading" size={20} color="text-black">
          {title}
        </Typography>
        <Box className="bg-light-gray border-gray flex h-6 w-6 items-center justify-center border">
          <Image
            src={accordionArrow}
            alt="Toggle"
            width={24}
            height={24}
            className={`${open ? 'rotate-180' : ''} transition-transform duration-200`}
          />
        </Box>
      </Box>
      <Box
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <Box className="grid grid-cols-2 gap-4 pb-3">
          {filtered.map((method: any) => (
            <Radio
              id={`${method.paymentCode.toLowerCase()}_payment`}
              key={method.id}
              checked={selectedPayment?.id === method.id}
              onChange={() => setSelectedPayment(method)}
              name="payment-method">
              <Box className="flex items-center gap-4">
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={50}
                  height={15}
                />
                <Typography type="body" size={12} color="text-black">
                  {filterKey === 'VIRTUAL ACCOUNT'
                    ? method.name.replace(/virtual account/i, '').trim()
                    : method.name}
                </Typography>
              </Box>
            </Radio>
          ))}
        </Box>
      </Box>
      <hr className="border-muted border-t-[0.5px]" />
    </>
  );
};

export default PaymentMethodAccordion;
