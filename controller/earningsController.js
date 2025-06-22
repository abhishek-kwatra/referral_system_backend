import db from '../models/db.js'

// GET /api/earnings/:user_id
export const earning =  async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT E.level, E.amount_earned, E.created_at, U.name AS from_user
       FROM Earnings E
       JOIN Users U ON E.referred_user_id = U.id
       WHERE E.user_id = ?`,
      [user_id]
    );

    const level1 = rows.filter(e => e.level === 1);
    const level2 = rows.filter(e => e.level === 2);
    const total = rows.reduce((sum, e) => sum + parseFloat(e.amount_earned), 0);

    res.json({
      user_id,
      total_earnings: total.toFixed(2),
      earnings: {
        level_1: level1,
        level_2: level2
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings.' });
  }
};


