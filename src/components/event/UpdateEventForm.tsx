import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import {EventRequest} from "../../features/events/dtos/event";
import EventTypeToggle from "./EventTypeToggle";
import {EventType} from "../../utils/constants";
import {CalendarEvent} from "../../features/events";

interface UpdateEventFormProps {
    onSubmit: (formData: EventRequest) => void;
    onClose: () => void;
    onDelete: () => void;
    currentEvent: CalendarEvent | null;
}

const UpdateEventForm: React.FC<UpdateEventFormProps> = ({onSubmit, onClose, currentEvent, onDelete}) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        type: ''
    });

    function formatDate(dateString: any): string {
        const date = new Date(dateString);
        const pad = (n: number) => String(n).padStart(2, "0");
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    }

    useEffect(() => {
        if (currentEvent) {
            setFormData({
                id: currentEvent.id,
                title: currentEvent.title,
                description: currentEvent.description ?? "",
                startDateTime: formatDate(currentEvent.startDateTime),
                endDateTime: formatDate(currentEvent.endDateTime),
                type: currentEvent.eventType ?? "Other"
            });
        }
    }, [currentEvent])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
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
            eventType: formData.type
        };
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.startDateTime || !formData.endDateTime) {
            toast.error("Enter all the details");
            return;
        }
        const eventRequest = toEventRequest();
        onSubmit(eventRequest);
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        onDelete();
    };

    return (
        <div>
            <header className="event-modal__header">

                <button className="cancel" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <h2 className="">Update Event</h2>

                <button className="cancel" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrashCan}/>
                </button>
            </header>

            <div className="form-row">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Event Title..."
                    value={formData.title || ""}
                    aria-label="Title"
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <EventTypeToggle
                    type={formData.type as EventType || "Other"}
                    onChange={(val) => handleChange({target: {name: "type", value: val}} as any)}
                />
            </div>


            <div className="form-row">
                <label htmlFor="startDateTime">Starts</label>
                <input
                    type="datetime-local"
                    id="startDateTime"
                    name="startDateTime"
                    value={formData.startDateTime || ""}
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
                    value={formData.endDateTime || ""}
                    aria-label="Ends"
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <label>Notes</label>
                <textarea
                    name="description"
                    placeholder="Add notes…"
                    rows={3}
                    value={formData.description || ""}
                    aria-label="Description"
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <button
                    type="submit"
                    aria-label="Submit"
                    className="submit"
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default UpdateEventForm;