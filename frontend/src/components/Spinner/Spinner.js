import React, {Component} from 'react';

class Spinner extends Component{
    render(){
        return (
            <div className="d-flex justify-content-center align-items-center h-75">
                <div className="spinner-border text-danger " role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
}

export default Spinner;