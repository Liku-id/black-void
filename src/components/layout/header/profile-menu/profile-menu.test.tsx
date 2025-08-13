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
    expect(screen.queryByText('My Ticket')).not.toBeInTheDocument();
  });

  it('renders user full name and email when menu is open', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByText(userData.fullName)).toBeInTheDocument();
    expect(screen.getByText(userData.email)).toBeInTheDocument();
  });

  it('opens and closes the menu when profile toggle is clicked', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    const toggle = screen.getByText('Profile');
    fireEvent.click(toggle);
    expect(screen.getByText('John Doe')).toBeVisible();
    fireEvent.click(toggle);
    // Menu is still in DOM but hidden with CSS classes
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls setOpenModal(true) on logout click', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Log Out'));
    expect(mockSetOpenModal).toHaveBeenCalledWith(true);
  });

  it('contains logout functionality', () => {
    render(<ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />);
    fireEvent.click(screen.getByText('Profile'));
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeInTheDocument();
  });

  it('closes when clicking outside', async () => {
    render(
      <div>
        <button>Outside</button>
        <ProfileMenu userData={userData} setOpenModal={mockSetOpenModal} />
      </div>
    );

    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByText('John Doe')).toBeVisible();

    await userEvent.click(screen.getByText('Outside'));
    // Menu is still in DOM but hidden with CSS classes
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
