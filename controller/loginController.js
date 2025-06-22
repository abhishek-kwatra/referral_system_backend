import db from '../models/db.js';

// Generate a referral code 
function generateReferralCode(name) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return name.substring(0, 4).toUpperCase() + random;
}

// POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, referral_code } = req.body;

  try {
    let referred_by_id = null;

    if (referral_code) {
      const [refUser] = await db.query(
        'SELECT id, direct_referrals_limit FROM Users WHERE referral_code = ? LIMIT 1',
        [referral_code]
      );

      if (refUser.length === 0) {
        return res.status(400).json({ message: 'Referral code not found.' });
      }

      referred_by_id = refUser[0].id;

      if (refUser[0].direct_referrals_limit <= 0) {
        return res.status(400).json({ message: 'Referral limit exceeded (max 8).' });
      }
    }

    let newReferralCode;
    let isUnique = false;

    while (!isUnique) {
      newReferralCode = generateReferralCode(name);
      const [check] = await db.query('SELECT 1 FROM Users WHERE referral_code = ?', [newReferralCode]);
      if (check.length === 0) isUnique = true;
    }

    const [result] = await db.query(
      'INSERT INTO Users (name, email, referral_code, referred_by) VALUES (?, ?, ?, ?)',
      [name, email, newReferralCode, referred_by_id]
    );

    const newUserId = result.insertId;

    if (referred_by_id) {
      await db.query(
        'UPDATE Users SET direct_referrals_limit = direct_referrals_limit - 1 WHERE id = ?',
        [referred_by_id]
      );
    }

    res.json({
      message: 'User registered successfully.',
      user_id: newUserId,
      referral_code: newReferralCode
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
