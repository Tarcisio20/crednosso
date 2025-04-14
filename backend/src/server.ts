import express, { urlencoded } from "express"
import cors from "cors"
import helmet from "helmet"
import { mainRouter } from "./routers/main"

const server = express()

server.use(helmet())
server.use(cors())
server.use(urlencoded({ extended : true }))
server.use(express.json())

server.use(mainRouter)

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server run in ${process.env.BASE_URL} port ${process.env.PORT }`)
})