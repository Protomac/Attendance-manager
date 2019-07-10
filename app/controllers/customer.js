import { secret, errorObj, successObj } from "../../config/settings";
import customer from "../models/customerModel";
const console = require("tracer").colorConsole();

const custCtrl = {
  msgg: "hello",
  add: data => {
    return new Promise(resolve => {
      let newUser = new customer({
        name: data.name,
        emailId: data.emailId,
        password: data.password,
        address: data.address,
        contactNo: data.contactNo
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  },
  list: () => {
    customer.find({}).exec(function(err, users) {
      if (err) throw err;
      console.log(users);
    });
  }
};


// custCtrl.add({
//   name: "Customer",
//   emailId: "customer@gmail.com",
//   address: "G-3/36 Sector-7 Rohini Delhi-89",
//   contactNo: 1232067891
// });


// custCtrl.list();

export default custCtrl;
