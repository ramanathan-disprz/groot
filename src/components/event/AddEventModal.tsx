import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {Modal} from "../common";
import EventService from "../../features/events/services/event.service";
import {APIErrorResponse} from "../../api";
import {EventRequest, EventResponse} from "../../features/events/dtos/event";
import AddEventForm from "./AddEventForm";

interface AddEventModalProps {
    open: boolean;
    onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({open = false, onClose}) => {

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: EventService.addEvent,
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.message || "Failed to add event");
        },
        onSuccess: (data: EventResponse) => {
            toast.success("Event added successfully");
            queryClient.invalidateQueries({
                queryKey: ["events"],
                exact: false
            });
            onClose();
        }
    });

    const handleSubmit = (formData: EventRequest) => {
        mutation.mutate(formData);
    };


    return (
        <Modal open={open} onClose={onClose}>
            <AddEventForm onSubmit={handleSubmit} onClose={onClose}/>
        </Modal>
    );
};

export default AddEventModal;