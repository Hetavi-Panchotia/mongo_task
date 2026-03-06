const express= require("express");
const mongoose =require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mongotask")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection failed", error));


const userSchema = new mongoose.Schema({
 name:{
  type:String,
  required:true,
  minlegnth:3
 },
 email:{
  type:String,
  required:true,
  lowercase:true,
  unique:true
 },
 password:{
  type:String,
  required:true,
  minlegnth:6
 }
},
{
  versionKey : false
});

const User = mongoose.model("User", userSchema);



app.post("/users/addone", async (req,res)=>{
    try{
        const createUser= await User.create(req.body);
        res.status(201).json(createUser)
    }
    catch{
         res.status(400).json({ message: err.message });
    }
})



app.post("/users/addmany", async (req, res) => {
  try {
    const users = await User.insertMany(req.body); 
    res.status(201).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.put("/users/:id", async (req, res) => {
  try {
     const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.patch("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})