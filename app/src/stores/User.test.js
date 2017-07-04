import {UserStore} from "./index";

describe("UserStore", () => {
    
    beforeEach(() => {
        // const encoded = JSON.stringify({email: 'me@email.com'});
        // localStorage.setItem('token', `header.${encoded}.signature`);
    });

    it("set token", () => {
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmdhbGxpLm1hcmNvQGdtYWlsLmNvbSIsImlhdCI6MTQ5ODE0MTYyMX0.ZftM4kGcAilfn_bX4-Q3Yoj9gyD9UX9Vy6l5gRfc-Qg`;
        UserStore.setToken(token);
        expect(UserStore.email).toBe('sangalli.marco@gmail.com');
    });
});