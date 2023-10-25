require("dotenv").config();
const crypto = require("crypto");
const data = require("../../models/employee_model");
const randomstring = require("randomstring");
const key = process.env.key;
const iv = process.env.iv;

module.exports.sign_up = async (req, res) => {
  const { confirm_password, password, department, role } = req.body;

  if (!password === confirm_password) {
    return res.send({ msg: "password not matched with confirm password" });
  }

  function encrypt(text) {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      Buffer.from(iv)
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  const encryptedpassword = encrypt(password);


  if (department && department[0].role === "Agent") {
    if (role === "Admin" || role === "SuperAdmin") {
      const savedata = new data({
        employee_id: randomstring.generate(10),
        agent_id:req.body.agent_id,
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        joining_date:req.body.date,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

      const agent_id = await data.findOne({ agent_id: savedata.agent_id });

      if (agent_id) {
        return res.status(500).json({ message: "agent_id already exists" });
      }

      const username = await data.findOne({ userName: savedata.userName });

      if (username) {
        return res.status(500).json({ message: "User name already exists" });
      }

      await savedata.save();
      return res
        .status(200)
        .json({ savedata, token: "employee added successfully" });
    }else{
      return res.status(500).json({ message: "You do not have permission to add Agent." });
    }
  }

  if (department && department[0].role === "Admin") {
    if (role === "SuperAdmin") {
      const savedata = new data({
        employee_id: randomstring.generate(10),
        agent_id:req.body.agent_id,
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        joining_date:req.body.date,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

      const agent_id = await data.findOne({ agent_id: savedata.agent_id });

      if (agent_id) {
        return res.status(500).json({ message: "agent_id already exists" });
      }

      const username = await data.findOne({ userName: savedata.userName });

      if (username) {
        return res.status(500).json({ message: "User name already exists" });
      }

      await savedata.save();
      return res
        .status(200)
        .json({ savedata, token: "employee added successfully" });
    }else{
      return res.status(500).json({ message: "You do not have permission to add Admin." });
    }
  }

  if (department && department[0].role === "SuperAdmin") {
    if (role === "SuperAdmin") {
      const savedata = new data({
        employee_id: randomstring.generate(10),
        agent_id:req.body.agent_id,
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        joining_date:req.body.date,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

      const agent_id = await data.findOne({ agent_id: savedata.agent_id });

      if (agent_id) {
        return res.status(500).json({ message: "agent_id already exists" });
      }
      
      const username = await data.findOne({ userName: savedata.userName });

      if (username) {
        return res.status(500).json({ message: "User name already exists" });
      }

      await savedata.save();
      return res
        .status(200)
        .json({ savedata, token: "employee added successfully" });
    }else{
      return res.status(403).json({ message: "You do not have permission to add SuperAdmin." });
    }
  }
};




module.exports.login = async (req, res) => {
  const { password, userName } = req.body;

  const userfound = await data.findOne({ userName: userName });
  console.log(userfound);

  if (!userfound) {
    return res.status(500).json({ msg: "user not found" });
  } else {
    const details = userfound;
    if (userName === "SuperAdmin" && password === "SuperAdmin") {
      return res.json({ details, token: "login successfully " });
    } else {
      function decryptPassword(encryptedText) {
        const decipher = crypto.createDecipheriv(
          "aes-256-cbc",
          Buffer.from(key, "hex"),
          Buffer.from(iv)
        );
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
      }

      const decryptedPassword = decryptPassword(userfound.password);

      if (decryptedPassword !== password) {
        return res.status(500).json({ msg: "enter valid password" });
      }

      employee_id = userfound.employee_id
      const details = {
        userName: userfound.userName,
        gender: userfound.gender,
        employee_id: employee_id,
        phone_number: userfound.phone_number,
        first_name: userfound.first_name,
        last_name: userfound.last_name,
        department: userfound.department,
       
      };

      const loginTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

      await data.updateOne(
        { userName: userName },
        {
          $push: {
            log_in_time: {
              $each: [loginTime],
              $position: 0,
            },
          },
        }
      ); 
      return res.status(200).json({ details, token: "login successfully" });
      
    }
  }
};


// delete employee 

module.exports.delete_employee = async(req,res)=>{
  const delete_employee = await data.deleteOne({employee_id:req.query.employee_id})

  return res.status(200).json({token :"data deleted successfully"})
}

//edit employee


module.exports.update_employee = async (req, res) => {
 
      try {
        const employee_id = req.body.employee_id; // Assuming the employee ID is in the route parameters
    
        // Find the existing employee by their ID
        const existingEmployee = await data.findOne({ employee_id });
    
        if (!existingEmployee) {
          return res.status(404).json({ msg: 'Employee not found' });
        }
    
        // Define an empty object for the new data
        const newData = {};
    
        // Check each field in the request and add it to the new data if it has changed
        if (req.body.userName !== undefined) {
          newData.userName = req.body.userName;
        }
        if (req.body.agent_id !== undefined) {
          newData.agent_id = req.body.agent_id;
        }
        if (req.body.first_name !== undefined) {
          newData.first_name = req.body.first_name;
        }
        if (req.body.last_name !== undefined) {
          newData.last_name = req.body.last_name;
        }
        if (req.body.joining_date !== undefined) {
          newData.joining_date = req.body.joining_date;
        }
        if (req.body.gender !== undefined) {
          newData.gender = req.body.gender;
        }
        if (req.body.status !== undefined) {
          newData.status = req.body.status;
        }
        if (req.body.department !== undefined) {
          newData.department = req.body.department;
        }
        if (req.body.mobile_number !== undefined) {
          newData.mobile_number = req.body.mobile_number;
        }
        if (req.body.email !== undefined) {
          newData.email = req.body.email;
        }
        if (req.body.designation !== undefined) {
          newData.designation = req.body.designation;
        }
        // Add more fields as needed
    
        // Use findOneAndUpdate to update the existing employee's data
        const updatedEmployee = await data.findOneAndUpdate(
          { employee_id },
          { $set: newData },
          { new: true } // This option returns the updated document
        );
    
        if (updatedEmployee) {
          return res.status(200).json({ msg: 'Employee data updated successfully', employee: updatedEmployee });
        } else {
          return res.status(500).json({ msg: 'Failed to update employee data' });
        }
      }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      } 
}
  




 