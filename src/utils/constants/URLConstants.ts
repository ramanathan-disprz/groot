export class URLConstants {
    static readonly API_BASE_URL = "http://localhost:5220/v1";
    static readonly AUTH = `${URLConstants.API_BASE_URL}/auth`;
    static readonly LOGIN = `${URLConstants.AUTH}/login`;
    static readonly REGISTER = `${URLConstants.AUTH}/register`;
    static readonly EVENTS = `${URLConstants.API_BASE_URL}/events`;
}
