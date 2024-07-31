const express = require("express");
const router = express.Router();

const sdk = require("api")("@fsq-developer/v1.0#78iknmrc2aljgfbp90");
sdk.auth(process.env.SDK_AUTH_GYM_KEY);
router.get("/:latitude/:longitude", async (req, res) => {
  const { latitude, longitude } = req.params;

  const data = sdk
    .placesNearby({
      ll: `${latitude},${longitude}`,
      query: "gym",
      radius: 10000,
    })
    .then(({ data }) => {
      console.log(data?.results);
      res.json(data?.results);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching gym data." });
    });
});

module.exports = router;
