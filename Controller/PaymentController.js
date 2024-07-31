const AppError = require("../Error-Handling/error");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razor_pay_id = process.env.RAZOR_PAY_KEY_ID;
const razor_secret_key = process.env.RAZOR_PAY_SECRET_KEY;
const createPayment = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_8ryBijpHhTbHDx",
      key_secret: "pAMjrpMI366I5O7yqAhtFz9V",
    });

    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

const verifypayment = (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "pAMjrpMI366I5O7yqAhtFz9V")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};
module.exports = {
  createPayment,
  verifypayment,
};
