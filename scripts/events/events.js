import { setItem } from '../common/storage.js';
import { getEventsList, serverUrl } from '../common/gateways.js';
import { openPopup } from '../common/popup.js';

const weekElem = document.querySelector('.calendar__week');

const handleEventClick = (event) => {
  event.preventDefault();
  const target = event.target.closest('.event');
  if (!target) {
    return;
  }
  openPopup(event.clientX, event.clientY);
  setItem('eventIdToDelete', target.dataset.eventId);
};

const removeEventsFromCalendar = () => {
  const eventsElems = document.querySelectorAll('.event');
  eventsElems.forEach((eventElem) => eventElem.remove());
};

const createEventElement = (event) => {
  const { start, end, title, id, description, color } = event;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const formatTime = (date) => (date + '').padStart(2, '0');
  const startHours = formatTime(startDate.getHours());
  const startMinutes = formatTime(startDate.getMinutes());
  const endHours = formatTime(endDate.getHours());
  const endMinutes = formatTime(endDate.getMinutes());

  const eventTimeContent = `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;

  const eventElem = document.createElement('div');
  eventElem.dataset.eventId = id;
  eventElem.style.top = startDate.getMinutes() + 'px';
  eventElem.style.height = ((endDate - startDate) / 60000).toFixed() + 'px';
  eventElem.classList.add('event');
  eventElem.style.backgroundColor = color;

  const eventTitleElem = document.createElement('div');
  eventTitleElem.textContent = title;
  eventTitleElem.classList.add('event__title');

  const eventTimeElem = document.createElement('div');
  eventTimeElem.textContent = eventTimeContent;
  eventTimeElem.classList.add('event__time');

  const eventDescriptionElem = document.createElement('div');
  eventDescriptionElem.textContent = description;
  eventDescriptionElem.classList.add('event__description');

  eventElem.append(eventTitleElem, eventTimeElem, eventDescriptionElem);
  return eventElem;
};

export const renderEvents = async () => {
  removeEventsFromCalendar();
  const events = await getEventsList(serverUrl);
  const eventsByDateAndTime = events.reduce((events, event) => {
    const { start } = event;
    const startDate = new Date(start);
    const day = startDate.getDate();
    const month = startDate.getMonth() + 1;
    const time = startDate.getHours();
    const key = `${day}-${month}-${time}`;
    events[key] = events[key] || [];
    events[key].push(event);
    return events;
  }, {});

  const timeSlotsElems = document.querySelectorAll('.calendar__time-slot');
  timeSlotsElems.forEach((timeSlotElem) => {
    const day = timeSlotElem.closest('.calendar__day').dataset.day;
    const time = timeSlotElem.dataset.time;
    const month = timeSlotElem.closest('.calendar__day').dataset.month;
    const key = `${day}-${month}-${time}`;
    const eventsForTimeSlot = eventsByDateAndTime[key] || [];
    eventsForTimeSlot.forEach((event) => {
      timeSlotElem.append(createEventElement(event));
    });
  });
};

weekElem.addEventListener('click', handleEventClick);
















































// import { getItem, setItem } from '../common/storage.js';
// import {
//   getEventsList,
//   updateEvent,
//   serverUrl,
//   deleteEvent
// } from '../common/gateways.js';
// import { openPopup, closePopup } from '../common/popup.js';
// import { openModal, closeModal } from '../common/modal.js';
// import { getDateTime } from '../common/utils.js';

// const weekElem = document.querySelector('.calendar__week');
// const deleteEventBtn = document.querySelector('.events-btn__delete-btn');
// const editEventBtn = document.querySelector('.events-btn__edit-btn');

// const handleEventClick = (event) => {
//   event.preventDefault();
//   const target = event.target.closest('.event');
//   if (!target) {
//     return;
//   }
//   openPopup(event.clientX, event.clientY);
//   setItem('eventIdToDelete', target.dataset.eventId);
// };

// const removeEventsFromCalendar = () => {
//   const eventsElems = document.querySelectorAll('.event');
//   eventsElems.forEach((eventElem) => eventElem.remove());
// };


// const createEventElement = (event) => {
//   const { start, end, title, id, description, color } = event;
//   const startDate = new Date(start);
//   const endDate = new Date(end);
//   const formatTime = (date) => (date + '').padStart(2, '0');
//   const startHours = formatTime(startDate.getHours());
//   const startMinutes = formatTime(startDate.getMinutes());
//   const endHours = formatTime(endDate.getHours());
//   const endMinutes = formatTime(endDate.getMinutes());

//   const eventTimeContent = `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;

//   const eventElem = document.createElement('div');
//   eventElem.dataset.eventId = id;
//   eventElem.style.top = startDate.getMinutes() + 'px';
//   eventElem.style.height = ((endDate - startDate) / 60000).toFixed() + 'px';
//   eventElem.classList.add('event');
//   eventElem.style.backgroundColor = color;

//   const eventTitleElem = document.createElement('div');
//   eventTitleElem.textContent = title;
//   eventTitleElem.classList.add('event__title');

//   const eventTimeElem = document.createElement('div');
//   eventTimeElem.textContent = eventTimeContent;
//   eventTimeElem.classList.add('event__time');

//   const eventDescriptionElem = document.createElement('div');
//   eventDescriptionElem.textContent = description;
//   eventDescriptionElem.classList.add('event__description');

//   eventElem.append(eventTitleElem, eventTimeElem, eventDescriptionElem);
//   return eventElem;
// };

// export const renderEvents = async () => {
//   removeEventsFromCalendar();
//   const events = await getEventsList(serverUrl);
//   const eventsByDateAndTime = events.reduce((events, event) => {
//     const { start } = event;
//     const startDate = new Date(start);
//     const day = startDate.getDate();
//     const month = startDate.getMonth() + 1;
//     const time = startDate.getHours();
//     const key = `${day}-${month}-${time}`;
//     events[key] = events[key] || [];
//     events[key].push(event);
//     return events;
//   }, {});

//   const timeSlotsElems = document.querySelectorAll('.calendar__time-slot');
//   timeSlotsElems.forEach((timeSlotElem) => {
//     const day = timeSlotElem.closest('.calendar__day').dataset.day;
//     const time = timeSlotElem.dataset.time;
//     const month = timeSlotElem.closest('.calendar__day').dataset.month;
//     const key = `${day}-${month}-${time}`;
//     const eventsForTimeSlot = eventsByDateAndTime[key] || [];
//     eventsForTimeSlot.forEach((event) => {
//       timeSlotElem.append(createEventElement(event));
//     });
//   });
// };

// const fillForm = (event) => {
//   const { title, description, start, end, date } = event;

//   const titleInput = document.querySelector('input[name="title"]');
//   const descriptionInput = document.querySelector(
//     'textarea[name="description"]'
//   );
//   const dateInput = document.querySelector('input[name="date"]');
//   const startTimeInput = document.querySelector('input[name="startTime"]');
//   const endTimeInput = document.querySelector('input[name="endTime"]');

//   const startTime = new Date(start).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const endTime = new Date(end).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   titleInput.value = title;
//   descriptionInput.value = description;
//   dateInput.value = date;
//   startTimeInput.value = startTime;
//   endTimeInput.value = endTime;
// };

// export const onEventUpdate = async () => {
//   console.log('onEventUpdate called');
  
//   const eventIdToUpdate = getItem('eventIdToDelete');
//   console.log('eventIdToUpdate:', eventIdToUpdate);

//   const response = await fetch(`${serverUrl}/${eventIdToUpdate}`);
//   console.log('Response from fetch:', response);

//   const event = await response.json();
//   console.log('Event:', event);

//   closePopup();
//   openModal();
//   fillForm(event);

//   const form = document.querySelector('.event-form');
//   form.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     console.log('Form submit event');

//     const formData = new FormData(form);
//     const { startTime, endTime, date, ...rest } = Object.fromEntries(formData.entries());
//     console.log('Form data:', rest);

//     const eventDetails = {
//       ...rest,
//       date,
//       start: getDateTime(date, startTime),
//       end: getDateTime(date, endTime),
//     };
//     console.log('Event details:', eventDetails);

//     const response = await updateEvent( eventIdToUpdate, eventDetails);
//     console.log('Response from updateEvent:', response);

//     if (response.ok) {
//       console.log('Event updated successfully');
//       await renderEvents();
//       console.log('Events rendered');
//       closeModal();
//     } else {
//       console.error('Failed to update event:', response.statusText);
//     }
//   });
// };


// const onDeleteEvent = () => {
//   const eventIdToDelete = getItem('eventIdToDelete');

//   deleteEvent(eventIdToDelete).then(() => {
//     const events = getItem('events');
//     const index = events.findIndex(
//       event => String(event.id) === String(eventIdToDelete)
//     );
//     events.splice(index, 1);

//     setItem('events', events);
//     setItem('eventIdToDelete', null);
//     closePopup();
//     renderEvents();
//   });
// };

// deleteEventBtn.addEventListener('click', onDeleteEvent);

// weekElem.addEventListener('click', handleEventClick);

// editEventBtn.addEventListener('click', () => {
//   document.querySelector('.event-form__submit-btn').textContent = 'Edit';
//   onEventUpdate();
// });