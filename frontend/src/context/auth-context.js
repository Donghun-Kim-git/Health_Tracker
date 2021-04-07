import React from 'react';

export default React.createContext({
    token: null,
    userEmail: null,
    userId: null,
    workoutTypes: null,
    login: (token, userEmail, userId, tokenExpiration, workoutTypes) =>{},
    logout: () => {}
})