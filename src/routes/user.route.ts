import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.route('/user').post(userController.createUser).get(userController.getUsers).delete(userController.deleteUsers);
router.route('/user/verify').post(userController.verifyUser);
router.route('/user/login').post(userController.loginUser);
export default router;
