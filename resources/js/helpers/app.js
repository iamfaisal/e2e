export function asset(resource, hideTrailingSlash = false) {
    const trailingSlash = !hideTrailingSlash ? "/" : "";
    return window.location.origin + trailingSlash + resource;
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