export function asset(resource) {
    return window.location.origin + "/" + resource;
}

export function getUserFullName(user) {
    if (user.profile) {
        const firstName = user.profile.first_name;
        const lastName = user.profile.last_name;
        return firstName && lastName ? firstName + " " + lastName : user.name;
    }
    return user.name;
}

export function getuser() {
    let user = localStorage.getItem('user');
    if (user) return JSON.parse(user);
    return {};
}