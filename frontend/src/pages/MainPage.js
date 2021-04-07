import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../context/auth-context';

class MainPage extends Component{
    static contextType = AuthContext;

    render(){
        return(
            <React.Fragment>
                <div className="row h-50 text-center" style={{background: "#86818F", paddingTop: "10rem"}}>
                    <div className="col bg-light" style={{paddingTop: "3rem"}}>
                        <h1> Welcome to Health Tracker!</h1>
                    </div>
                </div>
                <div className="row h-25 text-center" style={{background: "#86818F", paddingTop: "10rem"}}>
                    <div className="col">
                        <h2> You can record your workouts in this website!</h2>
                    </div>
                </div>
                <div className="row h-25 justify-content-md-center" style={{background: "#86818F"}}>
                    <div className='col-fluid col-md-auto '>
                        {!this.context.token &&
                            <NavLink className="navbar" to="/auth" style={{background: "#655F6C", color: "white", fontWeight: "bold" }}>
                                Don't have account? go create one! / Login
                            </NavLink>
                        }

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default MainPage;