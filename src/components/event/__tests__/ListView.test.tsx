import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListView from '../ListView';
import { CalendarEvent } from '../../../features/events/dtos';

describe('ListView', () => {
    const mockEvents: CalendarEvent[] = [
        {
            id: '1',
            title: 'Team Meeting',
            description: 'Weekly sync',
            eventType: 'Work',
            startDateTime: new Date('2024-01-15T10:00:00'),
            endDateTime: new Date('2024-01-15T11:00:00'),
        },
        {
            id: '2',
            title: 'Project Review',
            description: 'Q1 review',
            eventType: 'Meeting',
            startDateTime: new Date('2024-01-15T14:00:00'),
            endDateTime: new Date('2024-01-15T15:00:00'),
        },
        {
            id: '3',
            title: 'Lunch Break',
            description: 'Team lunch',
            eventType: 'Personal',
            startDateTime: new Date('2024-01-15T12:00:00'),
            endDateTime: new Date('2024-01-15T13:00:00'),
        },
    ];

    it('should render the list view with title', () => {
        render(<ListView events={[]} />);
        
        expect(screen.getByText('Recent & Upcoming Events')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
    });

    it('should display all events', () => {
        render(<ListView events={mockEvents} />);
        
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.getByText('Project Review')).toBeInTheDocument();
        expect(screen.getByText('Lunch Break')).toBeInTheDocument();
    });

    it('should show "No events found" when no events', () => {
        render(<ListView events={[]} />);
        
        expect(screen.getByText('No events found.')).toBeInTheDocument();
    });

    it('should filter events based on search input', () => {
        render(<ListView events={mockEvents} />);
        
        const searchInput = screen.getByPlaceholderText('Search events...');
        
        // Search for "Team"
        fireEvent.change(searchInput, { target: { value: 'Team' } });
        
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.queryByText('Project Review')).not.toBeInTheDocument();
        expect(screen.queryByText('Lunch Break')).not.toBeInTheDocument();
    });

    it('should show clear button when search has value', () => {
        render(<ListView events={mockEvents} />);
        
        const searchInput = screen.getByPlaceholderText('Search events...');
        
        // Initially no clear button
        expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument();
        
        // Type something
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        // Clear button should appear
        expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', () => {
        render(<ListView events={mockEvents} />);
        
        const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
        
        // Type something
        fireEvent.change(searchInput, { target: { value: 'Team' } });
        expect(searchInput.value).toBe('Team');
        
        // Click clear button
        fireEvent.click(screen.getByText('×'));
        
        // Search should be cleared and all events shown
        expect(searchInput.value).toBe('');
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.getByText('Project Review')).toBeInTheDocument();
        expect(screen.getByText('Lunch Break')).toBeInTheDocument();
    });

    it('should perform case-insensitive search', () => {
        render(<ListView events={mockEvents} />);
        
        const searchInput = screen.getByPlaceholderText('Search events...');
        
        // Search with different case
        fireEvent.change(searchInput, { target: { value: 'TEAM' } });
        
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.queryByText('Project Review')).not.toBeInTheDocument();
    });

    it('should display time status badges', () => {
        // Mock current time to be between first event
        const mockDate = new Date('2024-01-15T10:30:00');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
        
        render(<ListView events={mockEvents} />);
        
        // Check for status badges (at least one should exist)
        const statusElements = screen.getAllByText(/Completed|Ongoing|Upcoming/);
        expect(statusElements.length).toBeGreaterThan(0);
        
        // Restore Date
        jest.restoreAllMocks();
    });

    it('should format event times correctly', () => {
        render(<ListView events={mockEvents} />);
        
        // Check if times are displayed in HH:MM format
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('14:00')).toBeInTheDocument();
        expect(screen.getByText('12:00')).toBeInTheDocument();
    });

    it('should handle events with missing or invalid data gracefully', () => {
        const eventsWithMissingData: CalendarEvent[] = [
            {
                id: '1',
                title: '',  // Empty title
                description: '',
                eventType: undefined as any,  // Missing type
                startDateTime: new Date('2024-01-15T10:00:00'),
                endDateTime: new Date('2024-01-15T11:00:00'),
            },
        ];
        
        render(<ListView events={eventsWithMissingData} />);
        
        // Should render without crashing
        expect(screen.getByText('Created by You')).toBeInTheDocument();
    });

    it('should log event data when event card is clicked', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        render(<ListView events={mockEvents} />);
        
        // Click on first event card
        const eventCard = screen.getByText('Team Meeting').closest('.event-card');
        fireEvent.click(eventCard!);
        
        // Check if console.log was called with event data
        expect(consoleSpy).toHaveBeenCalledWith(mockEvents[0]);
        
        consoleSpy.mockRestore();
    });

    it('should show "No events found" when search has no results', () => {
        render(<ListView events={mockEvents} />);
        
        const searchInput = screen.getByPlaceholderText('Search events...');
        
        // Search for something that doesn't exist
        fireEvent.change(searchInput, { target: { value: 'xyz123' } });
        
        expect(screen.getByText('No events found.')).toBeInTheDocument();
    });
});
