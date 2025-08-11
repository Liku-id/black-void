'use client';
import React, { Fragment } from 'react';
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
import { fullName } from '@/utils/form-validation';
import type { FormDataVisitor, Ticket, FormDataContact } from '../types';

interface VisitorDetailSectionProps {
  isVisitorDetailChecked: boolean;
  setIsVisitorDetailChecked: React.Dispatch<React.SetStateAction<boolean>>;
  contactMethods: UseFormReturn<FormDataContact>;
  visitorMethods: UseFormReturn<FormDataVisitor>;
  tickets: Ticket[];
}

const VisitorDetailSection: React.FC<VisitorDetailSectionProps> = ({
  isVisitorDetailChecked,
  setIsVisitorDetailChecked,
  contactMethods,
  visitorMethods,
  tickets,
}) => {
  // TODO: PHASE 2
  // const IDTypesOptions = [
  //   { label: 'KTP', value: 'ktp' },
  //   { label: 'NPWP', value: 'npwp' },
  //   { label: 'SIM', value: 'sim' },
  // ];

  const attendees = tickets
    ? tickets.flatMap(ticket =>
        Array.from({ length: ticket.count }, () => ticket)
      )
    : [];

  const isContactSaved = Boolean(
    contactMethods.getValues().fullName?.trim() &&
      contactMethods.getValues().phoneNumber?.trim() &&
      contactMethods.getValues().email?.trim()
  );

  // Hapus useEffect, pindah ke onChange checkbox
  const handleVisitorDetailChecked = (checked: boolean) => {
    setIsVisitorDetailChecked(checked);

    if (checked) {
      visitorMethods.setValue(
        'visitors.0.fullName',
        contactMethods.getValues().fullName
      );
      visitorMethods.trigger('visitors.0.fullName');
      // TODO: PHASE 2
      // const fullPhoneNumber = contactMethods.getValues().phoneNumber || '';
      // const countryCodes = ['+62', '+1', '+65', '+44']; // Supported country codes
      // let countryCode = '+62'; // Default country code
      // let localNumber = fullPhoneNumber;
      //
      // for (const code of countryCodes) {
      //   if (fullPhoneNumber.startsWith(code)) {
      //     countryCode = code;
      //     localNumber = fullPhoneNumber.substring(code.length);
      //     break;
      //   }
      // }
      //
      // localNumber = localNumber || '';
      // console.log('PARSED PHONE:', { countryCode, localNumber });
      // visitorMethods.setValue('visitors.0.phoneNumber', localNumber);
      // visitorMethods.setValue('visitors.0.email', contactMethods.getValues().email);
      // visitorMethods.setValue('visitors.0.countryCode', countryCode);
    } else {
      visitorMethods.setValue('visitors.0.fullName', '');
      visitorMethods.trigger('visitors.0.fullName');
      // TODO: PHASE 2
      // visitorMethods.setValue('visitors.0.phoneNumber', '');
      // visitorMethods.setValue('visitors.0.email', '');
      // visitorMethods.setValue('visitors.0.countryCode', '+62');
    }
  };

  // TODO: PHASE 2
  // const visitors = useWatch({
  //   control: visitorMethods.control,
  //   name: 'visitors',
  // });

  if (!tickets) return null;

  return (
    <>
      <Typography type="heading" size={22} className="mb-2" color="text-white">
        Visitor Details
      </Typography>
      <FormProvider {...visitorMethods}>
        <Box
          data-visitor-section
          className="bg-white px-4 py-4 lg:mb-8 lg:px-10 lg:py-6">
          <Checkbox
            id="same_contact_detail_checkbox"
            size="sm"
            variant="white"
            checked={isVisitorDetailChecked}
            onChange={e => handleVisitorDetailChecked(e.target.checked)}
            className="mb-6 bg-white text-xs font-light"
            disabled={!isContactSaved}>
            Same as contact details
          </Checkbox>
          {/* Ticket list */}
          <Box className="px-4">
            {attendees.map((ticket, idx) => (
              <Fragment key={`${ticket.id}-${idx}`}>
                <Typography
                  type="heading"
                  size={22}
                  color="text-black"
                  className="mb-1 lg:mb-4">
                  Ticket {ticket.name} #{idx + 1}
                </Typography>
                <Box className="mb-4 flex gap-8">
                  <Box className="flex-1">
                    <TextField
                      id={`visitor_${idx + 1}_fullname_field`}
                      name={`visitors.${idx}.fullName`}
                      placeholder="Full name*"
                      rules={{
                        required: 'Full name is required',
                        validate: fullName,
                      }}
                      disabled={isVisitorDetailChecked && idx === 0}
                    />
                  </Box>
                  {/* TODO: PHASE 2 */}
                  {/* <Box className="flex-1">
                    <TextField
                      name={`visitors.${idx}.phoneNumber`}
                      placeholder="Phone Number*"
                      rules={{
                        required: 'Phone Number is required',
                        validate: (value) => phoneNumber(value, visitors?.[idx]?.countryCode ?? '+62')
                      }}
                      selectedCountryCode={
                        visitors?.[idx]?.countryCode ?? '+62'
                      }
                      onCountryCodeChange={val =>
                        visitorMethods.setValue(`visitors.${idx}.countryCode`, val)
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
                        visitorMethods.formState.errors.visitors?.[idx]?.idType
                          ?.message
                      }
                    />
                  </Box>
                </Box> */}
                {idx !== attendees.length - 1 && (
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
