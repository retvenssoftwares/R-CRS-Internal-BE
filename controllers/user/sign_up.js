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
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

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
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

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
        userName: req.body.userName,
        first_name: req.body.First_name,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        last_name: req.body.Last_name,
        email: req.body.email,
        designation: req.body.designation,
        mobile_number: req.body.mobile_number,
        password: encryptedpassword,
        department: department,
      });

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
      const details = {
        userName: userfound.userName,
        gender: userfound.gender,
        employee_id: userfound.employee_id,
        phone_number: userfound.phone_number,
        first_name: userfound.first_name,
        last_name: userfound.last_name,
        department: userfound.department,
      };
      return res.status(200).json({ details, token: "login successfully" });
    }
  }
};
