
const dashboardRouter = require("express").Router()


const {  authenticateAdmin } = require("../middlewares/auth")
const { login,
    verify2faOtp,
    changePassword,
    dashboardCards,
    getAllUsers,
    getAllExperts,
    getAllBusinesses,
    getUserDetails,
    getExpertDetails,
    getBusinessDetails,
    getAllSupportRequests,
    verifyForgetPasswordUser,
    deleteAsupportRequest,
} = require("../controllers/commonController.js")







//authentications flow 
dashboardRouter.post("/login", login)
dashboardRouter.post("/login/verify", verify2faOtp)
dashboardRouter.get("/forgetPassword/:email", verifyForgetPasswordUser)
dashboardRouter.put("/changePassword",  changePassword)



// dashboard
dashboardRouter.get("/dashboard",authenticateAdmin,  dashboardCards)


//users
dashboardRouter.get("/users/all", authenticateAdmin, getAllUsers)
dashboardRouter.get("/users/details/:userId", authenticateAdmin ,  getUserDetails)



//experts
dashboardRouter.get("/experts/all", authenticateAdmin, getAllExperts)
dashboardRouter.get("/experts/details/:expertId",authenticateAdmin, getExpertDetails)



//businesses
dashboardRouter.get("/businesses/all",  authenticateAdmin, getAllBusinesses)
dashboardRouter.get("/businesses/details/:businessId", authenticateAdmin,  getBusinessDetails)


// customer support
dashboardRouter.get("/support/all",authenticateAdmin,  getAllSupportRequests)
dashboardRouter.delete("/support/:id",authenticateAdmin,  deleteAsupportRequest)


module.exports = dashboardRouter