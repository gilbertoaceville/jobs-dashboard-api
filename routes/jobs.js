const express = require("express");

const router = express.Router();
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
} = require("../controllers/jobs");
const restrictTestUser = require("../middleware/restrict-user");

router.route("/").post(createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router
  .route("/:id")
  .get(getJob)
  .delete(restrictTestUser, deleteJob)
  .patch(restrictTestUser, updateJob);

module.exports = router;
