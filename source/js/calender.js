import {
	getDay,
	addDays,
	addMonths,
	getMonth,
	getDate,
	isSameDay,
	getYear,
	format,
} from 'date-fns';
import { openTaskModal, renderTasks } from './task';

export function getDisplayedDays(month, year, tasks) {
	const displayedDays = [];
	const firstDateOfMonth = new Date(year, month, 1);
	const firstDayOfMonth = getDay(firstDateOfMonth);
	const firstDateOfWeek = addDays(firstDateOfMonth, -firstDayOfMonth);

	for (let i = 0; i < 35; i++) {
		const currentDate = addDays(firstDateOfWeek, i);
		displayedDays.push({
			date: currentDate,
			year: getYear(currentDate),
			month: getMonth(currentDate),
			dayOfMonth: getDate(currentDate),
			dayOfWeek: getDay(currentDate),
			isCurrentDay: isSameDay(currentDate, new Date()),
		});
	}

	renderDisplayedDays(displayedDays, tasks);
	return displayedDays;
}

function renderDisplayedDays(days, tasks) {
	const calender = document.querySelector('.calender');
	const { date: firstDayOfMonthDate } = days.find(day => day.dayOfMonth === 1);

	calender.innerHTML = `
	<p class="calender__weekDay">sun</p>
	<p class="calender__weekDay">mon</p>
	<p class="calender__weekDay">tue</p>
	<p class="calender__weekDay">wed</p>
	<p class="calender__weekDay">thu</p>
	<p class="calender__weekDay">fri</p>
	<p class="calender__weekDay">sat</p>
	`;

	days.forEach(dayObj => {
		const { date, dayOfMonth, isCurrentDay } = dayObj;
		const day = document
			.querySelector('.day-template')
			.content.firstElementChild.cloneNode(true);
		const dayNumber = day.querySelector('.day__number');
		day.dataset.date = format(date, 'dd-MM-yyyy');
		day.style.gridColumn = format(date, 'E..EEE');
		dayNumber.textContent =
			dayOfMonth === 1 ? `${format(date, 'MMM')} ${dayOfMonth}` : dayOfMonth;
		if (isCurrentDay) dayNumber.classList.add('active');
		day.addEventListener('click', e =>
			openTaskModal(dayObj, tasks, e.currentTarget)
		);
		calender.appendChild(day);
	});

	updateMonthElement(
		format(firstDayOfMonthDate, 'MMMM'),
		format(firstDayOfMonthDate, 'yyyy')
	);

	renderTasks(tasks);
}

export function addMonthsToDisplayedMonth(days, monthsToAdd) {
	const { month, year } = days.find(day => day.dayOfMonth === 1);
	const firstDateOfDisplayedDays = new Date(year, month, 1);
	const firstDateOfNextMonth = addMonths(firstDateOfDisplayedDays, monthsToAdd);
	return [getMonth(firstDateOfNextMonth), getYear(firstDateOfNextMonth)];
}

function updateMonthElement(month, year) {
	const monthElement = document.querySelector('[data-current-month]');
	monthElement.textContent = `${month} ${year}`;
}
