// routes/organisationRoutes.js
const express = require("express");
const router = express.Router();
const organisationController = require("../Controllers/OrganisationController");

// Routes
router.post("/register", organisationController.registerOrganisation);
router.post("/login", organisationController.loginOrganisation);

router.get("/", organisationController.getOrganisations);
router.get("/:id", organisationController.getOrganisationById);

router.put("/:id", organisationController.updateOrganisation);
router.delete("/:id", organisationController.deleteOrganisation);

module.exports = router;
