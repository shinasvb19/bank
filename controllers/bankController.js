const { log } = require("console");
const mongoose = require("mongoose");
const User = require("../models/bankSchema");
const Transaction = require("../models/transactionSchema");

module.exports.createAccount = async (req, res) => {
  const { name, dob, gender, panNo, address } = req.body;
  try {
    const user = new User({ name, dob, gender, panNo, address });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("error occured");
    console.log(error);
  }
};

module.exports.updateAccount = async (req, res) => {
  const { name, dob, gender, panNo, address, adhaarNo } = req.body;
  const { id } = req.params;
  console.log(id);
  if (!adhaarNo) {
    return res.status(404).json("adhaar number is required for kyc");
  }
  try {
    const updatedData = await User.findByIdAndUpdate(id, {
      name,
      dob,
      gender,
      panNo,
      address,
      adhaarNo,
      isVerified: true,
    });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.depositeMoney = async (req, res) => {
  const { id } = req.params;
  const depositeAmount = req.body.amount;
  try {
    const user = await User.findById(id);
    if (user?.isVerified) {
      const balance = user.initialBalance + depositeAmount;
      await User.findByIdAndUpdate(id, {
        initialBalance: balance,
      });
      res.status(200).json(`Successfully updated. Balance is ${balance}`);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.withdrawMoney = async (req, res) => {
  const { id } = req.params;
  const withdrawAmount = req.body.amount;
  try {
    const user = await User.findById(id);
    if (user?.isVerified) {
      if (user.initialBalance === 0 || user.initialBalance < withdrawAmount) {
        return res.status(400).json("insufficient funds");
      }
      const balance = user.initialBalance - withdrawAmount;
      const updatedBalance = await User.findByIdAndUpdate(id, {
        initialBalance: balance,
      });
      res.status(200).json(`Successfully updated. Balance is ${balance}`);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.transferMoney = async (req, res) => {
  const { senderId, recieverId } = req.params;
  const { transferAmount } = req.body;
  const sender = await User.findById(senderId);
  const recipient = await User.findById(recieverId);
  try {
    if (recipient?.isVerified && sender?.isVerified) {
      if (sender.initialBalance >= transferAmount) {
        const recieverBalance = recipient.initialBalance + transferAmount;
        const balance = sender.initialBalance - transferAmount;
        await User.findByIdAndUpdate(senderId, { initialBalance: balance });
        await User.findByIdAndUpdate(recieverId, {
          initialBalance: recieverBalance,
        });
        const transaction = new Transaction({
          senderId,
          recieverId,
          amount: transferAmount,
        });
        await transaction.save();
        res.status(200).json(`succesfully transferd to ${recipient.name}`);
      } else {
        res.status(400).json("insufficient balance");
      }
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json("internal server error");
    console.log(error);
  }
};

module.exports.printStatement = async (req, res) => {
  let { id } = req.params;
  log(id);
  id = new mongoose.Types.ObjectId(id);
  log(id);

  try {
    const statement = await Transaction.aggregate([
      {
        $match: { senderId: id },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recieverId",
          foreignField: "_id",
          as: "recieverDetails",
        },
      },
    ]);
    console.log(statement);
    res.status(200).json(statement);
  } catch (error) {
    console.log(error);
    res.status(500).json("error ");
  }
};
