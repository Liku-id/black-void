import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Layout from './layout';

describe('App Layout', () => {
  it('renders children', () => {
    render(
      <Layout>
        <div data-testid="child">Hello</div>
      </Layout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders html with lang attribute', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    const html = document.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('applies correct font classes to body', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    const body = document.body;
    expect(body.className).toContain('antialiased');
    expect(body.className).toContain('variable');
  });

  it('exports metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { metadata } = require('./layout');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Wukong');
  });
});
