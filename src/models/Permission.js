const mongoose = require('mongoose')


const PermissionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Пожалуйста напишите название роли."],
        maxlength: [70, "Сформулируйте название роли короче."]
    },
})


// let Permission
// try {
//     Permission = mongoose.model("Permission");
// } catch {
//     Permission = mongoose.model("Permission", PermissionSchema, "Permission");
// }
// const Permission = mongoose.model('Permission', PermissionSchema, "Permission")
// const Permission = mongoose.models.Permission || mongoose.model('Permission', PermissionSchema, "Permission")
module.exports=mongoose.models.Permission || mongoose.model('Permission', PermissionSchema)


