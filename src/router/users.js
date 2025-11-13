import express from "express"
import ControllerUser from "../controller/users.js"
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

//  api/v1
router.post('/login', ControllerUser.Login)

router.get('/user/context', authMiddleware(), ControllerUser.FindOne)
router.post('/user/', ControllerUser.Create)
router.put('/user/', authMiddleware(), ControllerUser.Update)
router.delete('/user/', authMiddleware(), ControllerUser.Delete)

router.get('/users', authMiddleware([0]), ControllerUser.FindAll)
router.get('/user/:id', authMiddleware([0]), ControllerUser.FindOne)
router.post('/user/admin',authMiddleware([0]), ControllerUser.Create)
router.put('/user/:id', authMiddleware([0]), ControllerUser.Update)
router.delete('/user/:id', authMiddleware([0]), ControllerUser.Delete)

export default router