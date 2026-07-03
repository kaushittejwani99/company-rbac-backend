import mongoose from "mongoose";

const employerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Employer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Employer email is required"],
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
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: 80
    },
    permissions: {
      type: [
        {
          type: String,
          enum: ["manage_employers", "manage_employees", "view_dashboard"]
        }
      ],
      default: ["view_dashboard"]
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
    hiredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

employerSchema.index({ company: 1, email: 1 }, { unique: true });

const Employer = mongoose.model("Employer", employerSchema);

export default Employer;
