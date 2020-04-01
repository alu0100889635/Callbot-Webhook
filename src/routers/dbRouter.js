const express = require("express");
const router = express.Router();
const dbController = require("../controllers/dbController");

/* router.get("/", phonecallController.showAll);
router.get("/:id", phonecallController.showPhonecall); */
router.post("/", dbController.postData);
/* router.delete("/:id", phonecallController.deletePhonecall);
router.put("/:id", phonecallController.updatePhonecall);
 */
module.exports = router;