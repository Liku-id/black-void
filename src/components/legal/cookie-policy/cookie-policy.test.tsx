import React from 'react';
import { render, screen } from '@testing-library/react';
import CookiePolicy from './index';

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

describe('CookiePolicy Component', () => {
  beforeEach(() => {
    render(<CookiePolicy />);
  });

  describe('Component Structure', () => {
    it('should render the main section', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render the main heading', () => {
      const heading = screen.getByText('Cookie Policy');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('heading-24');
    });

    it('should render the container with correct classes', () => {
      const container = document.querySelector('.text-white');
      expect(container).toBeInTheDocument();
    });

    it('should render the content box with correct classes', () => {
      const box = document.querySelector('.px-4.lg\\:px-8.xl\\:px-0');
      expect(box).toBeInTheDocument();
    });
  });

  describe('Introduction Content', () => {
    it('should render the introduction paragraph', () => {
      const introText = screen.getAllByText(/This Cookie Policy/)[0];
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

    it('should mention Privacy Policy', () => {
      const privacyText = screen.getAllByText(/Privacy Policy/)[0];
      expect(privacyText).toBeInTheDocument();
    });
  });

  describe('Cookie Definition Section', () => {
    it('should render the "WHAT ARE COOKIES" section', () => {
      const cookiesHeading = screen.getByText('WHAT ARE COOKIES');
      expect(cookiesHeading).toBeInTheDocument();
      expect(cookiesHeading).toHaveClass('heading-20');
    });

    it('should explain what cookies are', () => {
      const cookieDefinition = screen.getByText(/Cookies are small text files/);
      expect(cookieDefinition).toBeInTheDocument();
    });

    it('should mention browser default behavior', () => {
      const browserText = screen.getByText(
        /Most browsers accept Cookies by default/
      );
      expect(browserText).toBeInTheDocument();
    });
  });

  describe('Cookie Usage Section', () => {
    it('should render the "HOW WE USE COOKIE" section', () => {
      const usageHeading = screen.getByText('HOW WE USE COOKIE');
      expect(usageHeading).toBeInTheDocument();
      expect(usageHeading).toHaveClass('heading-20');
    });

    it('should explain the purpose of cookies', () => {
      const purposeText = screen.getByText(
        /WUKONG uses Cookies to enhance the performance/
      );
      expect(purposeText).toBeInTheDocument();
    });

    it('should list specific use cases', () => {
      // Check that we have list items in the cookie usage section
      const listItems = document.querySelectorAll(
        'ol[style*="lower-alpha"] li'
      );
      expect(listItems.length).toBeGreaterThan(0);

      // Check for some key phrases that should be present
      expect(
        screen.getByText(/To ensure our Site operates properly/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/To help protect the security of your account/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /To deliver services through the administration of our Site/
        )
      ).toBeInTheDocument();
    });
  });

  describe('Cookie Types Section', () => {
    it('should render the "TYPES OF COOKIES WE USE" section', () => {
      const typesHeading = screen.getByText('TYPES OF COOKIES WE USE');
      expect(typesHeading).toBeInTheDocument();
      expect(typesHeading).toHaveClass('heading-20');
    });
  });

  describe('Typography and Styling', () => {
    it('should use correct typography classes for headings', () => {
      const headings = screen.getAllByText(
        /WHAT ARE COOKIES|HOW WE USE COOKIE|TYPES OF COOKIES WE USE/
      );
      headings.forEach((heading) => {
        expect(heading).toHaveClass('heading-20');
      });
    });

    it('should use correct typography classes for body text', () => {
      const bodyTexts = screen.getAllByText(
        /This Cookie Policy|Cookies are small text files/
      );
      bodyTexts.forEach((text) => {
        expect(text).toHaveClass('body-14');
      });
    });

    it('should have proper spacing classes', () => {
      const elementsWithSpacing = screen.getAllByText(/This Cookie Policy/);
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

      // Check for upper-alpha styling
      const upperAlphaList = document.querySelector('ol[style*="upper-alpha"]');
      expect(upperAlphaList).toBeInTheDocument();
    });

    it('should render nested ordered lists', () => {
      const nestedLists = document.querySelectorAll('ol ol');
      expect(nestedLists.length).toBeGreaterThan(0);

      // Check for lower-alpha styling
      const lowerAlphaList = document.querySelector('ol[style*="lower-alpha"]');
      expect(lowerAlphaList).toBeInTheDocument();
    });
  });

  describe('Content Completeness', () => {
    it('should contain all major sections', () => {
      const sections = [
        'Cookie Policy',
        'WHAT ARE COOKIES',
        'HOW WE USE COOKIE',
        'TYPES OF COOKIES WE USE',
      ];

      sections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('should mention consent and browser settings', () => {
      const consentText = screen.getByText(
        /you consent to the use of such Cookies/
      );
      expect(consentText).toBeInTheDocument();

      const browserSettingsText = screen.getByText(
        /block or disable Cookies through your browser settings/
      );
      expect(browserSettingsText).toBeInTheDocument();
    });

    it('should mention data processing', () => {
      const processingText = screen.getByText(
        /processing of personal data collected through these Cookies/
      );
      expect(processingText).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const mainHeading = screen.getByText('Cookie Policy');
      const subHeadings = screen.getAllByText(
        /WHAT ARE COOKIES|HOW WE USE COOKIE|TYPES OF COOKIES WE USE/
      );

      expect(mainHeading).toHaveClass('heading-24');
      subHeadings.forEach((heading) => {
        expect(heading).toHaveClass('heading-20');
      });
    });

    it('should have proper list structure', () => {
      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const contentBox = screen.getByText('Cookie Policy').closest('div');
      expect(contentBox).toHaveClass('px-4', 'lg:px-8', 'xl:px-0');
    });
  });
});
