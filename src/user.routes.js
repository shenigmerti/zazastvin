import express, { response } from "express";
import userService from './services/user.service';
import { expressYupMiddleware } from 'express-yup-middleware';
import { StatusCodes } from "http-status-codes";
import { addUser } from "./user.schemas";

const router = express.Router();


const STATUS = {
  success: 'OK',
  failure: 'NO'
};




router.get('/all', (req, res) => {
  const users = userService.getAllUsers();
  
  if (users.length) {
    return res.status(StatusCodes.OK).send(users);
  }
  return res.status(StatusCodes.NOT_FOUND).send(
    {
      status: STATUS.failure,
      message: 'No users found',
    }
  )

});
router.get('/:id', (req, res) => {
  // localhost/v1/user/get/1
  const id = parseInt(req.params.id, 10);
  const user = userService.getUser(id);
  
  if (user) {
    return res.status(StatusCodes.OK).send({
       status: STATUS.success,
       user,
    }
    )
  }
  
  return res.status(StatusCodes.NOT_FOUND).send(
    {
      status: STATUS.failure,
      message:  'No users found.',
    }
  )

});
  
router.post('/',
 expressYupMiddleware ({schemaValidator: addUser, expectedStatusCode: StatusCodes.BAD_REQUEST}),
  (req, res) => {
   const {body : user} = req;
   const addedUser = userService.addUser(user);
  
    return res.status(StatusCodes.CREATED).send({
      status : STATUS.success,
      user : addedUser,
    });
  });

router.put('/:id', (req, res) => {

   const { body: user } = req;
   const id = parseInt(req.params.id, 10);

   const updatedUser = userService.updateUser(id, user);
   if (updatedUser) {
     return res.status(StatusCodes.OK).send({
       status : STATUS.success,
       user : updatedUser,
     });
   } else {
     return res.status(StatusCodes.NOT_FOUND).send({
       status : STATUS.failure,
       message : `User ${id} not found`,
    });
   }
  });

router.delete('/:id',(req, res) => {
  
  const {params} = req;

  const id = parseInt(params.id);
  const user = userService.getUser(id);
 
  if (user) {
    
      userService.removeUser(id);

      return res.status(StatusCodes.OK).send({

        status: STATUS.success,
        message: `User ${id} has been deleted successfully.`,

      });
  } else {
       return res.status(StatusCodes.NOT_FOUND).send({

        status: STATUS.failure,
        message: `User ${id} hasn't been found.`,

    })
  }

});
  
  
export default router;