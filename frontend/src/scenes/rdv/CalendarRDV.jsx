import { useState } from "react";
import FullCalendar  from '@fullcalendar/react';
import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const CalendarRDV = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const [ currentEvents, setCurrentEvents ] = useState([]);

    const handleDateClick = (selected) => {
        const title = prompt("Entrer un nouveau evenement");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect()

        if(title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.all
            });
        }
    }

    const handleEventClick = (selected) => {
        if(window.confirm(`Are you sure you want to delete the event'${selected.event.title}'`)){
            selected.event.remove();
        }
    }



    return (
        <Box m="20px">
            <Box 
                display='flex' 
                flexDirection='column' 
                gap='30px'
            >
                {/* CALENDAR */}
                <Box 
                    sx={{
                        flex: '1 1 100%',
                        ml: '15px',
                    }}
                >
                    <FullCalendar
                        // height='75vh'
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin  
                        ]}
                        headerToolbar={{
                            left: "prev, next, today",
                            center: "title",
                            right: "dayGridMonth, timeGridWeek, timeGridDay",
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        eventsSet={(events) => setCurrentEvents(events)}
                        initialEvents={[
                            {id: "2134", title: "All-day event", date: "2025-09-14"},
                            {id: "4890", title: "Timed event", date: "2025-09-16"},
                        ]}
                    />
                </Box>
                <Box 
                    flex='1 1 20%' 
                    backgroundColor= {theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc'}
                    boxShadow= {`0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `}
                    padding='15px' 
                    borderRadius='4px'
                >
                    <Typography variant="h5">Events</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    backgroundColor: colors.blackAccent[900],
                                    margin: '10px 0',
                                    borderRadius: '2px',
                                }}
                            >
                                <ListItemText 
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(event.start, {
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric',
                                            })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

            </Box>
        </Box>
    )
}

export default CalendarRDV;