// routes/simplifydebts.ts
import express from 'express';
import simplifyDebts from '../controllers/simplifyDebts.controllers'; 

const router = express.Router();

// Route to simplify debts
router.post('/', async (req, res) => {
    const { groupId } = req.body; // Get groupId from request body
    const result = await simplifyDebts(groupId); // Call the simplifyDebts function

    // Send response based on result
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result); // Send 404 if group not found
    }
});

export default router;
