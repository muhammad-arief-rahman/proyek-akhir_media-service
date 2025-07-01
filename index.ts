import express from "express"
import multer from "multer"
import cookieParser from "cookie-parser"
import router from "./src/routes"
import { response } from "@ariefrahman39/shared-utils"

const app = express()
const port = process.env.PORT || 5200

app.use(express.json({ limit: "50mb" }))
app.use(multer().any())
app.use(cookieParser())

app.use("/", router)

app.use((req, res) => {
  response(res, 404, "Not Found")
})

app.listen(port, () => {
  console.log(`Media-Service is running on port ${port}`)
})
