import { useState } from "react";
import toast from "react-hot-toast";
import { EventRequest, EventResponse } from "../../features/events/dtos/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EventService from "../../features/events/services/event.service";

import {
    APIErrorResponse,
} from "../../features/auth";

interface EventModalProps {
    open: boolean;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: EventService.addEvent,
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.Message || "Failed to add event");
        },
        onSuccess: (data: EventResponse) => {
            toast.success("Event added successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            setFormData({
                id: '',
                title: '',
                description: '',
                startDateTime: '',
                endDateTime: '',
            });
            onClose();
        }
    })

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toEventRequest = (): EventRequest => {
        const start = formData.startDateTime;
        const end = formData.endDateTime;
        return {
            title: formData.title,
            description: formData.description ?? "",
            startDate: start.split("T")[0],
            endDate: end.split("T")[0],
            startTime: start.split("T")[1].slice(0, 5),
            endTime: end.split("T")[1].slice(0, 5),
        };
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.startDateTime || !formData.endDateTime) {
            toast.error("Enter all the details");
            return;
        }
        console.log(formData)
        const eventRequest = toEventRequest();
        mutation.mutate(eventRequest);

    };

    return (
        <div className={`event-modal__backdrop ${open ? "open" : ""}`} onClick={onClose}>
            <div
                className="event-modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <header className="event-modal__header">
                        <button className="cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <h2>New</h2>
                        <button
                            type="submit"
                            aria-label="Submit"
                            className="add"
                        >
                            Add
                        </button>
                    </header>

                    <section className="event-modal__body">
                        <div className="form-row">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Event Title...."
                                value={formData.title}
                                aria-label="Title"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="startDateTime">Starts</label>
                            <input
                                type="datetime-local"
                                id="startDateTime"
                                name="startDateTime"
                                value={formData.startDateTime}
                                aria-label="Starts"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="endDateTime">Ends</label>
                            <input
                                type="datetime-local"
                                id="endDateTime"
                                name="endDateTime"
                                value={formData.endDateTime}
                                aria-label="Ends"
                                onChange={handleChange}
                            />
                        </div>

                        {/*
                        <div className="form-row">
                            <label>Alert</label>
                            <select>
                                <option>None</option>
                                <option>At time of event</option>
                                <option>5 min before</option>
                            </select>
                        </div>
                        */}

                        <div className="form-row">
                            <label>Notes</label>
                            <textarea placeholder="Add notes…" rows={3}></textarea>
                        </div>
                    </section>
                </form>

            </div>
        </div>
    );
};
export default EventModal;