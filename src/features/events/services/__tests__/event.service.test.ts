import { EventService } from '../event.service';
import { ApiService } from '../../../../api';
import { EventRequest, EventResponse } from '../../dtos/event';

// Mock dependencies
jest.mock('../../../../api', () => ({
    ApiService: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('EventService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('should fetch events for a specific date', async () => {
            const mockDate = '2024-01-15';
            const mockApiResponse: EventResponse[] = [
                {
                    id: 1,
                    title: 'Meeting',
                    description: 'Team meeting',
                    startDateTime: '2024-01-15T10:00:00',
                    endDateTime: '2024-01-15T11:00:00',
                    eventType: 'Work',
                },
            ];

            (ApiService.get as jest.Mock).mockResolvedValue(mockApiResponse);

            const result = await EventService.getEvents(mockDate);

            expect(ApiService.get).toHaveBeenCalledWith('http://localhost:5220/v1/events?date=2024-01-15');
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: '1',
                title: 'Meeting',
                description: 'Team meeting',
                startDateTime: new Date('2024-01-15T10:00:00'),
                endDateTime: new Date('2024-01-15T11:00:00'),
                eventType: 'Work',
            });
        });

        it('should handle empty response', async () => {
            (ApiService.get as jest.Mock).mockResolvedValue([]);

            const result = await EventService.getEvents('2024-01-15');

            expect(result).toEqual([]);
        });

        it('should handle missing fields with defaults', async () => {
            const mockApiResponse: EventResponse[] = [
                {
                    id: 2,
                    startDateTime: '2024-01-15T10:00:00',
                    endDateTime: '2024-01-15T11:00:00',
                },
            ];

            (ApiService.get as jest.Mock).mockResolvedValue(mockApiResponse);

            const result = await EventService.getEvents('2024-01-15');

            expect(result[0]).toEqual({
                id: '2',
                title: '',
                description: '',
                startDateTime: new Date('2024-01-15T10:00:00'),
                endDateTime: new Date('2024-01-15T11:00:00'),
                eventType: 'Work',
            });
        });
    });

    describe('getEventsOnRange', () => {
        it('should fetch events for a date range', async () => {
            const startDate = '2024-01-01';
            const endDate = '2024-01-31';
            const mockApiResponse: EventResponse[] = [
                {
                    id: 1,
                    title: 'Event 1',
                    startDateTime: '2024-01-10T10:00:00',
                    endDateTime: '2024-01-10T11:00:00',
                },
                {
                    id: 2,
                    title: 'Event 2',
                    startDateTime: '2024-01-20T14:00:00',
                    endDateTime: '2024-01-20T15:00:00',
                },
            ];

            (ApiService.get as jest.Mock).mockResolvedValue(mockApiResponse);

            const result = await EventService.getEventsOnRange(startDate, endDate);

            expect(ApiService.get).toHaveBeenCalledWith('http://localhost:5220/v1/events?start=2024-01-01&end=2024-01-31');
            expect(result).toHaveLength(2);
        });
    });

    describe('addEvent', () => {
        it('should add a new event', async () => {
            const mockEventRequest: EventRequest = {
                title: 'New Event',
                description: 'Description',
                startDate: '2024-01-15',
                endDate: '2024-01-15',
                startTime: '10:00',
                endTime: '11:00',
                eventType: 'Meeting',
            };

            const mockResponse: EventResponse = {
                id: 3,
                title: 'New Event',
                description: 'Description',
                startDateTime: '2024-01-15T10:00:00',
                endDateTime: '2024-01-15T11:00:00',
                eventType: 'Meeting',
            };

            (ApiService.post as jest.Mock).mockResolvedValue(mockResponse);

            const result = await EventService.addEvent(mockEventRequest);

            expect(ApiService.post).toHaveBeenCalledWith('http://localhost:5220/v1/events', mockEventRequest);
            expect(result).toEqual(mockResponse);
        });

        it('should handle add event error', async () => {
            const mockEventRequest: EventRequest = {
                title: 'New Event',
            };

            const mockError = new Error('Failed to add event');
            (ApiService.post as jest.Mock).mockRejectedValue(mockError);

            await expect(EventService.addEvent(mockEventRequest)).rejects.toThrow('Failed to add event');
        });
    });

    describe('updateEvent', () => {
        it('should update an existing event', async () => {
            const eventId = '123';
            const mockEventRequest: EventRequest = {
                title: 'Updated Event',
                description: 'Updated description',
            };

            const mockResponse: EventResponse = {
                id: 123,
                title: 'Updated Event',
                description: 'Updated description',
            };

            (ApiService.put as jest.Mock).mockResolvedValue(mockResponse);

            const result = await EventService.updateEvent(eventId, mockEventRequest);

            expect(ApiService.put).toHaveBeenCalledWith('http://localhost:5220/v1/events/123', mockEventRequest);
            expect(result).toEqual(mockResponse);
        });

        it('should handle string to number conversion for event ID', async () => {
            const eventId = '456';
            const mockEventRequest: EventRequest = { title: 'Test' };

            (ApiService.put as jest.Mock).mockResolvedValue({});

            await EventService.updateEvent(eventId, mockEventRequest);

            expect(ApiService.put).toHaveBeenCalledWith('http://localhost:5220/v1/events/456', mockEventRequest);
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            const eventId = '789';

            (ApiService.delete as jest.Mock).mockResolvedValue(undefined);

            await EventService.deleteEvent(eventId);

            expect(ApiService.delete).toHaveBeenCalledWith('http://localhost:5220/v1/events/789');
        });

        it('should handle delete event error', async () => {
            const eventId = '999';
            const mockError = new Error('Failed to delete');

            (ApiService.delete as jest.Mock).mockRejectedValue(mockError);

            await expect(EventService.deleteEvent(eventId)).rejects.toThrow('Failed to delete');
        });

        it('should convert string ID to number for delete', async () => {
            const eventId = '100';

            (ApiService.delete as jest.Mock).mockResolvedValue(undefined);

            await EventService.deleteEvent(eventId);

            expect(ApiService.delete).toHaveBeenCalledWith('http://localhost:5220/v1/events/100');
        });
    });
});
