const express = require("express");
const Reporters = require("../models/reporters2");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/reporters", auth, (req, res) => {
  Reporters.find({})
    .then((reporters) => {
      res.status(200).send(reporters);
    })
    .catch((e) => {
      res.status(500).send("Internal server error");
    });
});

router.post("/reporters", async (req, res) => {
  const reporters = new Reporters(req.body);

  try {
    await reporters.save();
    const token = await reporters.generateToken();
    res.status(200).send({ reporters, token });
  } catch (e) {
    res.status(400).send("unable");
  }
});

router.post("/reporters/login", async (req, res) => {
  try {
    const reporters = await Reporters.findByCredentials(
      req.body.email,
      req.body.password
    );
    await reporters.save();

    const token = await reporters.generateToken();
    res.status(200).send({ reporters, token });
  } catch (e) {
    res.status(400).send("Wrong Credentials");
  }
});

router.get("/profile", auth, async (req, res) => {
  res.send(req.reporters);
});

router.delete("/profile", auth, async (req, res) => {
  try {
    await req.reporters.remove();
    res.send("Profile Deleted");
  } catch (e) {
    res.send(e);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.reporters.tokens = req.reporters.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.reporters.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send("You have to be logged in");
  }
});

router.patch("/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);

  try {
    updates.forEach((updates) => (req.reporters[update] = req.body[update]));
    await req.reporters.save();
    res.status(200).send(req.reporters);
  } catch (e) {
    res.status(400).send("Error");
  }
});
