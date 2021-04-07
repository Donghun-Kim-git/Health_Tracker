import React, {Component} from 'react';
import WorkoutList from '../components/Workouts/WorkoutTable';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner.js';
import MyModal from '../components/Modal/Modal.js';

class WorkoutPage extends Component {
    state = {
        workouts: [],
        workoutTypes: [],
        isLoading: false,
        creating: false,
        newWorkout: false
    }
    static contextType = AuthContext;
    isActive = true;

    constructor(props) {
        super(props)
        this.titleElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
        this.setsElRef = React.createRef();
        this.newTitleElRef = React.createRef();

    }

    componentDidMount() {
        this.fetchWorkouts();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    fetchWorkouts() {
        this.setState({isLoading: true});

        const requestBody = {
            query: `
                query{
                    workouts{
                        _id
                        title
                        sets
                        date
                        creator{
                            workoutTypes
                        }
                    }
                }
            `
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error("Failed to fetch workouts!")
                }
                return res.json()
            })
            .then(resData => {
                console.log("workouts is successfully fetched! ", resData);
                const workouts = resData.data.workouts;
                const workoutTypes = workouts.length ? resData.data.workouts[0].creator.workoutTypes : [];
                if (this.isActive) {
                    this.setState({workouts: workouts, workoutTypes: workoutTypes, isLoading: false});
                }
            })
            .catch(err => {
                console.log(err);
                if (this.isActive) {
                    this.setState({isLoading: false});
                }
            });
    };

    startCreateWorkoutHandler = () => {
        this.setState({creating: true});
    };
    handleCreateNewWorkout = () => {

        this.titleElRef.current.value === "...create new workout" ?
            this.setState({newWorkout: true})
            :
            this.setState({newWorkout: false});
        console.log("titleRef: ", this.titleElRef.current.value);
    };
    modalCancelHandler = () => {
        this.setState({creating: false, newWorkout: false});
    };
    modalSaveHandler = () => {
        this.setState({creating: false, newWorkout: false, isLoading: true});
        const title = this.newTitleElRef.current ? this.newTitleElRef.current.value : this.titleElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const sets = this.setsElRef.current.value;
        const date = this.dateElRef.current.value;
        if (
            title.trim().length === 0 ||
            sets <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }
        const workout = {title, sets, date, description};
        console.log("workout: ", workout);
        const requestBody = {
            query: `
            mutation CreateWorkout($title: String!, $date: String!, $description: String!, $sets: String!){
                createWorkout(workoutInput: {title: $title, date: $date, description: $description, sets: $sets}){
                    _id
                    title
                    date
                    description
                    sets
                }
            }
            `,
            variables: {
                title: title,
                date: date,
                description: description,
                sets: sets
            }
        }
        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log("creating workout, responseData: ", resData);

                this.setState(prevState => {
                    const updatedWorkouts = [...prevState.workouts];
                    const updatedWorkoutTypes = [...prevState.workoutTypes];
                    updatedWorkouts.push({
                        _id: resData.data.createWorkout._id,
                        title: resData.data.createWorkout.title,
                        description: resData.data.createWorkout.description,
                        date: resData.data.createWorkout.date,
                        sets: resData.data.createWorkout.sets,
                        creator: {
                            _id: this.context.userId
                        }
                    });
                    if(!updatedWorkoutTypes.includes(title)){
                        updatedWorkoutTypes.push(title);
                        console.log("updated Workout Types:", updatedWorkoutTypes);
                    }
                    return {workouts: updatedWorkouts, workoutTypes: updatedWorkoutTypes, isLoading: false};
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    deleteWorkoutHandler = (workoutId) => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation DeleteWorkout($workoutId: ID!){
                    deleteWorkout(workoutId: $workoutId){
                        _id
                        title
                        date
                        description
                        sets
                    }
                }
            `,
            variables: {
                workoutId: workoutId
            }
        }
        const token = this.context.token;
        fetch("http://localhost:8000/graphql", {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log("creating workout, responseData: ", resData);
                this.setState(prevState => {
                    const updatedWorkouts = prevState.workouts.filter(workout => {
                        return workout._id !== workoutId;
                    });
                    return {workouts: updatedWorkouts, isLoading: false};
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    clearWorkoutHandler = () => {

    }

    render() {
        return (
            <React.Fragment>
                {this.state.loading && <Spinner/>}
                <MyModal
                    show={this.state.creating}
                    handleClose={this.modalCancelHandler}
                    handleSave={this.modalSaveHandler}
                >
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <select className="form-control form-control-sm" ref={this.titleElRef}
                                    onClick={this.handleCreateNewWorkout} onChange={this.handleCreateNewWorkout}>
                                {this.state.workoutTypes.map(workoutType => {
                                    return <option key={workoutType+"Option"}>{workoutType}</option>
                                })}
                                <option key={"newOption"}>...create new workout</option>
                            </select>
                            {this.state.newWorkout && (
                                <input className="form-control" type="text" id="title" ref={this.newTitleElRef}
                                       placeholder="ex) Running" required/>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">set</label>
                            <input className="form-control" type="text" id="price" ref={this.setsElRef}
                                   placeholder="ex) 3 x 3 x 3" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input className="form-control" type="datetime-local" id="date" ref={this.dateElRef}
                                   required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                rows="4"
                                ref={this.descriptionElRef}
                                required
                                defaultValue="..."
                            />
                        </div>
                    </form>
                </MyModal>

                {this.state.isLoading ? <Spinner/> : (
                    <div className="row-fluid" style={{paddingTop: "3rem"}}>
                        <div className="col-fluid">
                            <WorkoutList
                                workouts={this.state.workouts}
                                authUserId={this.context.userId}
                                workoutTypes={this.state.workoutTypes}
                                deleteWorkoutHandler={this.deleteWorkoutHandler}
                                clearWorkoutHandler={this.clearWorkoutHandler}
                            />
                            <button className="btn btn-primary" onClick={this.startCreateWorkoutHandler}> Add workout!
                            </button>
                        </div>
                    </div>
                )}

            </React.Fragment>
        )
    }
}

export default WorkoutPage;
