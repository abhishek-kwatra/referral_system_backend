import db from '../models/db.js';

export const purchases = async (req, res) => {
  const { user_id, amount } = req.body;
  const io = req.io;                      
  const userSockets = req.userSockets;    

  try {
    if (amount <= 1000) {
      return res.status(400).json({ message: 'No earnings is possible for purchases ≤ ₹1000' });
    }

    const [[fromUser]] = await db.query(
      'SELECT name FROM Users WHERE id = ?',
      [user_id]
    );
    const fromUserName = fromUser?.name || `User ${user_id}`;

    await db.beginTransaction();

    const [purchaseResult] = await db.query(
      'INSERT INTO Purchases (user_id, amount) VALUES (?, ?)',
      [user_id, amount]
    );
    const purchaseId = purchaseResult.insertId;

    const [[userRow]] = await db.query(
      'SELECT referred_by FROM Users WHERE id = ?',
      [user_id]
    );
    const level1Id = userRow?.referred_by;

    if (level1Id) {
      const [[level1User]] = await db.query(
        'SELECT is_active, referred_by FROM Users WHERE id = ?',
        [level1Id]
      );

      if (level1User?.is_active) {
        const level1Earning = (amount * 0.05).toFixed(2);
        await db.query(
          `INSERT INTO Earnings (user_id, referred_user_id, level, purchase_id, amount_earned)
           VALUES (?, ?, ?, ?, ?)`,
          [level1Id, user_id, 1, purchaseId, level1Earning]
        );

        const socketId = userSockets.get(level1Id);
        if (socketId) {
          io.to(socketId).emit('new_earning', {
            from_user: fromUserName,
            amount: level1Earning,
            level: 1
          });
        }

        const level2Id = level1User.referred_by;
        if (level2Id) {
          const [[level2User]] = await db.query(
            'SELECT is_active FROM Users WHERE id = ?',
            [level2Id]
          );

          if (level2User?.is_active) {
            const level2Earning = (amount * 0.01).toFixed(2);
            await db.query(
              `INSERT INTO Earnings (user_id, referred_user_id, level, purchase_id, amount_earned)
               VALUES (?, ?, ?, ?, ?)`,
              [level2Id, user_id, 2, purchaseId, level2Earning]
            );

            const socketId2 = userSockets.get(level2Id);
            if (socketId2) {
              io.to(socketId2).emit('new_earning', {
                from_user: fromUserName,
                amount: level2Earning,
                level: 2
              });
            }
          }
        }
      }
    }

    res.json({ message: 'Purchase recorded and earnings distributed.' });

  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
