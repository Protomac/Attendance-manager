import { isLoggedIn } from "./controllers/_utils";
import custCtrl from "./controllers/customer";
import custSchema from "../app/models/customer";
const bcrypt = require('bcrypt');
import TicketCtrl from "./controllers/ticket";


export default (app, passport) => {
  app.get("/", (req, res) => {
    res.locals = {
      title: "Ayurveda",
      message: "Account"
    };
    res.render("index.ejs", { title: res.locals.title });
  });

  app.get("/profile", isLoggedIn, (req, res) =>
    res.render("profile.ejs", { user: req.user })
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app
    .route("/login")
    .get((req, res) =>
      res.render("login.ejs", {
        message: req.flash("loginMessage"),
        title: "Login Page"
      })
    )
    .post(
      passport.authenticate("local-login", {
        successRedirect: "/profile", // redirect to the secure profile section
        failureRedirect: "/login", // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );

  app
    .route("/signup")
    .get((req, res) => {
      console.log(res);
      res.render("signup.ejs", {
        message: req.flash("signupMessage"),
        title: "Sign Up"
      });
    })
    .post(
      passport.authenticate("local-signup", {
        successRedirect: "/profile", // redirect to the secure profile section
        failureRedirect: "/signup", // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );

  app
    .route("/customer-register")
    .get((req, res) => {
      res.render("test.ejs")
    })
    .post(async (req, res) => {
      //check if id exist in database if yes => Show already exist
      if (
        await custSchema.findOne({ emailId: req.body.emailId })
        ||
        await custSchema.findOne({ contactNo: req.body.contactNo })
      ) {
        res.send("customer already present")
        return;
      }
      custCtrl.add(req.body);
      res.send('customer created')
    })

  app
    .route("/customer/:id/profile")
    .get(async (req, res) => {
      //get data from custCtrl profile
      let { error, message, entity: entityInfo } = await custCtrl.profileInfo(req.params.id)
      if (error == true) {
        res.send(message + '\n' + entityInfo)
        return;
      }
      res.send(message + '\n' + entityInfo)
    })

  app
    .route("/cust/:id/create")
    .post(async (req, res) => {
      const addedTicket = await TicketCtrl.addTickets({ custId: req.params.id, ...req.body });
      res.json(addedTicket);
    }
    );

  app
    .route("/cust/:id/tickets")
    .get(async (req, res) => {
      const tickets = await TicketCtrl.listTickets({ custId: req.params.id });
      res.send(tickets)
    }
    );

  app
    .route("/cust/:id/active")
    .get(async (req, res) => {
      const activeTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "A" })
      res.send(activeTickets);
    })

  app
    .route("/cust/:id/closed")
    .get(async (req, res) => {
      const closedTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "C" })
      res.send(closedTickets);
    })

  app
    .route("/cust/:id/ticket/:_id")
    .get(async (req, res) => {
      const ticketDetails = await TicketCtrl.listTickets({ custId: req.params.id, _id: req.params._id })
      res.send(ticketDetails);
    })

  app
    .route("/cust/:id/dashboard")
    .get(async (req, res) => {
      const ticketDetails = await TicketCtrl.dashboard({ custId: req.params.id })
      const closedTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "C" })
      const activeTickets = await TicketCtrl.listTickets({ custId: req.params.id, status: "A" })
      const totalTickets = await TicketCtrl.listTickets({ custId: req.params.id });

      const ticketLength = {
        closed: closedTickets.ticket.length,
        active: activeTickets.ticket.length,
        total: totalTickets.ticket.length
      }
      res.send({ ...ticketLength, ticketDetails });
    })
};
