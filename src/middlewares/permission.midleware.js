export const Roles = (...allowRole) => (req,res,next)=> {
    const {role} = req.user
    if(role=="admin"|| allowRole.includes(role)){
        return next()
    }
    return res.status(401).json({
        success: false,
        error: "Unauthorize"
            
    })
}