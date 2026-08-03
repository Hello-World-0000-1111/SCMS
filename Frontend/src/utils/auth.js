export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded?.role || null;
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};