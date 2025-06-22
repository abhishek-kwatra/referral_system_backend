import db from '../models/db.js'
export const referral =  async (req, res) => {
  const userId = req.params.id;

  try {
    const [level1] = await db.query(
      'SELECT id, name FROM Users WHERE referred_by = ?',
      [userId]
    );

    const level1Ids = level1.map(u => u.id);
    let level2 = [];

    if (level1Ids.length > 0) {
      const [result] = await db.query(
        `SELECT id, name FROM Users WHERE referred_by IN (${level1Ids.map(() => '?').join(',')})`,
        level1Ids
      );
      level2 = result;
    }

    res.json({
      user_id: userId,
      level_1_referrals: level1,
      level_2_referrals: level2
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
