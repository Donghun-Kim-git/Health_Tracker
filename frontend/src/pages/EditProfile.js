import React, {Component} from 'react';
import AuthContext from '../context/auth-context';
import Alert from '../components/Modal/Alert';
import Spinner from '../components/Spinner/Spinner';
class EditProfilePage extends Component{
    state = {
        asking: false,
        clearing: false
    }
    static contextType = AuthContext;
    showConfirmPrompt = () => {
        this.setState({asking: true});
    }
    handleClose = () => {
        this.setState({asking: false});
    }
    handleClearWorkouts = () => {
        this.setState({asking: false, clearing: true});
        const requestBody = {
            query: `mutation{
                        deleteWorkouts{
                            _id
                            title
                        }
                   }`
        };
        fetch("http://localhost:8000/graphql", {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201){
                    throw new Error("Failed to clear workouts!")
                }
                return res.json()
            })
            .then(resData => {
                console.log("workouts has been successfully purged!", resData);
                this.setState({clearing: false})
            })
            .catch(err => {
                console.log(err);
                this.setState({clearing: false})
            })

    }
    render(){
        return(
            <React.Fragment>
                {this.state.clearing && <Spinner/>}
                <Alert
                    show={this.state.asking}
                    handleClose={this.handleClose}
                    handleClearWorkouts={this.handleClearWorkouts}
                />
                <div className="row text-center" style={{paddingTop: "5rem"}}>
                    <div className="col">
                        <div>Your Email: {this.context.userEmail}</div>
                        <div>Your key(id): {this.context.userId}</div>
                    </div>
                </div>
                <div className="row text-center" style={{paddingTop: "5rem"}}>
                    <div className="col">
                        <button className="btn btn-danger" onClick={this.showConfirmPrompt}>clear all workout history</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default EditProfilePage;
