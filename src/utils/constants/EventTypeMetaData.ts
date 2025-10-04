import {faBell, faBriefcase, faBullseye, faCalendar, faPlane, faUser,} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export type EventType =
    | "Work"
    | "Personal"
    | "OutOfOffice"
    | "Reminder"
    | "Focus"
    | "Other";

export type EventTypeMeta = {
    label: string;
    color: string;
    icon: IconDefinition;
};

export const EVENT_TYPE_META: Record<EventType, EventTypeMeta> = {
    Work: {label: "Work", color: "#007bff", icon: faBriefcase},
    Personal: {label: "Personal", color: "#6f42c1", icon: faUser},
    OutOfOffice: {label: "Out of Office", color: "#d90016d8", icon: faPlane},
    Reminder: {label: "Reminder", color: "#ffc107", icon: faBell},
    Focus: {label: "Focus", color: "#0d6efd", icon: faBullseye},
    Other: {label: "Other", color: "#012e0bff", icon: faCalendar},
};
