import express from 'express';
import simplifyDebts from '../controllers/simplifyDebts.controllers'; 

const router = express.Router();

//simplify debts
router.post('/', async (req, res) => {
    const { groupId } = req.body; 
    const result = await simplifyDebts(groupId);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

export default router;
