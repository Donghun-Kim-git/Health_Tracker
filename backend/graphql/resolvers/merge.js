const User = require('../../models/user');
const dateToString = date => new Date(date).toISOString();

const DataLoader = require('dataloader');
const userLoader = new DataLoader( userIds => {
    return User.find({ _id: { $in: userIds }});
});
const findUser = async userId => {
    try{
        const user = await userLoader.load(userId.toString());
        console.log("Find user while fetching workout:", user._doc);
        return {
            ...user._doc,
            _id: user.id,
            password: null
        }
    }
    catch (err){
        throw err;
    }
};
const transformWorkout = workout => {
    return {
        ...workout._doc,
        _id: workout.id,
        date: dateToString(workout._doc.date),
        creator: findUser.bind(this, workout.creator)
    }
};
exports.transformWorkout = transformWorkout;
