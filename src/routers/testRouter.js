const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

/* router.get("/", phonecallController.showAll);
router.get("/:id", phonecallController.showPhonecall); */
router.post("/", testController.postTest);
router.post("/addData", testController.postData);
/* router.delete("/:id", phonecallController.deletePhonecall);
router.put("/:id", phonecallController.updatePhonecall);
 */
module.exports = router;
