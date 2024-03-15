const User = require('../models/userModel')
const UserRole = require('../models/userRole')
const Business = require('../models/businessModel')
const BusinessBadge = require('../models/businessBadges')
const Badge = require('../models/expertBadgeModel')
const Expert = require('../models/brokerModel')
const Category = require('../models/categoryModel')
const CustomerSupport = require('../models/customerSupport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const sendEmail = require("../config/emailConfigs/emailTemplate")
const { ErrorResponse, SuccessResponse } = require('../helpers/responseService')






const login = async (req, res) => {
  const { email, password } = req.body
  try {
    console.log(req.body)



    if (!email) {
      return ErrorResponse(res, 'Email is Required!');

    }
    let userExists = await User.findOne({ email });
    if (userExists == null || userExists.length < 1) {
      return ErrorResponse(res, 'No User Found  !');
    }


    if (!userExists.password || userExists.password == "") {
      return ErrorResponse(res, 'You are loggedin via social network , try to login there , or try forget password ');
    }


    const match = await bcrypt.compare(password, userExists.password);
    if (!match) {
      return ErrorResponse(res, 'Invalid Password!');
    }

    const checkRole = await UserRole.findById(userExists.role)
    if (checkRole && checkRole.title.toUpperCase() !== "ADMIN") {
      return ErrorResponse(res, "This user have no admin access !")
    }



    const { registerationOTP, password: userPassword, salt, role, fcm_token, paidBadges, buyerBadges, businesses, businesses_wishlist, recentlyViewed_Business, ...user } = userExists.toObject()

    const token = await genJwtToken(userExists._id)


    return SuccessResponse(res, { token, user })

  } catch (error) {
    console.error(error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
}






const verify2faOtp = async (req, res) => {
  const { id, OTPCODE } = req.body
  console.log(req.body)
  try {

    if (id == undefined || id == '') {
      return ErrorResponse(res, "ID Field Is Required  !")

    }
    if (OTPCODE == undefined || OTPCODE == "") {
      return ErrorResponse(res, "OTPCODE Is Required  !")

    }

    const checkUser = await User.findById(id)
    if (checkUser == undefined || checkUser == null) {
      return ErrorResponse(res, "User Not Matched  !")

    }


    if (id == undefined || id == '') {
      return ErrorResponse(res, "ID Field Is Required  !")

    }
    if (OTPCODE == undefined || OTPCODE == "") {
      return ErrorResponse(res, "OTPCODE Is Required  !")

    }



    if (Number(checkUser.forgetPasswordOTP) !== Number(OTPCODE)) {
      return ErrorResponse(res, "Invalid OTP Code  !")
    }


    const resetPasswordToken = await genJwtForgetPasswordToken(checkUser._id)
    checkUser.resetPasswordToken = resetPasswordToken
    await checkUser.save()

    return SuccessResponse(res, { resetPasswordToken })

  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}





const verifyForgetPasswordUser = async function (req, res) {
  try {
    if (req.params.email == undefined || req.params.email == '') {
      return ErrorResponse(res, "Email Is Required  !")

    }
    let userExists = await User.findOne({ email: req.params.email })
    if (!userExists) {
      return ErrorResponse(res, "No User Exists  !")
    }

    const checkRole = await UserRole.findById(userExists.role)
    if (checkRole && checkRole.title.toUpperCase() !== "ADMIN") {
      return ErrorResponse(res, "This user have no admin access !")
    }


    let OTPCODE = Math.floor(100000 + Math.random() * 900000);

    userExists.forgetPasswordOTP = OTPCODE
    const otp_generatedAt = new Date(Date.now())
    userExists.resetPasswordGeneratedAt = otp_generatedAt
    const otp_expiresAt = new Date(Date.now() + 190000)
    userExists.resetPasswordExpires = otp_expiresAt
    await userExists.save()


    const { registerationOTP, password: userPassword, salt, role, fcm_token, paidBadges, buyerBadges, businesses, businesses_wishlist, recentlyViewed_Business, forgetPasswordOTP, resetPasswordExpires, resetPasswordGeneratedAt, resetPasswordToken, ...user } = userExists.toObject()




    if (userExists.email) {
      const content = `
      <div>
        <p>Hello <strong>${userExists.fullName}</strong>,</p>
        <p style="color : green;">Your OTP for reset password  is  <strong>${OTPCODE}</strong>.</p>
        <p>Warm regards,</p>
        <p>The Team at <strong>Bizpay</strong></p>
      </div>
  `;
      await sendEmail(userExists.email, "", "Reset Password ", content)

    }

    return SuccessResponse(res, { user: user, msg: "A new OTP has been sent to your account  !" })



  } catch (error) {
    console.log(error)
    return ErrorResponse(res, "Internal server erorr !")
  }
}



const forgetPasswordUserOtpValidation = async (req, res) => {
  console.log(req.body)
  const { id, OTPCODE } = req.body
  try {

    if (id == undefined || id == '') {
      return ErrorResponse(res, "ID Field Is Required  !")

    }
    if (OTPCODE == undefined || OTPCODE == "") {
      return ErrorResponse(res, "OTPCODE Is Required  !")

    }

    const checkUser = await User.findById(id)
    if (checkUser == undefined || checkUser == null) {
      return ErrorResponse(res, "User Not Matched  !")

    }


    if (checkUser.forgetPasswordOTP !== OTPCODE || OTPCODE.length !== 4) {
      return ErrorResponse(res, "Invalid OTP Code  !")
    }
    const resetPasswordToken = await genJwtForgetPasswordToken(checkUser._id)
    checkUser.resetPasswordToken = resetPasswordToken
    await checkUser.save()

    return SuccessResponse(res, { resetPasswordToken })

  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}



const changePassword = async (req, res) => {
  const { reset_password_token, newPassword } = req.body
  try {

    if (reset_password_token == undefined || reset_password_token == '') {
      return ErrorResponse(res, "Reset Password Token  Is Required  !")

    }
    if (newPassword == undefined || newPassword == "") {
      return ErrorResponse(res, "Password  Is Required  !")

    }


    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(req.body.newPassword)) {
      return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
    }


    const userExists = jwt.verify(reset_password_token, process.env.JWT_SECRET_KEY)
    const user = await User.findOne({ _id: userExists.id, resetPasswordToken: reset_password_token })


    if (user == undefined || user == null) {
      return ErrorResponse(res, "User Not Matched  !")

    }

    if (user.password && user.password !== "") {
      const compareOldPasswordTONew = await bcrypt.compare(newPassword, user.password)
      if (compareOldPasswordTONew) {
        return ErrorResponse(res, "Your Already have used this password recently , try new one !")
      }
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(newPassword, salt);
    user.salt = salt
    user.password = hash
    user.forgetPasswordOTP = undefined
    user.resetPasswordGeneratedAt = undefined
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()



    const token = await genJwtToken(user._id)



    const { registerationOTP, password: userPassword, salt: sallt, role, fcm_token, paidBadges, buyerBadges, businesses, businesses_wishlist, recentlyViewed_Business, forgetPasswordOTP, resetPasswordExpires, resetPasswordGeneratedAt, resetPasswordToken, ...rest } = user.toObject()



    return SuccessResponse(res, { token, user: rest })



  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}






const dashboardCards = async (req, res) => {

  try {
    const totalBusinesses = await Business.countDocuments();
    const totalExperts = await Expert.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    const allBusiness = await Business.find().populate("industry")

    const reducedBusinesses = allBusiness.reduce((acc, item) => {
      const categoryTitle = item.industry.title
      if (!acc[categoryTitle]) acc[categoryTitle] = 0
      acc[categoryTitle] += 1
      return acc
    }, {})





    const graphData = Object.entries(reducedBusinesses).map(([key, value]) => {
      return { title: key, count: value };
    });








    console.log({ totalBusinesses })
    return SuccessResponse(res, { totalBusinesses, totalExperts, totalUsers, totalCategories, graphData })

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}


//users
const getAllUsers = async (req, res) => {

  try {
    const searchquery = req.query.search
    const filter = {}
    if (searchquery && searchquery !== "") {
      filter.fullName = new RegExp(searchquery, "i")
    }
    console.log({ filter })
    const users = await User.find(filter).select("-password -salt -registerationOTP  -businesses   -paidBadges -role -recentlyViewed_Business -businesses_wishlist -fcm_token")
      .populate({ path: "buyerBadges", select: "title icon" })
    return SuccessResponse(res, users)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}





const getUserDetails = async (req, res) => {

  try {
    const { userId } = req.params
    const user = await User.findById(userId).select("-password -salt -registerationOTP -paidBadges -recentlyViewed_Business -businesses_wishlist -fcm_token")
      .populate({ path: "buyerBadges", select: "title icon" })
      .populate({ path: "businesses" , select: "name images" })
      .populate({ path: "role" })

      
    return SuccessResponse(res, user)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}







const getAllExperts = async (req, res) => {

  try {
    const searchquery = req.query.search
    const filter = {}
    if (searchquery && searchquery !== "") {
      filter.fullName = new RegExp(searchquery, "i")
    }
    console.log({ filter })

    const experts = await Expert.find(filter).select("-subscription  -badgeRequests")
      .populate({ path: "industries_served", select: "title" })
      .populate({ path: "badges", select: "title icon" })
    return SuccessResponse(res, experts)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}


const getExpertDetails = async (req, res) => {

  try {
    const { expertId } = req.params
    const expert = await Expert.findById(expertId)
      .populate({ path: "industries_served", select: "title" })
      .populate({ path: "badges", select: "title icon" })


    return SuccessResponse(res, expert)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}



const getAllBusinesses = async (req, res) => {

  try {

    const searchquery = req.query.search
    const filter = {}
    if (searchquery && searchquery !== "") {
      filter.name = new RegExp(searchquery, "i")
    }
    console.log({ filter })


    const businesses = await Business.find(filter)
      .populate({ path: "badges", select: "badgeReff", populate: { path: "badgeReff", select: "icon  title " } })
      .populate({ path: "industry", select: "title" })
    return SuccessResponse(res, businesses)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}




const getBusinessDetails = async (req, res) => {

  try {
    const { businessId } = req.params
    const business = await Business.findById(businessId)
      .populate({ path: "badges", select: "badgeReff", populate: { path: "badgeReff", select: "icon  title " } })
      .populate({ path: "industry", select: "title" })
      .populate({ path: "createdBy", select: "fullName profilePic" })


    return SuccessResponse(res, business)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}



const getAllSupportRequests = async (req, res) => {

  try {
    const allRequests = await CustomerSupport.find()
      .populate({ path: "userReff", select: "fullName profilePic" })
    return SuccessResponse(res, allRequests)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}


const deleteAsupportRequest = async (req, res) => {

  try {
    const  { id } =  req.params
    const request = await CustomerSupport.findByIdAndDelete(id)
    if(!request){
        return ErrorResponse(res, "No Data found !")
    }
    return SuccessResponse(res, "Deleted")

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}





const genJwtToken = async function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "29d" })
  return token;
}


const genJwtForgetPasswordToken = async function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: 190000 })
  return token;
}


module.exports = {
  verify2faOtp,
  login,
  dashboardCards,
  changePassword,
  getAllUsers,
  deleteAsupportRequest,
  getUserDetails,
  getAllExperts,
  getExpertDetails,
  getAllSupportRequests,
  forgetPasswordUserOtpValidation,
  getAllBusinesses,
  verifyForgetPasswordUser,
  getBusinessDetails,
}