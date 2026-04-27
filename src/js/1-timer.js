// Описаний в документації
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const sec = document.querySelector('[data-seconds]');
let interval = null;

let userSelectedDate = null;
startBtn.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
    console.log(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  if (!userSelectedDate || interval) {
    return;
  }
  interval = setInterval(() => {
    const diff = userSelectedDate.getTime() - Date.now();
    if (diff <= 0) {
      clearInterval(interval);
      interval = null;
      days.textContent = '00';
      hours.textContent = '00';
      minutes.textContent = '00';
      sec.textContent = '00';
      return;
    }
    const { days: d, hours: h, minutes: m, seconds: s } = convertMs(diff);
    days.textContent = addLeadingZero(d);
    hours.textContent = addLeadingZero(h);
    minutes.textContent = addLeadingZero(m);
    sec.textContent = addLeadingZero(s);
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
