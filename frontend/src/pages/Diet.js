import React, {Component} from 'react';
import AuthContext from '../context/auth-context';

class DietPage extends Component{
    static contextType = AuthContext;
    render(){
        return(
            <div className="row-fluid text-center" style={{paddingTop: "7rem"}}>
                <div className="col-fluid" style={{background: "#888"}}>
                     <h1> Sorry, The DietPage will be developed soon!</h1>


                </div>
            </div>
        )
    }
}

export default DietPage;