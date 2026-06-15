const express = require("express");
const router = express.Router();
const disciplinaController = require("../controllers/disciplinaController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, disciplinaController.create);
router.get("/", authMiddleware, disciplinaController.list);
router.get("/search", authMiddleware, disciplinaController.search);
router.get("/:id", authMiddleware, disciplinaController.getById);
router.put("/:id", authMiddleware, disciplinaController.update);
router.delete("/:id", authMiddleware, disciplinaController.delete);

module.exports = router;
