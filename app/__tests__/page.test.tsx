import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import useUserService from '@/app/_services/useUserService';
import useComputerService from '@/app/_services/useComputerService';
import Computers from '../(secure)/computers/page';

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
  let getAllMock: jest.Mock;

  beforeEach(() => {
    getAllMock = jest.fn();
    (useUserService as jest.Mock).mockReturnValue({
      currentUser: { role: 'admin' },
    });

    (useComputerService as jest.Mock).mockReturnValue({
      computers: mockedComputers,
      getAll: getAllMock,
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('calls getAll with default sort order DESC(newest)', () => {
    render(<Computers />);
    expect(getAllMock).toHaveBeenCalledWith("DESC");
  })

  it('changes sort mode and calls getAll with ASC when selecting "oldest"', () => {
    render(<Computers />);
    const select = screen.getByLabelText(/Sort by:/i);
    fireEvent.change(select, { target: { value: 'oldest' } });
    expect(getAllMock).toHaveBeenNthCalledWith(1, "DESC");
    expect(getAllMock).toHaveBeenNthCalledWith(2, "ASC");
  })

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