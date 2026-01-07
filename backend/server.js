const app = require('./src/app')



app.get('/',(req, res)=>{
    res.send('Hello World!')
})

app.listen(3000, ()=>{
    console.log("Server is running on port http://localhost:3000")
})