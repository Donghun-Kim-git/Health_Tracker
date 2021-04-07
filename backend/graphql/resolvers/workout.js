const Workout = require('../../models/workout');
const User = require('../../models/user');
const {workoutLoader, transformWorkout} = require('./merge');
const DataLoader = require('dataloader')
const userLoader = new DataLoader( userIds => {
    return User.find( { _id: {$in: userIds}});
})
module.exports = {
    // 무조건 args 가 있어야지 req 가 인식된다!!! req 만썼는데 존나안됨.
    workouts: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const workouts = await Workout.find({creator : req.userId});
            return workouts.map(workout => {
                return transformWorkout(workout);
            })
        }
        catch(err){
            throw err;
        }
    },
    createWorkout: async(args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const workout = new Workout({
            title: args.workoutInput.title,
            date: new Date(args.workoutInput.date),
            description: args.workoutInput.description,
            sets: args.workoutInput.sets,
            creator: req.userId
        });
        const creator = await User.findById(req.userId);
        if (!creator) {
            throw new Error('User not found.');
        }
        console.log("workoutTypes before:", creator.workoutTypes);
        if (!creator.workoutTypes.includes(args.workoutInput.title)){
            console.log("not including!");
            await creator.workoutTypes.push(args.workoutInput.title);

            try {
                const result = await creator.save();
                console.log("workoutTypes after:", result.workoutTypes);
            }
            catch(err){
                throw err;
            }
        }

        try{
            const result = await workout.save();
            return transformWorkout(result);
        }
        catch (err){
            throw err;
        }

    },
    deleteWorkout: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const workout = await Workout.findById(args.workoutId).populate('workout');
            const deletedWorkout = transformWorkout(workout);
            await Workout.deleteOne({ _id: args.workoutId });


            return deletedWorkout;
        } catch (err) {
            throw err;
        }
    },
    deleteWorkouts: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try{
            const userId = req.userId;
            const workouts = await Workout.find({creator: userId});
            await Workout.deleteMany({creator: userId});
            const user = await User.findById(userId);
            await user.workoutTypes.splice(0, user.workoutTypes.length);
            await user.save();
            return workouts.map(workout => { return transformWorkout(workout)});
        }
        catch(err){
            throw err;
        }
    }
};