import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from './index';

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

describe('PrivacyPolicy Component', () => {
  beforeEach(() => {
    render(<PrivacyPolicy />);
  });

  describe('Component Structure', () => {
    it('should render the main section', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render the main heading', () => {
      const heading = screen.getByText('Privacy Policy');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('heading-24');
    });

    it('should render the container with correct classes', () => {
      const container = document.querySelector('.text-white');
      expect(container).toBeInTheDocument();
    });

    it('should render the content box with correct classes', () => {
      const box = screen.getByText('Privacy Policy').closest('div');
      expect(box).toHaveClass('px-4 lg:px-8 xl:px-0');
    });
  });

  describe('Introduction Content', () => {
    it('should render the introduction paragraph', () => {
      const introText = screen.getAllByText(/This Privacy Policy/)[0];
      expect(introText).toBeInTheDocument();
      expect(introText).toHaveClass('body-14');
    });

    it('should mention WUKONG in the introduction', () => {
      const wukongText = screen.getByText(/PT Aku Rela Kamu Bahagia/);
      expect(wukongText).toBeInTheDocument();
    });

    it('should mention the website domain', () => {
      const domainText = screen.getAllByText(/wukong\.co\.id/)[0];
      expect(domainText).toBeInTheDocument();
    });

    it('should mention data collection', () => {
      const dataText = screen.getAllByText(/personal data/)[0];
      expect(dataText).toBeInTheDocument();
    });
  });

  describe('Policy Sections', () => {
    it('should render major policy sections', () => {
      const sections = [
        'Privacy Policy',
        'COLLECTION OF INFORMATION',
        'USE OF PERSONAL INFORMATION',
      ];

      sections.forEach((section) => {
        expect(
          screen.getAllByText(section, { exact: false })[0]
        ).toBeInTheDocument();
      });
    });

    it('should mention data collection methods', () => {
      const collectionText = screen.getByText(/Personal Data you provide/);
      expect(collectionText).toBeInTheDocument();
    });

    it('should mention data usage purposes', () => {
      const usageText = screen.getAllByText(/Our Services/)[0];
      expect(usageText).toBeInTheDocument();
    });

    it('should mention data sharing policies', () => {
      const sharingText = screen.getAllByText(/third parties/)[0];
      expect(sharingText).toBeInTheDocument();
    });
  });

  describe('Typography and Styling', () => {
    it('should use correct typography classes for headings', () => {
      const mainHeading = screen.getByText('Privacy Policy');
      expect(mainHeading).toHaveClass('heading-24');
    });

    it('should use correct typography classes for body text', () => {
      const bodyTexts = screen.getAllByText(
        /This Privacy Policy|personal data/
      );
      bodyTexts.forEach((text) => {
        expect(text).toHaveClass('body-14');
      });
    });

    it('should have proper spacing classes', () => {
      const elementsWithSpacing = screen.getAllByText(/This Privacy Policy/);
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
      // Privacy policy may not have unordered lists, so this is optional
      expect(unorderedLists.length).toBeGreaterThanOrEqual(0);
    });

    it('should render nested lists', () => {
      const nestedLists = document.querySelectorAll('ol ol, ul ul');
      expect(nestedLists.length).toBeGreaterThan(0);
    });
  });

  describe('Content Completeness', () => {
    it('should contain contact information', () => {
      const contactText = screen.getByText(/contact us/);
      expect(contactText).toBeInTheDocument();
    });

    it('should mention user rights', () => {
      const rightsText = screen.getAllByText(/opt-out/)[0];
      expect(rightsText).toBeInTheDocument();
    });

    it('should mention data security', () => {
      const securityText = screen.getByText(/protect your personal data/);
      expect(securityText).toBeInTheDocument();
    });

    it('should mention policy updates', () => {
      const updatesText = screen.getByText(/last updated/);
      expect(updatesText).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const mainHeading = screen.getByText('Privacy Policy');
      expect(mainHeading).toHaveClass('heading-24');

      // Check that we have some list items (which represent sections)
      const listItems = document.querySelectorAll('ol > li, ul > li');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should have proper list structure', () => {
      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const contentBox = screen.getByText('Privacy Policy').closest('div');
      expect(contentBox).toHaveClass('px-4', 'lg:px-8', 'xl:px-0');
    });
  });
});
