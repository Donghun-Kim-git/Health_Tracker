import React from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../../context/auth-context'

const mainNavigation = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                    <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                        <NavLink className="navbar-brand" to="/">Health Tracker</NavLink>
                        <div className="navbar-collapse collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item" key="workoutLink">
                                    {context.token && <NavLink className="nav-link" to="/workout">Workouts</NavLink>}
                                </li>
                                <li className="nav-item" key="dietLink">
                                    {context.token && <NavLink className="nav-link" to="/diet">diet</NavLink>}
                                </li>
                                <li className="nav-item" key="authLink">
                                    {!context.token && <NavLink className="nav-link" to="/auth">Sign-up/Login</NavLink>}
                                </li>
                            </ul>
                        </div>
                        <div className="nav-item" key="navLink">
                            {context.token && <NavLink className="nav-link" to="/editProfile">Setting</NavLink>}
                        </div>
                        <div className="mt-2 mt-md-0">
                            {context.token && <button className="btn btn-outline-success my-2 my-sm-0" onClick={context.logout}>Logout</button>}
                        </div>
                    </nav>
            )
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;