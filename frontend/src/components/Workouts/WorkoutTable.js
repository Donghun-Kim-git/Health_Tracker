import React from 'react'
const workoutTable = props => {
    const heading = props.workoutTypes;
    if (!heading.length){
        return <h1 className="text-center text-dark">Welcome! click on the button below to record your workouts!</h1>
    }
    const table_heading = <thead className="thead-dark"><tr><th key="dateHeading" scope="col">date</th>{heading.map(hd => {return <th key={hd+"heading"} scope="col">{hd}</th>})}</tr></thead>

    let workout_by_date = {}
    const workouts_sorted = props.workouts.sort((a, b) => new Date(a.date) - new Date(b.date))

    workouts_sorted.map(workout => workout_by_date[workout.date.slice(0,10)] ? workout_by_date[workout.date.slice(0,10)].push(workout)
                                                                : workout_by_date[workout.date.slice(0,10)] = [workout]);

    const contents = Object.keys(workout_by_date).map(day => {
        let worked = heading.length;
        const workouts = workout_by_date[day];
        const workouts_dict = {};

        workouts.map(workout => { return workouts_dict[workout.title] = workout});
        console.log("workouts_dict: ", workouts_dict, "heading: ", heading);
        const row = heading.map(hd => {
            console.log(workouts_dict[hd]);
            if(workouts_dict[hd]){
                worked -= 1
                return <td key={day+hd}>{workouts_dict[hd].sets}
                <button className="btn btn-secondary btn-sm" style={{marginLeft: "1.5rem"}} onClick={props.deleteWorkoutHandler.bind(this, workouts_dict[hd]._id)}>delete</button>
                </td>
            }
            return <td key={day+hd} className="cell_lazy">-</td>
        });
        const level = worked === 0 ? "bg-success" : worked >= heading.length-1 ? "bg-danger" : "bg-warning"
        console.log("level: ", level)
        return  <tr key={day+"row"} className={level}>
                    <td key={day+"date"}>
                        {day.slice(0, 10)}
                    </td>
                        {row}
                </tr>

    });

    return <table className="table table-bordered table-hover text-center">{table_heading}<tbody key="workoutTableBody">{contents}</tbody></table>;
};

export default workoutTable;
