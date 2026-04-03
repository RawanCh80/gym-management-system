const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authMiddleware = require('../middlewares/adminAuth');

console.log('member routes file loaded');

router.get('/test', (req, res) => {
    res.send('member route works!');
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            fullName,
            phone,
            packageName,
            durationDays,
            numberOfSessions,
            price,
            startDate,
            notes
        } = req.body;

        if (!fullName || !phone || !durationDays || !numberOfSessions || !price || !startDate) {
            return res.status(400).json({
                error: 'All required fields must be provided'
            });
        }

        const existingMember = await Member.findOne({
            fullName,
            gymId: req.admin.gymId
        });

        if (existingMember) {
            return res.status(400).json({
                error: 'Member already exists in this gym'
            });
        }

        const start = new Date(startDate);

        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + durationDays);

        const member = new Member({
            fullName,
            phone,
            gymId: req.admin.gymId,
            packages: [
                {
                    packageName,
                    durationDays,
                    numberOfSessions,
                    price,
                    startDate: start,
                    endDate: end,
                    isActive: true,
                    notes
                }
            ]
        });

        await member.save();

        res.status(201).json(member);

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const members = await Member.find({
            gymId: req.admin.gymId
        }).sort({createdAt: -1});

        res.json(members);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await Member.findOne({
            _id: req.params.id,
            gymId: req.admin.gymId
        });

        if (!member) {
            return res.status(404).json({
                error: 'Member not found'
            });
        }

        res.json(member);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await Member.findOne({
            _id: req.params.id,
            gymId: req.admin.gymId
        });

        if (!member) {
            return res.status(404).json({
                error: 'Member not found'
            });
        }

        const { action, data } = req.body;

        if (!action || !data) {
            return res.status(400).json({
                error: 'action and data are required'
            });
        }

        // =========================
        // EDIT MEMBER INFO
        // =========================
        if (action === 'edit-member') {
            const { fullName, phone } = data;

            if (fullName) member.fullName = fullName;
            if (phone) member.phone = phone;

            await member.save();
            return res.json(member);
        }

        // =========================
        // EDIT EXISTING PACKAGE
        // =========================
        if (action === 'edit-package') {
            const {
                packageId,
                packageName,
                durationDays,
                numberOfSessions,
                price,
                notes
            } = data;

            const pkg = member.packages.id(packageId);

            if (!pkg) {
                return res.status(404).json({
                    error: 'Package not found'
                });
            }

            if (packageName) pkg.packageName = packageName;
            if (durationDays) pkg.durationDays = durationDays;
            if (numberOfSessions) pkg.numberOfSessions = numberOfSessions;
            if (price) pkg.price = price;
            if (notes) pkg.notes = notes;

            // recalculate end date only if duration changed
            if (durationDays) {
                pkg.endDate = new Date(pkg.startDate);
                pkg.endDate.setUTCDate(
                    pkg.endDate.getUTCDate() + pkg.durationDays
                );
            }

            await member.save();
            return res.json(member);
        }

        // =========================
        // ADD NEW PACKAGE
        // =========================
        if (action === 'add-package') {
            const {
                packageName,
                durationDays,
                numberOfSessions,
                price,
                startDate,
                notes
            } = data;

            if (
                !packageName ||
                !durationDays ||
                !numberOfSessions ||
                !price ||
                !startDate
            ) {
                return res.status(400).json({
                    error: 'Missing required package fields'
                });
            }

            // deactivate current active package
            member.packages.forEach(pkg => {
                pkg.isActive = false;
            });

            const start = new Date(startDate);

            const end = new Date(start);
            end.setUTCDate(end.getUTCDate() + durationDays);

            member.packages.push({
                packageName,
                durationDays,
                numberOfSessions,
                price,
                startDate: start,
                endDate: end,
                isActive: true,
                notes
            });

            await member.save();
            return res.json(member);
        }

        return res.status(400).json({
            error: 'Invalid action'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
// this.membersClient.updateMember(
//     id,
//     {
//         action: 'edit-member',
//         data: {
//             fullName: 'Rawan',
//             phone: '70123456'
//         }
//     },
//     token
// );
// this.membersClient.updateMember(
//     id,
//     {
//         action: 'edit-package',
//         data: {
//             packageId: selectedPackageId,
//             price: 150,
//             notes: 'Renewed with discount'
//         }
//     },
//     token
// );
//this.membersClient.updateMember(id,  {
//     action: 'add-package',
//     data: {
//       packageName: 'Gold',
//       durationDays: 30,
//       numberOfSessions: 12,
//       price: 100,
//       startDate: new Date()
//  } }, token);
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedMember = await Member.findOneAndDelete({
            _id: req.params.id,
            gymId: req.admin.gymId
        });

        if (!deletedMember) {
            return res.status(404).json({
                error: 'Member not found'
            });
        }

        res.json({
            message: 'Member deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;