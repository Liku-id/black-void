import { render, screen, fireEvent } from '@testing-library/react';
import ProfileMenu from './';
import userEvent from '@testing-library/user-event';

const mockSetOpenModal = jest.fn();

const userData = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
};

describe('ProfileMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not show menu by default', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    expect(screen.getAllByText('My Ticket')[0]).toBeVisible();
  });

  it('renders user full name and email when menu is open', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getAllByText(userData.fullName)[0]).toBeInTheDocument();
    expect(screen.getAllByText(userData.email)[0]).toBeInTheDocument();
  });

  it('opens and closes the menu when profile toggle is clicked', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    const toggle = screen.getByText('Profile');
    fireEvent.click(toggle);
    expect(screen.getAllByText('My Ticket')[0]).toBeVisible();
    fireEvent.click(toggle);
    expect(
      screen.getAllByText('My Ticket')[0].parentElement?.parentElement
    ).toHaveClass('pointer-events-none');
  });

  it('calls setOpenModal(true) on logout click', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Log Out'));
    expect(mockSetOpenModal).toHaveBeenCalledWith(true);
  });

  it('contains a link to my-tickets', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    const link = screen.getAllByRole('link', { name: /my ticket/i })[0];
    expect(link).toHaveAttribute('href', '/tickets');
  });

  it('closes when clicking outside', async () => {
    render(
      <div>
        <button>Outside</button>
        <ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />
      </div>
    );

    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getAllByText('My Ticket')[0]).toBeVisible();

    await userEvent.click(screen.getByText('Outside'));
    expect(
      screen.getAllByText('My Ticket')[0].parentElement?.parentElement
    ).toHaveClass('pointer-events-none');
  });
});
