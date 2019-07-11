import mongoose, { Schema } from "mongoose";

class CustomerSchema extends Schema {
  constructor() {
    const user = super(
      {
        name: {type: String},
        custId : {type: String},
        emailId: { type: String, unique: true },
        password: {type: String},
        mobile: { type: Number, unique: true },
        address: String
      },
      { timestamps: { createdAt: "created_at" } }
    );

    return user;
  }
}
export default mongoose.model("customer", new CustomerSchema()); // eslint-disable-line
//some changes