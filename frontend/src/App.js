import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import React, {Component} from 'react';
import AuthPage from './pages/Auth.js';
import WorkoutPage from './pages/Workout.js';
import DietPage from './pages/Diet.js';
import MainNavigation from './components/Navigation/MainNavigation';
import MainPage from './pages/MainPage';
import EditProfilePage from './pages/EditProfile';

import './App.css';

import AuthContext from './context/auth-context'

class App extends Component{
    state = {
        token: null,
        userEmail: null,
        userId: null,
        workoutTypes: null
    }
    login = (token, userEmail, userId, tokenExpiration, workoutTypes) => {
        this.setState({token: token, userEmail: userEmail, userId: userId, workoutTypes: workoutTypes});
    }
    logout = () => {
        this.setState({token: null, userEmail: null, userId: null, workoutTypes: null});
    }
    render(){
        return (
                <BrowserRouter>
                    <AuthContext.Provider
                        value = {{
                            token: this.state.token,
                            userEmail: this.state.userEmail,
                            userId: this.state.userId,
                            login: this.login,
                            logout: this.logout
                        }}>
                        <MainNavigation/>
                        <main role="main" className="container-fluid vh-100 h-auto" style={{background: "#86818F"}}>
                            <Switch>
                                <Route path="/" component={MainPage} exact/>
                                {!this.state.token && <Route path="/auth" component={AuthPage}/>}
                                {!this.state.token && <Redirect to = "/" exact/>}
                                {this.state.token && <Redirect from = "/auth" to = "/workout" exact/>}
                                {this.state.token && <Route path="/workout" component={WorkoutPage}/>}
                                {this.state.token && <Route path="/diet" component={DietPage}/>}
                                {this.state.token && <Route path="/editProfile" component={EditProfilePage}/>}
                            </Switch>
                        </main>
                    </AuthContext.Provider>
                </BrowserRouter>
        )
    }
}

export default App;
