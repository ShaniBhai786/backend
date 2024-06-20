import { Router } from "express";
import {registerUser, userLogin} from '../controllers/users.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()
router.route("/register").post(upload.fields(
    [   // === Array
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]
),registerUser)

router.route("/login", userLogin ).post(userLogin)

export default router;