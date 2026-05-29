import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default function CalendarView({ activities }) {
  const groupedActivities = {};

  (activities || []).forEach(activity => { 
    console.log(activity.date);
    const date = activity.date.slice(0, 10);

    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }

    groupedActivities[date].push(activity);
  });

  const events = Object.entries(groupedActivities).map(
  ([date, activitiesForDay]) => ({
    title: "",

    start: date,
    allDay: true,

    classNames: ["calendar-dot"],

    extendedProps: {
      activities: activitiesForDay,
    }
  })
);

const firstActivityDate = activities?.length > 0
    ? activities[0].date.slice(0, 10)
    : undefined;


return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin
        ]}
        initialView="dayGridMonth"
        initialDate={firstActivityDate}
        events={events}
        height="260px"
        contentHeight="auto"
        displayEventTime={false}
        dayMaxEventRows={5}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today"
        }}

        eventDidMount={(info) => {

          const tooltipContent =
            info.event.extendedProps.activities
              .map(activity => `
                <div style="margin-bottom:8px">
                  <strong>${activity.title}</strong><br/>
                  📍 ${activity.location}<br/>
                  🕒 ${activity.time}
                </div>
              `)
              .join("");

          tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
            theme: "light-border",
            animation: "scale", 
          });
        }}
      />
    </div>
  );
}