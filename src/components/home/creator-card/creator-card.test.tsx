import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatorCard from './index';

// Mock components
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('CreatorCard Component', () => {
  const defaultProps = {
    logo: 'https://example.com/creator-logo.jpg',
    name: 'Test Creator',
  };

  describe('Normal State (skeleton = false)', () => {
    it('should render with all props', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        'https://example.com/creator-logo.jpg'
      );
    });

    it('should render creator image with correct attributes', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toHaveAttribute(
        'src',
        'https://example.com/creator-logo.jpg'
      );
      expect(image).toHaveAttribute('alt', 'Test Creator');
      expect(image).toHaveAttribute('draggable', 'false');
    });

    it('should have correct image styling', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toHaveClass(
        'h-32',
        'w-32',
        'rounded-full',
        'bg-white',
        'object-contain'
      );
    });

    it('should handle missing props gracefully', () => {
      render(<CreatorCard />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
    });

    it('should handle empty name', () => {
      render(<CreatorCard logo="https://example.com/logo.jpg" name="" />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Skeleton State (skeleton = true)', () => {
    it('should render skeleton when skeleton prop is true', () => {
      render(<CreatorCard skeleton={true} />);

      // Should not render any actual content
      expect(screen.queryByAltText('Test Creator')).not.toBeInTheDocument();
    });

    it('should have skeleton animation classes', () => {
      render(<CreatorCard skeleton={true} />);

      const skeletonContainer = document.querySelector('.animate-pulse');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('should render skeleton placeholders', () => {
      render(<CreatorCard skeleton={true} />);

      // Check for skeleton elements (gray backgrounds)
      const skeletonElements = document.querySelectorAll('.bg-gray-300');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should have correct skeleton dimensions', () => {
      render(<CreatorCard skeleton={true} />);

      const skeletonContainer = document.querySelector('.h-40.w-40');
      expect(skeletonContainer).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('should have correct container classes', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector(
        '.mx-2.flex.h-40.w-40.flex-shrink-0.items-center.justify-center.rounded-full.bg-white'
      );
      expect(container).toBeInTheDocument();
    });

    it('should have correct image classes', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toHaveClass(
        'h-32',
        'w-32',
        'rounded-full',
        'bg-white',
        'object-contain'
      );
    });

    it('should have proper flex layout', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.flex');
      expect(container).toBeInTheDocument();
    });

    it('should have proper sizing', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.h-40.w-40');
      expect(container).toBeInTheDocument();
    });

    it('should have proper spacing', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.mx-2');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toBeInTheDocument();
    });

    it('should have proper alt text for empty name', () => {
      render(<CreatorCard logo="https://example.com/logo.jpg" name="" />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
    });

    it('should have proper alt text for undefined name', () => {
      render(<CreatorCard logo="https://example.com/logo.jpg" />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing logo', () => {
      render(<CreatorCard name="Test Creator" />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '');
    });

    it('should handle empty logo', () => {
      render(<CreatorCard logo="" name="Test Creator" />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '');
    });

    it('should handle all missing props', () => {
      render(<CreatorCard />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '');
    });
  });

  describe('Responsive Design', () => {
    it('should have fixed dimensions for consistent layout', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.h-40.w-40');
      expect(container).toBeInTheDocument();
    });

    it('should have proper image aspect ratio', () => {
      render(<CreatorCard {...defaultProps} />);

      const image = screen.getByAltText('Test Creator');
      expect(image).toHaveClass('h-32', 'w-32');
    });

    it('should have proper flex shrink behavior', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.flex-shrink-0');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Visual Design', () => {
    it('should have circular shape', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.rounded-full');
      expect(container).toBeInTheDocument();
    });

    it('should have white background', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.bg-white');
      expect(container).toBeInTheDocument();
    });

    it('should center content', () => {
      render(<CreatorCard {...defaultProps} />);

      const container = document.querySelector('.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });
  });
});
