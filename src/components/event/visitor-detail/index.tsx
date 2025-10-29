'use client';
import React, { Fragment } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import {
  Box,
  Checkbox,
  Typography,
} from '@/components';
import FieldRenderer from './field-renderer';
import type { FormDataVisitor, Ticket, FormDataContact, AdditionalForm } from '../types';

interface VisitorDetailSectionProps {
  isVisitorDetailChecked: boolean;
  setIsVisitorDetailChecked: React.Dispatch<React.SetStateAction<boolean>>;
  contactMethods: UseFormReturn<FormDataContact>;
  visitorMethods: UseFormReturn<FormDataVisitor>;
  tickets: Ticket[];
  ticketType: any; // The ticketType object with additional_forms
}

const VisitorDetailSection: React.FC<VisitorDetailSectionProps> = ({
  isVisitorDetailChecked,
  setIsVisitorDetailChecked,
  contactMethods,
  visitorMethods,
  tickets,
  ticketType,
}) => {
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

  // Get additional forms from ticketType
  const getAdditionalForms = (): AdditionalForm[] => {
    return ticketType?.additional_forms?.sort((a: AdditionalForm, b: AdditionalForm) => a.order - b.order) || [];
  };

  // Hapus useEffect, pindah ke onChange checkbox
  const handleVisitorDetailChecked = (checked: boolean) => {
    setIsVisitorDetailChecked(checked);

    if (checked) {
      // Copy nama ke field pertama additional_forms (yang pasti nama)
      const additionalForms = getAdditionalForms();
      const firstField = additionalForms[0];
      visitorMethods.setValue(`visitors.0.${firstField.field}`, contactMethods.getValues().fullName);
      visitorMethods.trigger(`visitors.0.${firstField.field}`);
    } else {
      // Clear first visitor data
      const additionalForms = getAdditionalForms();
      additionalForms.forEach(form => {
        visitorMethods.setValue(`visitors.0.${form.field}`, '');
        visitorMethods.trigger(`visitors.0.${form.field}`);
      });
    }
  };

  if (!tickets) return null;

  return (
    <>
      <Typography type="heading" size={22} className="mb-2" color="text-white">
        Visitor Details
      </Typography>
      <FormProvider {...visitorMethods}>
        <Box
          data-visitor-section
          className="bg-white px-4 py-4 lg:mb-8 lg:py-6 xl:px-10">
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
            {attendees.map((ticket, idx) => {
              const additionalForms = getAdditionalForms();
              
              return (
                <Fragment key={`${ticket.id}-${idx}`}>
                  <Typography
                    type="heading"
                    size={22}
                    color="text-black"
                    className="mb-1 lg:mb-4">
                    Ticket {ticket.name} #{idx + 1}
                  </Typography>
                  
                  {/* Render additional forms */}
                  <Box className="space-y-4">
                    {additionalForms.map((form) => (
                      <FieldRenderer
                        key={form.id}
                        form={visitorMethods}
                        additionalForm={form}
                        visitorIndex={idx}
                        disabled={isVisitorDetailChecked && idx === 0 && form.order === 1}
                      />
                    ))}
                  </Box>
                  
                  {idx !== attendees.length - 1 && (
                    <hr className="border-muted my-6 border border-[0.5px]" />
                  )}
                </Fragment>
              );
            })}
          </Box>
        </Box>
      </FormProvider>
    </>
  );
};

export default VisitorDetailSection;
