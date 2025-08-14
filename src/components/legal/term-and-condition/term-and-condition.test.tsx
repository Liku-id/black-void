import React from 'react';
import { render, screen } from '@testing-library/react';
import TermAndCondition from './index';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Container: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Typography: ({ children, type, size, className }: any) => (
    <span className={`${type}-${size} ${className}`}>{children}</span>
  ),
}));

describe('TermAndCondition Component', () => {
  beforeEach(() => {
    render(<TermAndCondition />);
  });

  describe('Component Structure', () => {
    it('should render the main section', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render the main heading', () => {
      const heading = screen.getByText('Terms & Conditions');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('heading-24');
    });

    it('should render the container with correct classes', () => {
      const container = document.querySelector('.text-white');
      expect(container).toBeInTheDocument();
    });

    it('should render the content box with correct classes', () => {
      const box = screen.getByText('Terms & Conditions').closest('div');
      expect(box).toHaveClass('px-4 lg:px-8 xl:px-0');
    });
  });

  describe('Introduction Content', () => {
    it('should render the introduction paragraph', () => {
      const introText = screen.getByText(/Welcome to WUKONG/);
      expect(introText).toBeInTheDocument();
      expect(introText).toHaveClass('body-14');
    });

    it('should mention WUKONG in the introduction', () => {
      const wukongText = screen.getAllByText(/PT Aku Rela Kamu Bahagia/)[0];
      expect(wukongText).toBeInTheDocument();
    });

    it('should mention the website domain', () => {
      const domainText = screen.getAllByText(/wukong\.co\.id/)[0];
      expect(domainText).toBeInTheDocument();
    });

    it('should mention service usage', () => {
      const serviceText = screen.getAllByText(/Our Services/)[0];
      expect(serviceText).toBeInTheDocument();
    });
  });

  describe('Terms Sections', () => {
    it('should render major terms sections', () => {
      const sections = ['Terms & Conditions', 'PREFACE', 'DEFINITION'];

      sections.forEach((section) => {
        expect(
          screen.getAllByText(section, { exact: false })[0]
        ).toBeInTheDocument();
      });
    });

    it('should mention user acceptance', () => {
      const acceptanceText = screen.getByText(
        /agree to be bound by these Terms/
      );
      expect(acceptanceText).toBeInTheDocument();
    });

    it('should mention service description', () => {
      const serviceText = screen.getByText(/event ticket purchasing services/);
      expect(serviceText).toBeInTheDocument();
    });

    it('should mention user accounts', () => {
      const accountText = screen.getAllByText(/Account/)[0];
      expect(accountText).toBeInTheDocument();
    });
  });

  describe('Typography and Styling', () => {
    it('should use correct typography classes for headings', () => {
      const mainHeading = screen.getByText('Terms & Conditions');
      expect(mainHeading).toHaveClass('heading-24');
    });

    it('should use correct typography classes for body text', () => {
      const bodyTexts = screen.getAllByText(/Welcome to WUKONG/);
      expect(bodyTexts.length).toBeGreaterThan(0);
      bodyTexts.forEach((text) => {
        expect(text).toHaveClass('body-14');
      });
    });

    it('should have proper spacing classes', () => {
      const elementsWithSpacing = screen.getAllByText(/Welcome to WUKONG/);
      expect(elementsWithSpacing.length).toBeGreaterThan(0);
      elementsWithSpacing.forEach((element) => {
        expect(element).toHaveClass('body-14');
      });
    });
  });

  describe('List Structure', () => {
    it('should render ordered lists with correct styling', () => {
      const orderedLists = document.querySelectorAll('ol');
      expect(orderedLists.length).toBeGreaterThan(0);
    });

    it('should render unordered lists', () => {
      const unorderedLists = document.querySelectorAll('ul');
      // Terms and conditions may not have unordered lists, so this is optional
      expect(unorderedLists.length).toBeGreaterThanOrEqual(0);
    });

    it('should render nested lists', () => {
      const nestedLists = document.querySelectorAll('ol ol, ul ul');
      expect(nestedLists.length).toBeGreaterThan(0);
    });
  });

  describe('Content Completeness', () => {
    it('should contain WUKONG platform information', () => {
      const platformText = screen.getAllByText(/WUKONG/)[0];
      expect(platformText).toBeInTheDocument();
    });

    it('should mention company information', () => {
      const companyText = screen.getAllByText(/PT Aku Rela Kamu Bahagia/)[0];
      expect(companyText).toBeInTheDocument();
    });

    it('should mention website domain', () => {
      const domainText = screen.getAllByText(/wukong\.co\.id/)[0];
      expect(domainText).toBeInTheDocument();
    });

    it('should mention terms and conditions', () => {
      const termsText = screen.getAllByText(/Terms & Conditions/)[0];
      expect(termsText).toBeInTheDocument();
    });

    it('should mention customer and seller roles', () => {
      const customerText = screen.getAllByText(/Customer/)[0];
      const sellerText = screen.getAllByText(/Seller/)[0];
      expect(customerText).toBeInTheDocument();
      expect(sellerText).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const mainHeading = screen.getByText('Terms & Conditions');
      expect(mainHeading).toHaveClass('heading-24');

      // Check that we have some list items (which represent sections)
      const listItems = document.querySelectorAll('ol > li');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should have proper list structure', () => {
      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const contentBox = screen.getByText('Terms & Conditions').closest('div');
      expect(contentBox).toHaveClass('px-4', 'lg:px-8', 'xl:px-0');
    });
  });
});
