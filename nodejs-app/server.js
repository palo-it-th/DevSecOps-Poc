const express = require("express");
const app = express();
const PORT = 8082;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = graphql;
const { graphqlHTTP } = require("express-graphql");
const { execSync } = require("child_process");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData;
      },
    },
    findUserById: {
      type: UserType,
      description: "fetch single user",
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData.find((a) => a.id == args.id);
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        });
        return args;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/rest/getAllUsers", (req, res) => {
  res.send(userData);
});

app.get("/profile", (req, res) => {
  const userName = req.query.name; // Unsanitized user input
  res.send(userName); // Vulnerable to XSS
});

// This is a vulnerable endpoint susceptible to command injection
app.get("/vulnerable-endpoint", (req, res) => {
  const userInput = req.query.command;

  // Vulnerable code - DO NOT use this in a production environment
  try {
    const result = execSync(userInput, { encoding: "utf-8" });
    res.send(result);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});


// New vulnerability: Input validation issue
app.post("/add-user", (req, res) => {
  const { id, firstName, lastName, email, password } = req.body;

  // No input validation
  userData.push({ id, firstName, lastName, email, password });
  res.send("User added successfully");
});

// New vulnerability: Insecure Direct Object Reference (IDOR)
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  // Directly accessing user data without authorization check
  const user = userData.find((user) => user.id == userId);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(PORT, () => {
  console.log("Server running");
});
