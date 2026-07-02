const router = require('express').Router();
const { Setting } = require('../models');

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
