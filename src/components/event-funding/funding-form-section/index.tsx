'use client';

import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Box, Container, Typography, Button, TextField, Select } from '@/components';
import { InputFile } from '@/components/common/input-file';
import { email, phoneNumber } from '@/utils/form-validation'; // Reusing validation utils if available
import { useIndustryCategories } from '@/hooks/use-industry-categories';
import { useProvinces } from '@/hooks/use-provinces';
import { generateCompanyProfileUrl, uploadCompanyProfile, registerProjectOwner } from '@/services/ekuid';

type FormData = {
  brand_name: string;
  phoneNumber: string;
  entity_name: string;
  email: string;
  industry_category_id: string;
  know_from: string;
  website: string;
  province_id: string;
  crowdfunding_amount: string;
  company_profile: FileList;
  founder_name: string;
  know_from_other?: string;
};

const knowFromOptions = [
  { label: 'Wukong', value: 'Wukong' },
];

const FundingFormSection = () => {
  const [countryCode, setCountryCode] = React.useState('+62');

  const { categories: industryCategories } = useIndustryCategories();
  const { provinces } = useProvinces(); // Could add search state if needed later

  const industryOptions = React.useMemo(() => {
    if (!industryCategories) return [];
    return industryCategories.map((item: { id: string | number; name: string }) => ({
      label: item.name,
      value: String(item.id),
    }));
  }, [industryCategories]);

  const domicileOptions = React.useMemo(() => {
    if (!provinces) return [];
    return provinces.map((item: { id: string | number; name: string }) => ({
      label: item.name,
      value: String(item.id),
    }));
  }, [provinces]);

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      brand_name: '',
      phoneNumber: '',
      entity_name: '',
      email: '',
      industry_category_id: '',
      know_from: '',
      website: '',
      province_id: '',
      crowdfunding_amount: '',
      founder_name: '',
    },
  });

  const { handleSubmit, reset, formState: { isValid } } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      let path = '';
      if (data.company_profile && data.company_profile.length > 0) {
        const file = data.company_profile[0];

        // 1. Get Upload URL
        const generate = await generateCompanyProfileUrl();
        const { url, path: generatedPath } = generate;
        path = generatedPath;

        // 2. Upload file
        await uploadCompanyProfile(url, file);
      }

      const payload = {
        ...data,
        entity_type_id: 1,
        industry_category_id: Number(data.industry_category_id),
        crowdfunding_amount: Number(
          String(data.crowdfunding_amount).replace(/\D/g, '')
        ),
        phone_number: `${countryCode}${data.phoneNumber}`,
        province_id: data.province_id,
        company_profile: path,
      };

      if ((payload as any).phoneNumber) {
        delete (payload as any).phoneNumber;
      }
      if ((payload as any).know_from_other) {
        delete (payload as any).know_from_other;
      }


      // 3. Register
      const result = await registerProjectOwner(payload);

      alert('Registration successful!');
      reset();
    } catch (error: any) {
      console.error('Registration Error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <section id="funding-form" className="pb-12 md:pb-16 px-4 md:px-0 lg:pb-[120px]">
      <Container>
        {/* Header */}
        <Box className="flex flex-col items-center text-center mb-[56px]">
          <Typography
            type="heading"
            as="h2"
            size={32}
            className="text-[32px] text-white font-normal"
          >
            Start Funding here
          </Typography>
        </Box>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[582px] mx-auto">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[30px] mb-[56px]">
              {/* Organizer Name */}
              <TextField
                name="brand_name"
                placeholder="Organizer Name*"
                rules={{ required: 'Organizer Name is required' }}
              />

              {/* Phone Number */}
              <TextField
                name="phoneNumber"
                placeholder="Phone Number*"
                rules={{
                  required: 'Phone Number is required',
                  validate: value => phoneNumber(value, countryCode)
                }}
                selectedCountryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                countryCodes={[
                  { label: '+62', value: '+62' },
                  { label: '+1', value: '+1' },
                  { label: '+65', value: '+65' },
                  { label: '+44', value: '+44' },
                ]}
              />

              {/* Company Name */}
              <TextField
                name="entity_name"
                placeholder="Company Name*"
                rules={{ required: 'Company Name is required' }}
              />

              {/* Company Email */}
              <TextField
                name="email"
                type="email"
                placeholder="Company Email*"
                rules={{
                  required: 'Company Email is required',
                  validate: email
                }}
              />

              {/* Business Industry */}
              <Select
                name="industry_category_id"
                placeholder="Business Industry*"
                options={industryOptions}
                rules={{ required: 'Business Industry is required' }}
              />

              {/* Know EKUID From */}
              <Select
                name="know_from"
                placeholder="Know EKUID From*"
                options={knowFromOptions}
                rules={{ required: 'This field is required' }}
              />

              {/* Your Website */}
              <TextField
                name="website"
                placeholder="Your Website*"
                rules={{ required: 'Website is required' }}
              />

              {/* Head Office of Domicile */}
              <Select
                name="province_id"
                placeholder="Head Office of Domicile*"
                options={domicileOptions}
                rules={{ required: 'Domicile is required' }}
              />

              {/* Funding Amount */}
              <Controller
                name="crowdfunding_amount"
                control={methods.control}
                rules={{
                  required: 'Funding Amount is required',
                  validate: (value: string) => {
                    const number = Number(value.replace(/\D/g, ''));
                    return number > 0 || 'Funding Amount must be greater than 0';
                  },
                }}
                render={({ field, fieldState }: { field: any; fieldState: any }) => (
                  <Box>
                    <TextField
                      placeholder="Funding Amount*"
                      value={field.value ?? ''}
                      onChange={(value: string) => {
                        const number = value.replace(/\D/g, '');
                        const formatted = number
                          ? 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(number))
                          : '';
                        field.onChange(formatted);
                      }}
                      className={`h-11 bg-white ${fieldState.error ? 'border-danger' : ''}`}
                    />
                    {fieldState.error && (
                      <Typography size={12} className="text-danger mt-1">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />

              {/* Upload Company Profile */}
              <InputFile
                name="company_profile"
                placeholder="Upload Company Profile*"
                rules={{ required: 'Company Profile is required' }}
                accept=".pdf"
              />

              {/* CEO Name */}
              <TextField
                name="founder_name"
                placeholder="CEO Name*"
                rules={{ required: 'CEO Name is required' }}
              />
            </Box>

            {/* Submit Button */}
            <Box className="flex justify-center">
              <Button
                id="lead_register"
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-green text-white font-bold text-base"
              // disabled={!isValid} // Optional: disable if invalid
              >
                Register Now!
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Container>
    </section>
  );
};
export default FundingFormSection;
