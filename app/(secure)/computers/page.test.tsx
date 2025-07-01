import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { useAuth } from '@/app/_context/auth-context';
import useUserService from '@/app/_services/useUserService';
import useComputerService from '@/app/_services/useComputerService';
import Computers from './page';

jest.mock('@/app/_context/auth-context');
jest.mock('@/app/_services/useComputerService');
jest.mock('@/app/_services/useUserService');

const mockedComputers = [
  {
    computer_id: 1,
    name: 'Computer A',
    cpu: 'i5',
    ram: '8GB',
    ssd: '256GB',
    hdd: '1TB',
    room: 'Lab 1',
    note: 'Test computer',
  },
  {
    computer_id: 2,
    name: 'Computer B',
    cpu: 'i7',
    ram: '16GB',
    ssd: '512GB',
    hdd: '2TB',
    room: 'Lab 2',
    note: 'Second test',
  },
];
 
describe('Computers Page', () => {
    beforeEach(() => {
        //Mock token
        (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token' });

        //Mock current user
        (useUserService as jest.Mock).mockReturnValue({
            currentUser: { role: 'admin' },
        });

        //Mock computer service
        (useComputerService as jest.Mock).mockReturnValue({
            computers: mockedComputers,
            getAll: jest.fn(),
            deleteById: jest.fn(),
        });
    });

    it('render title', () => {
        render(<Computers />);
        expect(screen.getByText('Computers')).toBeInTheDocument();
    });

    it('displays computers data in table', () => {
      render(<Computers />);
      expect(screen.getByText('Computer A')).toBeInTheDocument();
      expect(screen.getByText('Computer B')).toBeInTheDocument();
      expect(screen.getAllByText('Detail')).toHaveLength(2);
      expect(screen.getAllByText('Delete')).toHaveLength(2);
    });

    it('filters computers by name', () => {
      render(<Computers />);
      const input = screen.getByPlaceholderText('🔍 Search Computers');
      fireEvent.change(input, { target: { value: 'Computer A' } });
      expect(screen.getByText('Computer A')).toBeInTheDocument();
      expect(screen.queryByText('Computer B')).not.toBeInTheDocument();
    });

    it('shows Add Computer button only for admin or superadmin', () => {
      render(<Computers />);
      expect(screen.getByText('Add Computer')).toBeInTheDocument();
    });

    it('does not show Add Computer button for user', () => {
      (useUserService as jest.Mock).mockReturnValue({
        currentUser: { role: 'user' },
      });
      render(<Computers />);
      expect(screen.queryByText('Add Computer')).not.toBeInTheDocument();
    });
});