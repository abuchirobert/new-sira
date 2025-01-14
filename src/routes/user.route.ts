import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import AuthToken from '../middlewares/user-token.middleware';
import AdminMiddleWare from '../middlewares/admin-access.middleware';

const router = Router();

const authToken = new AuthToken();
const adminAccess = new AdminMiddleWare();

const userService = new UserService();
const userController = new UserController(userService);

router
    .route('/user')
    .post(userController.createUser)
    .get(authToken.verifyToken, adminAccess.checkAdmin, userController.getUsers)
    .delete(authToken.verifyToken, adminAccess.checkAdmin, userController.deleteUsers);
router.route('/user/verify').post(userController.verifyUser);
router.route('/user/login').post(userController.loginUser);
router.route('/user/logout').post(userController.logout);
export default router;
