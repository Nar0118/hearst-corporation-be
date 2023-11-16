import { Router } from 'express'
import authRouter from './AuthRouts'
import Paths from './constants/Paths'
import contractRouter from './Contracts'
import dashboardRouter from './DashboardRouts'
import userRouter from './UserRouts'
import revenueRouter from './Revenues'
import machineRouter from './Machines'
import subAccountRouter from './SubAccounts'
import revenueCalculationRouter from './RevenuesCalculation'
// **** Base Routers For Api **** //
const apiRouter = Router()

apiRouter.use(Paths.Users.Base, userRouter)
apiRouter.use(Paths.Auth.Base, authRouter)
apiRouter.use(Paths.Dashboard.Base, dashboardRouter)
apiRouter.use(Paths.Contract.Base, contractRouter)
apiRouter.use(Paths.Revenue.Base, revenueRouter)
apiRouter.use(Paths.Machines.Base, machineRouter)
apiRouter.use(Paths.SubAccount.Base, subAccountRouter)
apiRouter.use(Paths.RevenueCalculation.Base, revenueCalculationRouter)

export default apiRouter
