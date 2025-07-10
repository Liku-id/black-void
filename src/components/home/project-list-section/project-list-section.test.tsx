import { render, screen } from '@testing-library/react';
import ProjectListSection from './';
import '@testing-library/jest-dom';
// Mock ProjectCard dan TextField agar mudah dicek
jest.mock('../project-card', () => (props: any) => <div data-testid="project-card" {...props}>{props.title}</div>);
jest.mock('@/components', () => ({
  TextField: (props: any) => <input data-testid="textfield" {...props} />,
  Box: (props: any) => <div {...props}>{props.children}</div>,
  Typography: (props: any) => <div {...props}>{props.children}</div>,
  Container: (props: any) => <div {...props}>{props.children}</div>,
}));

describe('ProjectListSection', () => {
  it('renders section title, all ProjectCard, and TextField filters', () => {
    render(<ProjectListSection />);
    // Judul section
    expect(screen.getByText(/Filter Event:/i)).toBeInTheDocument();
    // Ada 4 ProjectCard
    const cards = screen.getAllByTestId('project-card');
    expect(cards).toHaveLength(4);
    // Nama project muncul
    expect(cards[0]).toHaveTextContent('International Music Festival Jakarta 2024 - The Ultimate Experience');
    // Ada 3 TextField
    const textFields = screen.getAllByTestId('textfield');
    expect(textFields).toHaveLength(3);
    expect(textFields[0]).toHaveAttribute('placeholder', '1');
    expect(textFields[1]).toHaveAttribute('placeholder', '2');
    expect(textFields[2]).toHaveAttribute('placeholder', '3');
  });
}); 