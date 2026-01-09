import { render, screen, fireEvent } from '@testing-library/react';
import LogOutModal from './index';

describe('LogOutModal', () => {
  const onCloseMock = jest.fn();
  const onLogoutMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <LogOutModal
        open={true}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={false}
      />
    );

    expect(
      screen.getByText(/Are you sure you want to log out/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /No, Back to Home/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Yes, Go ahead/i })
    ).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const { queryByText } = render(
      <LogOutModal
        open={false}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={false}
      />
    );

    expect(queryByText(/Are you sure you want to log out/i)).toBeNull();
  });

  it('calls onClose when "No, Back to Home" is clicked', () => {
    render(
      <LogOutModal
        open={true}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /No, Back to Home/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onLogout when "Yes, Continue" is clicked', () => {
    render(
      <LogOutModal
        open={true}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, Go ahead/i }));
    expect(onLogoutMock).toHaveBeenCalled();
  });

  it('shows "Logging out..." when loading is true', () => {
    render(
      <LogOutModal
        open={true}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={true}
      />
    );

    expect(
      screen.getByRole('button', { name: /Logging out/i })
    ).toBeInTheDocument();
  });

  it('disables buttons when loading is true', () => {
    render(
      <LogOutModal
        open={true}
        onClose={onCloseMock}
        onLogout={onLogoutMock}
        loading={true}
      />
    );

    expect(
      screen.getByRole('button', { name: /No, Back to Home/i })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /Logging out/i })).toBeDisabled();
  });
});
