const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authMiddleware = require('../middlewares/auth');

console.log('member routes file loaded');

router.get('/test', (req, res) => {
    res.send('member route works!');
})

router.post('/', authMiddleware, async (req, res) => {
    console.log("🔥 POST /members route hit");
    try {
        const {
            fullName,
            email,
            phone,
            membershipName,
            durationDays,
            numberOfSessions,
            price,
            membershipStart,
            notes
        } = req.body;

        const existingMember = await Member.findOne({ fullName });
        if (existingMember) {
            return res.status(400).json({ error: "Member with this fullName already exists" });
        }

        const startDate = new Date(membershipStart);

        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + durationDays);

        const member = new Member({
            fullName,
            email,
            phone,
            membershipName,
            durationDays,
            numberOfSessions,
            price,
            membershipStart: startDate,
            membershipEnd: endDate,
            notes
        });

        await member.save();
        res.status(201).json(member);

    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ error: "Member not found" });
        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;

        // If membershipStart or durationDays are updated, recalc membershipEnd
        if (updates.membershipStart || updates.durationDays) {
            const member = await Member.findById(req.params.id);
            if (!member) return res.status(404).json({ error: "Member not found" });

            if (updates.membershipStart) member.membershipStart = new Date(updates.membershipStart);
            if (updates.durationDays) member.durationDays = updates.durationDays;

            member.membershipEnd = new Date(member.membershipStart);
            member.membershipEnd.setUTCDate(member.membershipEnd.getUTCDate() + member.durationDays);

            // merge other updates
            Object.keys(updates).forEach(key => {
                if (!['membershipStart', 'durationDays'].includes(key)) {
                    member[key] = updates[key];
                }
            });

            await member.save();
            return res.json(member);
        }

        // if no membershipStart/durationDays, just update normally
        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!updatedMember) return res.status(404).json({ error: "Member not found" });
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if (!deletedMember) return res.status(404).json({ error: "Member not found" });
        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;