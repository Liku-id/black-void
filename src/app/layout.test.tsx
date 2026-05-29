import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Layout from './layout';

describe('App Layout', () => {
  it('renders children', async () => {
    const component = await Layout({ children: <div data-testid="child">Hello</div> });
    render(component);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders html with lang attribute', async () => {
    const component = await Layout({ children: <div>Test</div> });
    render(component);
    const html = document.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('applies correct font classes to body', async () => {
    const component = await Layout({ children: <div>Test</div> });
    render(component);
    const body = document.body;
    expect(body.className).toContain('antialiased');
    expect(body.className).toContain('variable');
  });

  it('exports generateMetadata function', async () => {
    const { generateMetadata } = require('./layout');
    expect(generateMetadata).toBeDefined();
    const metadata = await generateMetadata();
    expect(metadata.title.default).toBe('Wukong - Reliable Ticketing Partner in Indonesia');
  });
});
