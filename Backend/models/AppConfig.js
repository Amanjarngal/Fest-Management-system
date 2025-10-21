const mongoose = require("mongoose");
const AppConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model("AppConfig", AppConfigSchema);
