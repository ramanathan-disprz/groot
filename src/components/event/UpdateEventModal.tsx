import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventRequest, EventResponse } from "../../features/events/dtos/event";
import { CalendarEvent } from "../../models";
import { Modal } from "../utils";
import UpdateEventForm from "./UpdateEventForm";
import EventService from "../../features/events/services/event.service";
import toast from "react-hot-toast";
import { APIErrorResponse } from "../../features/auth";

interface UpdateEventModalProps {
    open: boolean;
    onClose: () => void;
    currentEvent: CalendarEvent | null;
}

const UpdateEventModal: React.FC<UpdateEventModalProps> = ({ open = false, onClose, currentEvent }) => {

    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EventRequest }) =>
            EventService.updateEvent(id, payload),
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.Message || "Failed to update event");
        },
        onSuccess: (data: EventResponse) => {
            toast.success("Event updated successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onClose();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => EventService.deleteEvent(id),
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.Message || "Failed to delete event");
        },
        onSuccess: () => {
            toast.success("Event deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onClose();
        }
    });

    const handleSubmit = (formData: EventRequest) => {
        updateMutation.mutate({ id: currentEvent?.id ?? "", payload: formData });
    };

    const handleDelete = () =>{
        deleteMutation.mutate(currentEvent?.id ?? "");
    }

    return (
        <Modal open={open} onClose={onClose}>
            <>
                {currentEvent &&
                    <UpdateEventForm
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        currentEvent={currentEvent}
                        onDelete={handleDelete}
                    />}
            </>
        </Modal>
    )
};

export default UpdateEventModal;