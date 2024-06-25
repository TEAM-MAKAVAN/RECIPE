import { Router } from 'express';
import { addRecipe, getRecipe, getRecipes } from '../controllers/recipeController.js';
import { uploadImage} from '../middlewares/multer.js'; // Import the multer upload middleware
import verifyJWT from '../middlewares/auth.middleware.js';
const recipeRouter = Router();


// ROUTE FOR UPLOADING NEW RECIPE
// succesfully checked
recipeRouter.route('/recipe_upload')
.post(verifyJWT, uploadImage.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), addRecipe);


// ROUTE TO GET ALL RECIPES
// succesfully checked
recipeRouter.route('/getrecipes')
 .post(verifyJWT, getRecipes);


 // ROUTE TO GET SINGLE RECIPE
 // successfully checked
 recipeRouter.route('/getsinglerecipe')
 .post(verifyJWT, getRecipe);

 
export { recipeRouter };
