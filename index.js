const express = require('express');
const cors = require('cors');
require('./config/db');
require('dotenv').config()
const User = require('./config/User')
const Product=require("./config/Product")
const app = express();
const port=process.env.PORT


app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    let user = new User(req.body)
    let result = await user.save();
    result=result.toObject();
    delete result.password
    res.send(result)
})
app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            res.send(user)
        }else{
            res.send({ result: "No user found" })
        }
    } else {
        res.send({ result: "No user found" })
    }

})
app.post ("/add-product",async(req,res)=>{
  let product=new Product(req.body);
  let result=await product.save();
  res.send(result)
})
app.get("/products",async(req,res)=>{
    
   let products= await  Product.find();
   if(products.length>0){
    res.send(products)
   }else{
    res.send({result:"No products found"})
   }

})
app.delete("/product/:id", async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
}),

app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            {
                name: { $regex: req.params.key }  
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    resp.send(result);
})
app.get("/profile/:id", async (req, res) => {
    let user = await User.findOne({ _id: req.params.id }).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No user found" });
    }
  });

app.listen(port, () => {
    console.log("server started at port 5000");
})