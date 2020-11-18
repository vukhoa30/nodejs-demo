import express from 'express';
import {
  getClubsController,
  getClubController,
  addClubController,
  updateClubController,
  deleteClubController
} from '../controllers';

const router = express.Router();

router.use((req, res, next) => {
  if (req.params.id && !Number(req.params.id)) {
    return res.status(400).end('ID is invalid')
  }
  next()
})

router.get('/clubs/:id', getClubController);

router.get('/clubs', getClubsController);

router.post('/clubs', addClubController);

router.put('/clubs/:id', updateClubController);

router.delete('/clubs/:id', deleteClubController);

export default router;
