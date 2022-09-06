import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import ProductRoute from './routes/ProductRoute.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static("public")) //public images on http url
app.use(ProductRoute)


app.listen(5000,()=> console.log('Server is running at port 5000'))