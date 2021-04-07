import React, {Component} from 'react'
import AuthContext from '../context/auth-context';
import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true
    };
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }
    submitHandler = event => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password){
                        email
                        userId
                        token
                        tokenExpiration
                        workoutTypes
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }
        console.log("requestBody:", requestBody);
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed to fetch!');
                }
                return res.json();
            })
            .then(resData => {
                console.log("successful login! / create account!", resData);
                if (resData.data.login.token) {
                    this.context.login(
                        resData.data.login.token,
                        resData.data.login.email,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration,
                        resData.data.login.workoutTypes
                    )
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="row-fluid vh-100" style={{background: "#86818F", paddingTop: "7rem"}}>
                <div className="col-fluid">
                    <form className="form-signin" onSubmit={this.submitHandler}>
                        <h1 className="text-center mb-4">{this.state.isLogin ? 'Login' : 'Create Account'}</h1>
                        <label htmlFor="inputEmail" className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required
                               autoFocus ref={this.emailEl}/>
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required
                        ref={this.passwordEl}/>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                        <button className="btn btn-lg btn-secondary btn-block" onClick={this.switchModeHandler}>
                            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        )

    }
}

export default AuthPage;
