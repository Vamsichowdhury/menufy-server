const express = require("express")
const connectDb = require("./config/dbConnection")
const errorHandler = require("./middleware/errorHandler")
const cors = require('cors');

const dotenv = require("dotenv").config()

connectDb()

const app = express()

// Enable CORS for all routes
app.use(cors());

const port = process.env.PORT || 5000
// console.log(app)
app.use(express.json())

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use("/api/contacts", require("./routes/contactRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

app.use("/api/categories", require("./routes/categoryRoutes"))

app.use("/api/admin", require("./routes/adminAuthRoutes"))

app.use("/api/admin/categories", require("./routes/adminRoutes"))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})


