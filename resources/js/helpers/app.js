import { read } from "./resource";

export function asset(resource, hideTrailingSlash = false) {
	if (!resource) return;

	const trailingSlash = !hideTrailingSlash ? "/" : "";
	const APP = resource.indexOf("/uploads") === 0 ? "http://school.educate2earn.com" : window.location.origin;
	return APP + trailingSlash + resource;
}

export function getUserFullName(user) {
	if (user.profile) {
		const firstName = user.profile.first_name;
		const lastName = user.profile.last_name;
		return firstName && lastName ? firstName + " " + lastName : user.name;
	}
	return user.name;
}

export function getUserAvatar(user) {
	let avatar = "/images/user.jpg";
	if (user && user.profile.avatar) {
		avatar = user.profile.avatar;
	}
	return asset(avatar, true);
}

export function getuser() {
	let user = localStorage.getItem('user');
	if (user) return JSON.parse(user);
	return {};
}

export function toggleModel(name) {
	let modal;

	if (typeof name == 'string') {
		modal = document.querySelector('.modal-'+name);
	} else {
		modal = name.target.parentElement;
	}

	if (modal.classList.contains('show')) {
		document.body.classList.remove('modal-visible');
		modal.classList.remove('show');
	} else {
		document.body.classList.add('modal-visible');
		modal.classList.add('show');
	}
}

export function getUserRegulations() {
	return new Promise(function (resolve) {
		read('users/' + getuser().id, {}).then(u_res => {
			read('regulations', {}).then(res => {
				resolve(res.data.regulations.filter(r => {
					return !!u_res.data.licenses.find(l => l.regulation_id == r.id)
				}));
			});
		});
	});
}