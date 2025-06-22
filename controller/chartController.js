import db from '../models/db.js'
export const chart =  async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const [levelSummary] = await db.query(
      `SELECT level, SUM(amount_earned) AS total
       FROM Earnings
       WHERE user_id = ?
       GROUP BY level`,
      [user_id]
    );

    const [sources] = await db.query(
      `SELECT U.name AS user_name, E.amount_earned, E.level
       FROM Earnings E
       JOIN Users U ON E.referred_user_id = U.id
       WHERE E.user_id = ?
       ORDER BY E.amount_earned DESC`,
      [user_id]
    );

    const level_distribution = {
      level_1: 0,
      level_2: 0
    };
    levelSummary.forEach(row => {
      level_distribution[`level_${row.level}`] = parseFloat(row.total);
    });

    res.json({ level_distribution, sources });

  } catch (err) {
    res.status(500).json({ message: 'Chart data fetch failed.' });
  }
};
