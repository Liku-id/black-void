// Mock next/dynamic agar selalu return function React
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResetPasswordPage from './page';

describe('ResetPasswordPage', () => {
  it('renders headings and the reset password form', async () => {
    render(<ResetPasswordPage />);
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText('Change your password')).toBeInTheDocument();
    const form = await screen.findByTestId('reset-password-form');
    expect(form).toBeInTheDocument();
  });
});
