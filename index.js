const express=require("express");
const users=require("./MOCK_DATA.json")
const app=express();
const fs=require("fs");
const port=8000;

app.use(express.urlencoded({extended:false}));
// converts from data coming from client to json format

app.listen(port,()=>console.log(`Server started at PORT ${port}`));

app.use((req,res,next)=>{
  fs.appendFile(
    "log.txt",
    `${new Date().toISOString()} ${req.ip} - ${req.method} - ${req.url}\n`,
    (err,data)=>{
      next();
    }
  );
})

app.get("/api/users",(req,res)=>{
    return res.json(users);
});

app.get("/users",(req,res)=>{
    const html=`
    <ul>
      ${users.map(user=>`<li>${user.last_name.toUpperCase()} ${user.first_name.toUpperCase()} ${user.email} Gender:${user.gender}</li>`) .join(" ")}
    </ul>
    `
    res.send(html);
});


// : before the name shows dynamic route parameter 
app.get("/users/:id",(req,res)=>{
  const id=(req.params.id);
  const user=users.find((user)=>user.id==id);
  if(user){
    return res.json(user);
  }
  else{
    return res.status(404).json({message:"User not found"});
  }
  });

  app.delete("/api/users/:id",(req,res)=>{
  const id=(req.params.id);
  if(users.find((user)=>user.id == id)){
    users.splice(id,1);
    
  }
  else{
    return res.status(404).json({message:"User not found"});
  }
});

app.post("/api/users",(req,res)=>{
  const body=req.body;
  console.log(body);
  users.push({...body,id: users.length});
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
    return res.json({status:"pending..."});
  });
});

app.patch("/api/users/:id",(req,res)=>{
  const name=req.body.first_name;
  const lname=req.body.last_name;
  const email=req.body.email;
  const gen=req.body.gender;
  const jt=req.body.job_title;
  const id=(req.params.id);
  const user=users.find((user)=>user.id == id);
  if(user){
    user.first_name=name;
    user.last_name=lname;
    user.email=email;
    user.job_title=jt;
    user.gender=gen;
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
      return res.json({message:"User updated successfully"});
    });
    
  }
  else{
    return res.status(404).json({message:"User not found"});
  }
});
  

  