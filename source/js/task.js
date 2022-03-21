import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export function openTaskModal(dayObj, tasks, dayEl) {
	if (
		dayEl.querySelector('.addtask') ||
		mouseInside(dayEl.querySelector('.addtask') || null)
	)
		return;

	document
		.querySelectorAll('.day')
		.forEach(day => day.querySelector('.addtask') && closeTaskModal(day));

	const taskModal = document
		.querySelector('.addtask-template')
		.content.firstElementChild.cloneNode(true);
	const taskModalDate = taskModal.querySelector('.time__date');
	const taskModalClose = taskModal.querySelector('.addtask__close');
	const taskModalSave = taskModal.querySelector('.addtask__button');

	taskModalDate.textContent = format(dayObj.date, 'LLL dd, yyyy');
	taskModalClose.addEventListener('click', e => closeTaskModal(dayEl, e));
	taskModalSave.addEventListener('click', e =>
		getTaskInfo(
			dayObj,
			tasks,
			e.currentTarget.parentElement.parentElement,
			dayEl,
			e
		)
	);
	dayEl.appendChild(taskModal);
}

function closeTaskModal(day, e) {
	if (e) e.stopPropagation();
	const modal = day.querySelector('.addtask');
	modal.remove();
}

function mouseInside(element) {
	if (!element) return false;
	const { left, right, top, bottom } = element.getBoundingClientRect();
	const { clientX: mouseX, clientY: mouseY } = window.event;
	if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom)
		return true;
}

function getTaskInfo(dayObj, tasks, modalEl, dayEl, e) {
	const taskTitle = modalEl.querySelector('.addtask__title').value;
	const taskDesc = modalEl.querySelector('.addtask__desc').value;
	const taskTime = modalEl.querySelector('.time__picker').value;
	const isTaskAllDay = modalEl.querySelector('.time__allday').checked;
	const taskDate = format(dayObj.date, 'dd-MM-yyyy');
	const task = {
		id: uuidv4(),
		title: taskTitle,
		desc: taskDesc,
		time: taskTime,
		date: taskDate,
		isTaskAllDay,
	};
	tasks.push(task);
	closeTaskModal(dayEl, e);
	renderTasks(tasks);
}

export function renderTasks(tasks) {
	if (!tasks) return;
	for (let i = 0; i < tasks.length; i++) {
		const { id, title, time, date } = tasks[i];
		const dayEl = document.querySelector(`[data-date="${date}"]`);
		if (!dayEl) continue;
		const dayELTasks = [...dayEl.querySelectorAll('.day__task')] || [];
		if (dayELTasks.some(task => task.dataset.id === id)) continue;
		const taskEL = document
			.querySelector('.task-template')
			.content.firstElementChild.cloneNode(true);
		taskEL.dataset.id = id;
		const taskTime = taskEL.querySelector('.task__time');
		const taskTitle = taskEL.querySelector('.task__title');
		taskTime.textContent = time;
		taskTitle.textContent = title;
		dayEl.appendChild(taskEL);
	}
}
