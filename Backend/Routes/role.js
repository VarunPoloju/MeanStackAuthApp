import express from 'express';
// import Role from '../Models/Role.js';
import { createRole, deleteRole, getAllRoles, updateRole } from '../Controllers/role.controller.js';
import { verifyAdmin } from '../Utils/verifyToken.js';

const roleApiObj = express.Router();


//create a new role in db
roleApiObj.post('/create', verifyAdmin, createRole);    //only admin can able to create the roles

// Update role in db
roleApiObj.put('/update/:id', verifyAdmin, updateRole); //only admin can update the role

// Get all roles
roleApiObj.get('/getAll',getAllRoles)


//delete role from db
roleApiObj.delete('/deleterole/:id',deleteRole)






export default roleApiObj;