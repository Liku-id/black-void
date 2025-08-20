import React from 'react';
import Image from 'next/image';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Box, Button, Typography, TextField } from '@/components';
import { formatCountdownTime } from '@/utils/formatter';
import { email, fullName, phoneNumber } from '@/utils/form-validation';
import type { FormDataContact } from '../types';
import AccordionArrow from '@/assets/icons/accordion-arrow.svg';

interface ContactDetailSectionProps {
  eventData: any;
  secondsLeft: number;
  methods: UseFormReturn<FormDataContact>;
  onBack: () => void;
  onSubmit: (data: FormDataContact) => void;
}

const ContactDetailSection: React.FC<ContactDetailSectionProps> = ({
  eventData,
  secondsLeft,
  methods,
  onBack,
  onSubmit,
}) => {
  const onContactSubmit = async (data: FormDataContact) => {
    onSubmit(data);
  };

  if (!eventData) return null;
  return (
    <>
      <Box
        id="back_button"
        className="mb-[18px] flex cursor-pointer items-center lg:mb-12"
        onClick={onBack}>
        <Image
          src={AccordionArrow}
          alt="Back"
          width={24}
          height={24}
          style={{ transform: 'rotate(90deg)' }}
          className="mr-2 invert"
        />
        <Typography type="body" size={16} color="text-white">
          Back
        </Typography>
      </Box>
      <Box className="flex items-center">
        <Box className="mr-4 flex h-12 w-12 items-center rounded-[14px] bg-white">
          {eventData.eventOrganizer?.asset?.url ? (
            <Image
              src={eventData?.eventOrganizer?.asset?.url}
              alt="Owner Logos"
              width={48}
              height={48}
              objectFit="contain"
              unoptimized
            />
          ) : (
            <Box className="mr-4 h-12 w-12 rounded-[14px] bg-white" />
          )}
        </Box>
        <Typography type="heading" size={30} color="text-white">
          {eventData.eventOrganizer?.name}
        </Typography>
      </Box>
      <hr className="my-4 border-t border-white/50 lg:my-3" />
      <Box className="mb-8 flex w-full items-center justify-between">
        <Typography type="body" size={12} color="text-white">
          Complete your booking in
        </Typography>
        <Typography
          type="body"
          size={16}
          color="text-red"
          className="font-bold">
          {formatCountdownTime(secondsLeft)}
        </Typography>
      </Box>

      <Typography type="heading" size={22} className="mb-2" color="text-white">
        Contact Details
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onContactSubmit)}>
          <Box className="mb-8 w-full bg-white px-4 py-4 xl:px-10 lg:py-6">
            <Box className="mb-4 flex flex-col gap-4 px-4 xl:mb-6 xl:flex-row xl:gap-8">
              {/* Kolom kiri: Full Name & Email */}
              <Box className="flex min-w-0 flex-1 flex-col gap-4">
                <Box>
                  <TextField
                    id="fullname_field"
                    name="fullName"
                    placeholder="Full name*"
                    rules={{
                      required: 'Full name is required',
                      validate: fullName,
                    }}
                    className="w-full"
                  />
                  <Typography
                    type="body"
                    size={10}
                    color="text-muted"
                    className="mt-1">
                    Use full name as displayed on identity card or passport.
                  </Typography>
                </Box>
                <Box>
                  <TextField
                    id="email_field"
                    name="email"
                    placeholder="Email Address*"
                    rules={{ required: 'Email is required', validate: email }}
                    className="w-full"
                  />
                  <Typography
                    type="body"
                    size={10}
                    color="text-muted"
                    className="mt-1">
                    Please enter an active email address.
                  </Typography>
                </Box>
              </Box>
              {/* Kolom kanan: Phone Number */}
              <Box className="min-w-0 flex-1">
                <TextField
                  id="phone_number_field"
                  name="phoneNumber"
                  placeholder="Phone Number*"
                  rules={{
                    required: 'Phone Number is required',
                    validate: value =>
                      phoneNumber(value, methods.watch('countryCode')),
                  }}
                  selectedCountryCode={methods.watch('countryCode') || '+62'}
                  onCountryCodeChange={val =>
                    methods.setValue('countryCode', val)
                  }
                  countryCodes={[
                    { label: '+62', value: '+62' },
                    { label: '+1', value: '+1' },
                    { label: '+65', value: '+65' },
                    { label: '+44', value: '+44' },
                  ]}
                  className="w-full"
                />
                <Typography
                  type="body"
                  size={10}
                  color="text-muted"
                  className="mt-1">
                  Make sure the phone number you entered is still active.
                </Typography>
              </Box>
            </Box>

            <Typography
              type="body"
              size={12}
              color="text-muted"
              className="mb-6">
              <span className="font-bold">Notice:</span> Make sure your data is
              correct. We will send the ticket to the e-mail that you declared.
            </Typography>

            <Button
              id="save_and_continue_button"
              type="submit"
              className="mx-auto flex"
              disabled={!methods.formState.isValid}>
              Save & Continue
            </Button>
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default ContactDetailSection;
