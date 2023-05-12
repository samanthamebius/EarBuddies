import express from 'express';
import { getStudiosId } from '../../dao/user_dao.js';
import { getStudio } from '../../dao/studio_dao.js';

const router = express.Router();

/**
 * @route   GET api/home/:id/studios
 * @desc    Get all studios that a user is in
 * @params  id: String
 * @returns 200 if successful
 * @throws  500 if unsuccessful
 */
router.get('/:id/studios', async (req, res) => {
	try {
		const { id } = req.params;
		const studioIds = await getStudiosId(id);
		const studios = [];

		//cycle through users studio ids and get the studio object to place in its own array
		for (let i = 0; i < studioIds.length; i++) {
			const studio = await getStudio(studioIds[i]);
			studios.push(studio[0]);
		}

		return res.status(200).json(studios);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
