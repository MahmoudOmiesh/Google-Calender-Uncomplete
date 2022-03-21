import '../sass/main.scss';
import { getMonth, getYear } from 'date-fns';
import { addMonthsToDisplayedMonth, getDisplayedDays } from './calender';

const currentDate = new Date();
const nextMonthButton = document.querySelector('[data-next-month]');
const prevMonthButton = document.querySelector('[data-prev-month]');

let tasks = [];
let displayedDays = getDisplayedDays(
	getMonth(currentDate),
	getYear(currentDate),
	tasks
);

nextMonthButton.addEventListener('click', () => {
	const [month, year] = addMonthsToDisplayedMonth(displayedDays, 1);
	displayedDays = getDisplayedDays(month, year, tasks);
});

prevMonthButton.addEventListener('click', () => {
	const [month, year] = addMonthsToDisplayedMonth(displayedDays, -1);
	displayedDays = getDisplayedDays(month, year, tasks);
});
