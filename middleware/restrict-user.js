const { BadRequestError } = require("../errors");

// only established for authenticated routes
const restrictTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Test User. Read Only!");
  next();
};

module.exports = restrictTestUser;
