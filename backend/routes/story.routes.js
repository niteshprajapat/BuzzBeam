import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { deleteStoryById, getAllFollowingsStory, storyViewedBy, uploadMedia, uploadStory, viewStory } from '../controllers/story.controller.js';


// Routes

router.post('/uploadFile', uploadMedia);


router.post("/uploadStory", isAuthenticated, uploadStory);
router.get("/getAllFollowingsStory", isAuthenticated, getAllFollowingsStory);


// delete story
router.delete("/deleteStoryById/:id", isAuthenticated, deleteStoryById);

// remove story after 24hrs -> Done by Cron job

// story viewers
router.get("/viewStory/:id", isAuthenticated, viewStory);
router.get("/storyViewedBy/:id", isAuthenticated, storyViewedBy);


export default router;