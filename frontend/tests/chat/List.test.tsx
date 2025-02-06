
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'src/redux/store/index'; 
import List from '../../src/components/chat/List';
import { useQuery } from '@tanstack/react-query';
import * as groupService from 'src/services/groupService';
import { mockUserData, mockGroupData } from '../__mocks__/mockData';


jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('src/redux/features/chat/chatSlice', () => ({
  handleUserAndGroupList: jest.fn(),
}));

jest.mock('src/services/groupService', () => ({
  getUsers: jest.fn(),
  getGroups: jest.fn(),
}));

describe('List Component', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state when the user and group data is fetching', () => {
    (useQuery as jest.Mock).mockReturnValue({
      status: 'pending', 
    });

    render(
      <Provider store={store}>
        <List onSelect={mockOnSelect} />
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render error message when there is an error fetching users and groups', () => {
    (useQuery as jest.Mock).mockReturnValue({
      status: 'error',
    });

    render(
      <Provider store={store}>
        <List onSelect={mockOnSelect} />
      </Provider>
    );

    expect(screen.getByText(/Error fetching users and groups/i)).toBeInTheDocument();
  });

  it('should render the list of users and groups when data is fetched', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      status: 'success',
      data: mockUserData,
    });

    (groupService.getGroups as jest.Mock).mockResolvedValueOnce(mockGroupData);

    render(
      <Provider store={store}>
        <List onSelect={mockOnSelect} />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(mockUserData[0].name)).toBeInTheDocument());
    expect(screen.getByText(mockGroupData[0].name)).toBeInTheDocument();
  });

  it('should call onSelect when an item is clicked', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      status: 'success',
      data: mockUserData,
    });

    (groupService.getGroups as jest.Mock).mockResolvedValueOnce(mockGroupData);

    render(
      <Provider store={store}>
        <List onSelect={mockOnSelect} />
      </Provider>
    );

    const listItem = await screen.findByText(mockUserData[0].name);
    fireEvent.click(listItem);

    expect(mockOnSelect).toHaveBeenCalledWith(mockUserData[0]);
  });
});
