'use client';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
// TODO: PHASE 2
// import { useWatch } from 'react-hook-form';
import {
  Box,
  Checkbox,
  Typography,
  TextField,
  // TODO: PHASE 2
  // Button,
  // Select,
} from '@/components';
import type { FormDataVisitor, Ticket, OrderState } from '../types';

interface VisitorDetailSectionProps {
  methods: UseFormReturn<FormDataVisitor>;
  order: OrderState | null;
  tickets: Ticket[];
}

const VisitorDetailSection: React.FC<VisitorDetailSectionProps> = ({
  methods,
  order,
  tickets,
}) => {
  const [sameAsContact, setSameAsContact] = useState(false);

  // TODO: PHASE 2
  // const IDTypesOptions = [
  //   { label: 'KTP', value: 'ktp' },
  //   { label: 'NPWP', value: 'npwp' },
  //   { label: 'SIM', value: 'sim' },
  // ];

  const isContactSaved = Boolean(
    order?.full_name?.trim() &&
      order?.phone_number?.trim() &&
      order?.email?.trim()
  );

  // Extract contact data and validation from order
  const contactData = useMemo(
    () => ({
      fullName: order?.full_name ?? '',
      // phoneNumber: order?.phone_number ?? '',
      // email: order?.email ?? '',
    }),
    [order]
  );

  // Autofill/clear first form section
  useEffect(() => {
    if (sameAsContact) {
      // TODO: PHASE 2
      // const fullPhoneNumber = contactData.phoneNumber || '';
      // const countryCodes = ['+62', '+1', '+65', '+44']; // Supported country codes
      // let countryCode = '+62'; // Default country code
      // let localNumber = fullPhoneNumber;

      // for (const code of countryCodes) {
      //   if (fullPhoneNumber.startsWith(code)) {
      //     countryCode = code;
      //     localNumber = fullPhoneNumber.substring(code.length);
      //     break;
      //   }
      // }

      // localNumber = localNumber || '';
      // console.log('PARSED PHONE:', { countryCode, localNumber });
      methods.setValue('visitors.0.fullName', contactData.fullName);
      // TODO: PHASE 2
      // methods.setValue('visitors.0.phoneNumber', localNumber);
      // methods.setValue('visitors.0.email', contactData.email);
      // methods.setValue('visitors.0.countryCode', countryCode);
    } else {
      methods.setValue('visitors.0.fullName', '');
      // TODO: PHASE 2
      // methods.setValue('visitors.0.phoneNumber', '');
      // methods.setValue('visitors.0.email', '');
      // methods.setValue('visitors.0.countryCode', '+62');
    }
  }, [sameAsContact, contactData, methods]);

  // TODO: PHASE 2
  // const visitors = useWatch({
  //   control: methods.control,
  //   name: 'visitors',
  // });

  return (
    <>
      <Typography type="heading" size={22} className="mb-2" color="text-white">
        Visitor Details
      </Typography>
      <FormProvider {...methods}>
        <Box className="bg-white px-4 py-4 lg:mb-8 lg:px-10 lg:py-6">
          <Checkbox
            size="sm"
            variant="white"
            checked={sameAsContact}
            onChange={() => setSameAsContact(v => !v)}
            className="mb-6 bg-white text-xs font-light"
            disabled={!isContactSaved}>
            Same as contact details
          </Checkbox>
          {/* Ticket list */}
          <Box className="px-4">
            {tickets.map((ticket, idx) => (
              <Fragment key={ticket.id}>
                <Typography
                  type="heading"
                  size={22}
                  color="text-black"
                  className="mb-1 lg:mb-4">
                  Tiket {ticket.name} #{idx + 1}
                </Typography>
                <Box className="mb-4 flex gap-8">
                  <Box className="flex-1">
                    <TextField
                      name={`visitors.${idx}.fullName`}
                      placeholder="Full name*"
                      rules={{ required: 'Full name is required' }}
                      disabled={sameAsContact && idx === 0}
                    />
                  </Box>
                  {/* TODO: PHASE 2 */}
                  {/* <Box className="flex-1">
                    <TextField
                      name={`visitors.${idx}.phoneNumber`}
                      placeholder="Phone Number*"
                      rules={{
                        required: 'Phone Number is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Only numbers allowed',
                        },
                        minLength: {
                          value: 8,
                          message: 'Minimum 8 digits',
                        },
                      }}
                      selectedCountryCode={
                        visitors?.[idx]?.countryCode ?? '+62'
                      }
                      onCountryCodeChange={val =>
                        methods.setValue(`visitors.${idx}.countryCode`, val)
                      }
                      countryCodes={[
                        { label: '+62', value: '+62' },
                        { label: '+1', value: '+1' },
                        { label: '+65', value: '+65' },
                        { label: '+44', value: '+44' },
                      ]}
                      disabled={sameAsContact && idx === 0}
                    />
                  </Box> */}
                </Box>
                {/* TODO: PHASE 2 */}
                {/* <Box className="mb-4 flex gap-8">
                  <Box className="flex-1">
                    <TextField
                      name={`visitors.${idx}.email`}
                      placeholder="Email Address"
                      rules={{ required: 'Email is required' }}
                      disabled={sameAsContact && idx === 0}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Select
                      name={`visitors.${idx}.idType`}
                      options={IDTypesOptions}
                      placeholder="ID Type*"
                      rules={{ required: 'ID Type is required' }}
                      error={
                        methods.formState.errors.visitors?.[idx]?.idType
                          ?.message
                      }
                    />
                  </Box>
                </Box> */}
                {idx !== tickets.length - 1 && (
                  <hr className="border-muted my-6 border border-[0.5px]" />
                )}
              </Fragment>
            ))}
          </Box>
        </Box>
      </FormProvider>
    </>
  );
};

export default VisitorDetailSection;
