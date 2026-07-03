import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"]
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: 80
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: 80
    },
    salary: {
      type: Number,
      min: 0,
      default: 0
    },
    image: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

employeeSchema.index({ company: 1, email: 1 }, { unique: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
