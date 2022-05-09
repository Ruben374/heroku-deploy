const mongoose = require("mongoose");

const AppointmentsSchema = new mongoose.Schema(
  {
    client: {
      type: Object,
      require: true,
    },
    service: {
      type: Object,
      require: true,
    },
    est: {
      type: Object,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

const Appointments = mongoose.model("appointments", AppointmentsSchema);

module.exports = Appointments;
