import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { Slider } from './index';
import '@testing-library/jest-dom';
import { clampIndex } from './index';

// Mock Box component
jest.mock('@/components', () => ({
  Box: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

const mockChildren = [
  <div key="1" data-testid="slide-1">
    Slide 1
  </div>,
  <div key="2" data-testid="slide-2">
    Slide 2
  </div>,
  <div key="3" data-testid="slide-3">
    Slide 3
  </div>,
];

describe('Slider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders slider with children', () => {
    render(<Slider>{mockChildren}</Slider>);

    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
    expect(screen.getByTestId('slide-3')).toBeInTheDocument();
  });

  it('renders single child correctly', () => {
    render(
      <Slider>
        <div data-testid="single-slide">Single Slide</div>
      </Slider>
    );

    expect(screen.getByTestId('single-slide')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-slider-class';
    render(<Slider className={customClass}>{mockChildren}</Slider>);

    const slider = screen.getByTestId('slide-1').closest('.flex.flex-col');
    expect(slider).toHaveClass(customClass);
  });

  it('auto-scrolls when autoScroll is true', async () => {
    render(
      <Slider autoScroll={true} scrollInterval={1000}>
        {mockChildren}
      </Slider>
    );

    // Initial state should be first slide
    const sliderContainer = screen.getByTestId('slide-1').closest('.flex');
    expect(sliderContainer).toHaveStyle({ transform: 'translateX(-0px)' });

    // Advance timer to trigger auto-scroll
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(sliderContainer).toHaveStyle({ transform: 'translateX(-106px)' }); // 100 + 6 = 106px
    });
  });



  it('does not auto-scroll when autoScroll is false', () => {
    render(<Slider autoScroll={false}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.flex');

    // Advance timer - should not change position
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(sliderContainer).toHaveStyle({ transform: 'translateX(-0px)' });
  });

  it('wraps around when auto-scrolling reaches end', async () => {
    // render(<Slider>...</Slider>);
    render(
      <Slider autoScroll={true} scrollInterval={1000}>
        {mockChildren}
      </Slider>
    );

    const sliderContainer = screen.getByTestId('slide-1').closest('.flex');

    // Advance to last slide
    act(() => {
      jest.advanceTimersByTime(1000); // slide 1
      jest.advanceTimersByTime(1000); // slide 2
    });

    await waitFor(() => {
      expect(sliderContainer).toHaveStyle({ transform: 'translateX(-212px)' }); // 2 * 106
    });

    // Advance to next (should wrap to first)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(sliderContainer).toHaveStyle({ transform: 'translateX(-0px)' });
    });
  });

  it('handles mouse drag start', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    if (sliderContainer) {
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      expect(sliderContainer).toHaveClass('cursor-grabbing');
    }
  });

  it('handles touch drag start', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    if (sliderContainer) {
      fireEvent.touchStart(sliderContainer, {
        touches: [{ pageX: 100 }],
      });

      expect(sliderContainer).toHaveClass('cursor-grabbing');
    }
  });

  it('handles touch move event', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    if (sliderContainer) {
      // Start touch
      fireEvent.touchStart(sliderContainer, {
        touches: [{ pageX: 100 }],
      });

      // Move touch - this should trigger the touch move handler
      fireEvent.touchMove(sliderContainer, {
        touches: [{ pageX: 150 }],
      });

      // Should be in dragging state
      expect(sliderContainer).toHaveClass('cursor-grabbing');
    }
  });

  it('handles touch end event', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    if (sliderContainer) {
      // Start touch
      fireEvent.touchStart(sliderContainer, {
        touches: [{ pageX: 100 }],
      });

      // End touch - this should trigger the touch end handler
      fireEvent.touchEnd(sliderContainer);

      // Should not be in dragging state anymore
      expect(sliderContainer).not.toHaveClass('cursor-grabbing');
    }
  });

  it('does not drag when draggable is false', () => {
    render(<Slider draggable={false}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContainer && sliderContent) {
      // Try to drag
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      fireEvent.mouseMove(sliderContainer, { pageX: 200 });
      fireEvent.mouseUp(sliderContainer);

      // Should not change position
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('renders pagination when pagination is true', () => {
    render(<Slider pagination={true}>{mockChildren}</Slider>);

    const paginationButtons = screen.getAllByRole('button');
    expect(paginationButtons).toHaveLength(3);

    // First button should be active
    expect(paginationButtons[0]).toHaveClass('w-[44px] bg-white');
    expect(paginationButtons[1]).toHaveClass('w-2 bg-gray');
    expect(paginationButtons[2]).toHaveClass('w-2 bg-gray');
  });

  it('does not render pagination when pagination is false', () => {
    render(<Slider pagination={false}>{mockChildren}</Slider>);

    const paginationButtons = screen.queryAllByRole('button');
    expect(paginationButtons).toHaveLength(0);
  });

  it('handles pagination click', () => {
    render(<Slider pagination={true}>{mockChildren}</Slider>);

    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    const paginationButtons = screen.getAllByRole('button');

    if (sliderContent) {
      // Click on second pagination button
      fireEvent.click(paginationButtons[1]);

      // Should move to second slide
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-106px)' });

      // Second button should be active
      expect(paginationButtons[0]).toHaveClass('w-2 bg-gray');
      expect(paginationButtons[1]).toHaveClass('w-[44px] bg-white');
      expect(paginationButtons[2]).toHaveClass('w-2 bg-gray');
    }
  });

  it('handles pagination click on last slide', () => {
    render(<Slider pagination={true}>{mockChildren}</Slider>);

    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    const paginationButtons = screen.getAllByRole('button');

    if (sliderContent) {
      // Click on last pagination button
      fireEvent.click(paginationButtons[2]);

      // Should move to last slide
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-212px)' });

      // Last button should be active
      expect(paginationButtons[0]).toHaveClass('w-2 bg-gray');
      expect(paginationButtons[1]).toHaveClass('w-2 bg-gray');
      expect(paginationButtons[2]).toHaveClass('w-[44px] bg-white');
    }
  });

  it('prevents drag when not dragging', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContent) {
      // Try to move without starting drag
      fireEvent.mouseMove(document, { pageX: 200 });

      // Should not change position
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('handles small drag that does not meet threshold', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContainer && sliderContent) {
      // Start drag
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });

      // Move drag small amount (less than threshold)
      fireEvent.mouseMove(sliderContainer, { pageX: 102 }); // Only 2px

      // End drag
      fireEvent.mouseUp(sliderContainer);

      // Should return to original position
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('limits drag to valid slide range', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContainer && sliderContent) {
      // Start drag
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });

      // Move drag to try to go before first slide
      fireEvent.mouseMove(sliderContainer, { pageX: 500 }); // Large negative drag

      // End drag
      fireEvent.mouseUp(sliderContainer);

      // Should stay at first slide (not go negative)
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('handles drag end when not dragging', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContainer && sliderContent) {
      // Try to end drag without starting it
      fireEvent.mouseUp(sliderContainer);

      // Should not change position
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('handles move when not dragging', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);

    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');

    if (sliderContainer && sliderContent) {
      // Try to move without starting drag
      fireEvent.mouseMove(sliderContainer, { pageX: 200 });

      // Should not change position
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('cleans up auto-scroll interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(
      <Slider autoScroll={true}>{mockChildren}</Slider>
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('changes slide when pagination button is clicked', () => {
    render(<Slider pagination={true}>{mockChildren}</Slider>);
    const paginationButtons = screen.getAllByRole('button');
    // Klik button kedua
    fireEvent.click(paginationButtons[1]);
    // Button kedua sekarang aktif
    expect(paginationButtons[1]).toHaveClass('w-[44px] bg-white');
    expect(paginationButtons[0]).toHaveClass('w-2 bg-gray');
  });

  it('does not change slide if drag is less than threshold', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);
    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    if (sliderContainer && sliderContent) {
      // Start drag
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      // Move sedikit (< threshold)
      fireEvent.mouseMove(sliderContainer, { pageX: 110 });
      fireEvent.mouseUp(sliderContainer);
      // Tetap di slide 0
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('does not go below index 0 when dragging left on first slide', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);
    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    if (sliderContainer && sliderContent) {
      // Start drag
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      // Geser jauh ke kanan (harus tetap di index 0)
      fireEvent.mouseMove(sliderContainer, { pageX: 300 });
      fireEvent.mouseUp(sliderContainer);
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('does not go above last index when dragging right on last slide', () => {
    render(
      <Slider draggable={true} pagination={true}>
        {mockChildren}
      </Slider>
    );
    const sliderContainer = screen.getByTestId('slide-3').closest('.relative');
    const sliderContent = screen.getByTestId('slide-3').closest('.flex');
    const paginationButtons = screen.getAllByRole('button');
    if (sliderContainer && sliderContent) {
      // Pindah ke slide terakhir via pagination
      fireEvent.click(paginationButtons[2]);
      // Drag ke kanan (harus tetap di index terakhir)
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      fireEvent.mouseMove(sliderContainer, { pageX: -300 });
      fireEvent.mouseUp(sliderContainer);
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-212px)' });
    }
  });

  it('applies custom gap and itemWidth', () => {
    render(
      <Slider gap={10} itemWidth={200}>
        {mockChildren}
      </Slider>
    );
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    // itemWidth + gap = 200 + 10 = 210
    expect(sliderContent).toHaveStyle({
      transform: 'translateX(-0px)',
      gap: '10px',
    });
  });

  it('clamps newIndex to 0 when dragOffset is very negative', () => {
    render(<Slider draggable={true}>{mockChildren}</Slider>);
    const sliderContainer = screen.getByTestId('slide-1').closest('.relative');
    const sliderContent = screen.getByTestId('slide-1').closest('.flex');
    if (sliderContainer && sliderContent) {
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      fireEvent.mouseMove(sliderContainer, { pageX: 5000 });
      fireEvent.mouseUp(sliderContainer);
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-0px)' });
    }
  });

  it('clamps newIndex to max when dragOffset is very positive', () => {
    render(
      <Slider draggable={true} pagination={true}>
        {mockChildren}
      </Slider>
    );
    const sliderContainer = screen.getByTestId('slide-3').closest('.relative');
    const sliderContent = screen.getByTestId('slide-3').closest('.flex');
    const paginationButtons = screen.getAllByRole('button');
    if (sliderContainer && sliderContent) {
      // Pindah ke slide terakhir
      fireEvent.click(paginationButtons[2]);
      // Geser jauh ke kiri (dragOffset sangat besar positif)
      fireEvent.mouseDown(sliderContainer, { pageX: 100 });
      fireEvent.mouseMove(sliderContainer, { pageX: -5000 });
      fireEvent.mouseUp(sliderContainer);
      // Harus tetap di index terakhir
      expect(sliderContent).toHaveStyle({ transform: 'translateX(-212px)' });
    }
  });
});

describe('clampIndex', () => {
  it('clamps below 0', () => {
    expect(clampIndex(0, -5000, 124, 3)).toBe(0);
  });
  it('clamps above max', () => {
    expect(clampIndex(2, 5000, 124, 3)).toBe(2);
  });
  it('returns correct index in range', () => {
    expect(clampIndex(1, 124, 124, 3)).toBe(2);
    expect(clampIndex(1, -124, 124, 3)).toBe(0);
  });
});
