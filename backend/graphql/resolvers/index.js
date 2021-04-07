const userResolver = require('./user');
const workoutsResolver = require('./workout');

const rootResolver ={
    ...userResolver,
    ...workoutsResolver
};

module.exports = rootResolver;
