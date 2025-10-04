import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventPage from '../EventPage';
import { EventService } from '../../features/events/services';
import { AuthService } from '../../features/auth';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../features/events/services');
jest.mock('../../features/auth');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
}));

// Mock components
jest.mock('../../components/event', () => ({
  AddEventModal: ({ open }: { open: boolean }) => 
    open ? <div data-testid="add-event-modal">Add Event Modal</div> : null,
  UpdateEventModal: ({ open }: { open: boolean }) => 
    open ? <div data-testid="update-event-modal">Update Event Modal</div> : null,
  BottomBar: ({ onToday, onAddEvent }: any) => (
    <div data-testid="bottom-bar">
      <button onClick={onToday}>Today</button>
      <button onClick={onAddEvent}>Add Event</button>
    </div>
  ),
  SingleDayView: ({ events, onEventClick }: any) => (
    <div data-testid="single-day-view">
      Single Day View - {events.length} events
      {events.map((event: any) => (
        <div key={event.id} onClick={() => onEventClick(event)}>
          {event.title}
        </div>
      ))}
    </div>
  ),
  MultiDayView: ({ events }: any) => 
    <div data-testid="multi-day-view">Multi Day View - {events.length} events</div>,
  ListView: ({ events }: any) => 
    <div data-testid="list-view">List View - {events.length} events</div>,
  ViewModeToggle: ({ mode, onChange }: any) => (
    <div data-testid="view-mode-toggle">
      <button onClick={() => onChange('single')}>Single</button>
      <button onClick={() => onChange('multi')}>Multi</button>
      <button onClick={() => onChange('list')}>List</button>
    </div>
  ),
  WeekSlider: ({ selectedDate, onSelect }: any) => 
    <div data-testid="week-slider">Week Slider</div>,
}));

jest.mock('../../components/home', () => ({
  Header: ({ showLogout, onLogout }: any) => (
    <div data-testid="header">
      Header
      {showLogout && <button onClick={onLogout}>Logout</button>}
    </div>
  ),
}));

jest.mock('../../hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe('EventPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const renderEventPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EventPage />
      </QueryClientProvider>
    );
  };

  it('should render without crashing', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    const { container } = renderEventPage();
    
    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });

  it('should render header with logout button', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();
    
    await waitFor(() => {
      const header = screen.getByTestId('header');
      expect(header).toBeDefined();
      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeDefined();
    });
  });

  it('should display loading state initially', () => {
    (EventService.getEventsOnRange as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    renderEventPage();
    
    const loadingText = screen.getByText('Loading events...');
    expect(loadingText).toBeDefined();
  });

  it('should display single day view by default', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1' },
      { id: 2, title: 'Event 2' },
    ];
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue(mockEvents);
    
    renderEventPage();
    
    await waitFor(() => {
      const singleDayView = screen.getByTestId('single-day-view');
      expect(singleDayView).toBeDefined();
      expect(singleDayView.textContent).toContain('2 events');
    });
  });

  it('should switch to multi day view', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    // Wait for initial load to complete
    await waitFor(() => {
      const singleView = screen.getByTestId('single-day-view');
      expect(singleView).toBeDefined();
    });

    const multiButton = screen.getByText('Multi');
    fireEvent.click(multiButton);

    // Wait for the view to switch
    await waitFor(() => {
      const multiDayView = screen.getByTestId('multi-day-view');
      expect(multiDayView).toBeDefined();
    });
  });

  it('should switch to list view', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      const singleView = screen.getByTestId('single-day-view');
      expect(singleView).toBeDefined();
    });

    const listButton = screen.getByText('List');
    fireEvent.click(listButton);

    const listView = screen.getByTestId('list-view');
    expect(listView).toBeDefined();
  });

  it('should open add event modal', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      const bottomBar = screen.getByTestId('bottom-bar');
      expect(bottomBar).toBeDefined();
    });

    // Modal should not be visible initially
    const modalBefore = screen.queryByTestId('add-event-modal');
    expect(modalBefore).toBeNull();

    // Click Add Event button
    const addEventButton = screen.getByText('Add Event');
    fireEvent.click(addEventButton);

    // Modal should be visible
    const modalAfter = screen.getByTestId('add-event-modal');
    expect(modalAfter).toBeDefined();
    expect(modalAfter.textContent).toBe('Add Event Modal');
  });

  it('should handle Today button click', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      const bottomBar = screen.getByTestId('bottom-bar');
      expect(bottomBar).toBeDefined();
    });

    const todayButton = screen.getByText('Today');
    fireEvent.click(todayButton);

    // Should call EventService with today's date
    await waitFor(() => {
      const calls = (EventService.getEventsOnRange as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  it('should handle successful logout', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    (AuthService.logout as jest.Mock).mockResolvedValue(undefined);
    
    renderEventPage();

    await waitFor(() => {
      const header = screen.getByTestId('header');
      expect(header).toBeDefined();
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(AuthService.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(toast.success).toHaveBeenCalledWith('Logout successful');
    });
  });

  it('should handle logout failure', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    (AuthService.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));
    
    renderEventPage();

    await waitFor(() => {
      const header = screen.getByTestId('header');
      expect(header).toBeDefined();
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(AuthService.logout).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Logout failed');
    });
    
    // Should not navigate on failure
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should display current month name', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    await waitFor(() => {
      const monthElement = screen.getByText(currentMonth);
      expect(monthElement).toBeDefined();
    });
  });

  it('should render all main components', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      // Check all main components are rendered
      expect(screen.getByTestId('header')).toBeDefined();
      expect(screen.getByTestId('week-slider')).toBeDefined();
      expect(screen.getByTestId('view-mode-toggle')).toBeDefined();
      expect(screen.getByTestId('single-day-view')).toBeDefined();
      expect(screen.getByTestId('bottom-bar')).toBeDefined();
    });
  });

  it('should fetch events on mount', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      expect(EventService.getEventsOnRange).toHaveBeenCalled();
      const todayFormatted = new Date().toLocaleDateString("en-CA");
      expect(EventService.getEventsOnRange).toHaveBeenCalledWith(
        todayFormatted,
        todayFormatted
      );
    });
  });

  it('should open update modal when event is clicked', async () => {
    const mockEvents = [
      { id: 1, title: 'Event 1' },
    ];
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue(mockEvents);
    
    renderEventPage();
    
    await waitFor(() => {
      const singleDayView = screen.getByTestId('single-day-view');
      expect(singleDayView).toBeDefined();
    });

    // Modal should not be visible initially
    const modalBefore = screen.queryByTestId('update-event-modal');
    expect(modalBefore).toBeNull();

    // Click on event
    const eventElement = screen.getByText('Event 1');
    fireEvent.click(eventElement);

    // Modal should be visible
    const modalAfter = screen.getByTestId('update-event-modal');
    expect(modalAfter).toBeDefined();
    expect(modalAfter.textContent).toBe('Update Event Modal');
  });

  it('should handle empty events list', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    await waitFor(() => {
      const singleDayView = screen.getByTestId('single-day-view');
      expect(singleDayView).toBeDefined();
      expect(singleDayView.textContent).toContain('0 events');
    });
  });

  it('should switch between all view modes', async () => {
    (EventService.getEventsOnRange as jest.Mock).mockResolvedValue([]);
    renderEventPage();

    // Wait for initial load and start with single view
    await waitFor(() => {
      expect(screen.getByTestId('single-day-view')).toBeDefined();
    });

    // Switch to multi view
    fireEvent.click(screen.getByText('Multi'));
    await waitFor(() => {
      expect(screen.getByTestId('multi-day-view')).toBeDefined();
      expect(screen.queryByTestId('single-day-view')).toBeNull();
    });

    // Switch to list view
    fireEvent.click(screen.getByText('List'));
    await waitFor(() => {
      expect(screen.getByTestId('list-view')).toBeDefined();
      expect(screen.queryByTestId('multi-day-view')).toBeNull();
    });

    // Switch back to single view
    fireEvent.click(screen.getByText('Single'));
    await waitFor(() => {
      expect(screen.getByTestId('single-day-view')).toBeDefined();
      expect(screen.queryByTestId('list-view')).toBeNull();
    });
  });
});
