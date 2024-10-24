import Story from '../models/story.model.js';
import cron from 'node-cron';

const removeStoryAutomatically = async () => {
    console.log("hasas")

    const expiredStories = await Story.find({
        expiresAt: { $lt: new Date() },
        isActive: true,
    });


    // mark as isActive: false
    await Story.updateMany(
        { _id: { $in: expiredStories?.map((expireStore) => expireStore._id) } },
        { $set: { isActive: false } },
    )

    // delete all expired stories from DB
    await Story.deleteMany(
        { _id: { $in: expiredStories?.map((expireStore) => expireStore._id) } }
    )


    console.log("expiredStories", expiredStories);
}

cron.schedule('0 * * * *', removeStoryAutomatically);
// cron.schedule('* * * * * *', removeStoryAutomatically);

