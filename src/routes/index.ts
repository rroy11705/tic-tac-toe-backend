import * as express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Hello Boy!!");
});

router.get("/favicon.ico", (req, res) => res.status(204));

module.exports = router;
