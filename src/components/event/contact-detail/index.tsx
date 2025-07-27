import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@/components';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import AccordionArrow from '@/assets/icons/accordion-arrow.svg';
import type { FormDataContact } from '../types';

interface ContactDetailSectionProps {
  eventData: any;
  secondsLeft: number;
  methods: UseFormReturn<FormDataContact>;
  onBack: () => void;
  onSubmit: (data: FormDataContact) => void;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const ContactDetailSection: React.FC<ContactDetailSectionProps> = ({
  eventData,
  secondsLeft,
  methods,
  onBack,
  onSubmit,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [countryCode, setCountryCode] = useState(
    () => methods.getValues('countryCode') || '+62'
  );

  const onContactSubmit = (data: FormDataContact) => {
    data.countryCode = countryCode;
    onSubmit(data);
    setSubmitted(true);
  };

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
        {eventData.eventOrganizer.event_organizer_pic ? (
          <Image
            src={eventData.eventOrganizer.event_organizer_pic}
            alt="Owner Logo"
            width={48}
            height={48}
            className="mr-4 rounded-[14px]"
          />
        ) : (
          <Box className="mr-4 h-12 w-12 rounded-[14px] bg-white" />
        )}
        <Typography type="heading" size={30} color="text-white">
          {eventData.eventOrganizer.name}
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
          {formatTime(secondsLeft)}
        </Typography>
      </Box>

      <Typography type="heading" size={22} className="mb-2" color="text-white">
        Contact Details
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onContactSubmit)}>
          <Box className="mb-8 w-full bg-white px-4 py-4 lg:px-10 lg:py-6">
            <Box className="mb-4 flex flex-col gap-4 px-4 lg:mb-6 lg:flex-row lg:gap-8">
              {/* Kolom kiri: Full Name & Email */}
              <Box className="flex min-w-0 flex-1 flex-col gap-4">
                <Box>
                  <TextField
                    id="fullname_field"
                    name="fullName"
                    placeholder="Full name*"
                    rules={{ required: 'Full name is required' }}
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
                    rules={{ required: 'Email is required' }}
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
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers allowed',
                    },
                    minLength: {
                      value: 8,
                      message: 'Minimum 8 digits',
                    },
                  }}
                  selectedCountryCode={countryCode}
                  onCountryCodeChange={val => setCountryCode(val)}
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

            {submitted && (
              <Typography
                type="body"
                size={10}
                color="text-green"
                className="mb-1 text-center">
                Contact details saved !
              </Typography>
            )}
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
