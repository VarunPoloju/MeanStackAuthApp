import Role from '../Models/Role.js'
import { createError } from '../Utils/error.js';
import { createSuccess } from '../Utils/success.js';



export const createRole = async (req,res,next) =>{
    try {
        if(req.body.role && req.body.role !== ''){
            const newRole = new Role(req.body);
            await newRole.save();
            // return res.send('Role Created!');
            return next(createSuccess(200, 'Role Created!'));
        }
        else{
            // return res.status(400).send('Bad Request');
            return next(createError(400, 'Bad Request'));
        }
    } catch (error) {
        // return res.status(500).send('Internal server error!');
        return next(createError(500, 'Internal server error'));
    }
}

export const updateRole = async (req,res,next) =>{
    try {
        const role = await Role.findById({_id : req.params.id});    // _id will be in database u are searching _id in db, req.params.id u will be get from UI
        if(role){
            const newData = await Role.findByIdAndUpdate(
                req.params.id,  //-> this id u want to update
                {$set: req.body},    //whatever req.body is coming we have to set them
                {new : true}
            );
            // return res.status(200).send('Role Updated!');
            return next(createSuccess(200, 'Role Updated!'));
        }
        else{
            // return res.status(404).send('Role Not Found!');
            return next(createError(404, 'Role Not Found!'));
        }
    } catch (error) {
        // return res.status(500).send('Internal server error');
        return next(createError(500, 'Internal server error'));
    }
}


export const getAllRoles = async (req,res,next) =>{
    try {
        const roles = await Role.find({});
        // return res.status(200).send(roles);
        return next(createSuccess(200, 'Fetched all roles'));
    } catch (error) {
        // return res.status(500).send('Internal server error');
        return next(createError(500, 'Internal server error'));
    }
}

export const deleteRole = async (req,res,next) =>{
    try {
        const roleId = req.params.id;
        const findRoleinDB = await Role.findById({_id : roleId});
        if(findRoleinDB){
            await Role.findByIdAndDelete(roleId);
            // return res.status(200).send('Role deleted');
            return next(createSuccess(200, 'Role deleted!'));
        }        
        else{
            // return res.status(404).send('Role Not Found!');
            return next(createError(404, 'Role Not Found!'));
        }
    } catch (error) {
        // return res.status(500).send('Internal server error');
        return next(createError(500, 'Internal server error!')); //u can use abobve approach also but this is meaningful

    }
}