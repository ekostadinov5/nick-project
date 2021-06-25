import axios from "../custom-axios/axios";
import qs from "qs";

const RecipeRepository = {
    getAllRecipes: () => {
        return axios.get("/api/recipes");
    },
    getFriendsRecipes: (friendsIds) => {
        return axios.get("/api/recipes/home", {
            headers: {
                friendsIds: friendsIds
            }
        });
    },
    getMostPopularRecipes: () => {
        return axios.get("/api/recipes/popular");
    },
    getRecipesList: (recipeIds) => {
        return axios.get("/api/recipes/list", {
            headers: {
                recipeIds: recipeIds
            }
        });
    },
    searchRecipes: (searchTerm, categories, ingredients, prepTimeFrom, prepTimeTo, numServingsFrom,
                    numServingsTo) => {
        return axios.get(`/api/recipes/search?searchTerm=${searchTerm}&categories=${categories}&ingredients=${ingredients}&prepTimeFrom=${prepTimeFrom}&prepTimeTo=${prepTimeTo}&numServingsFrom=${numServingsFrom}&numServingsTo=${numServingsTo}`);
    },
    getRecipe: (recipeId) => {
        return axios.get(`/api/recipes/${recipeId}`);
    },
    getAllCategories: () => {
        return axios.get("/api/recipes/categories");
    },
    getOneRecipeImage: (imageFilename) => {
        return axios.get(`/api/recipes/image/${imageFilename}`);
    },
    createRecipe: (userId, availability, name, description, prepTime, numServings, ingredients, prepSteps,
                   categories, imageFiles, onUploadProgress) => {
        const form = {
            availability: availability,
            name: name,
            description: description,
            prepTime: prepTime,
            numServings: numServings,
            ingredients: ingredients,
            prepSteps: prepSteps,
            categories: categories
        }
        const json = JSON.stringify(form);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const formData = new FormData();
        formData.append("form", blob)
        imageFiles.forEach(imageFile => {
            formData.append("imageFiles", imageFile);
        })
        return axios.post(`/api/recipes/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: onUploadProgress
        });
    },
    updateRecipe: (recipeId, availability, name, description, prepTime, numServings, ingredients, prepSteps,
                   categories, imageFiles, deleteOldImages, onUploadProgress) => {
        const form = {
            availability: availability,
            name: name,
            description: description,
            prepTime: prepTime,
            numServings: numServings,
            ingredients: ingredients,
            prepSteps: prepSteps,
            categories: categories,
            deleteOldImages: deleteOldImages
        }
        const json = JSON.stringify(form);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const formData = new FormData();
        formData.append("form", blob)
        imageFiles.forEach(imageFile => {
            formData.append("imageFiles", imageFile);
        })
        return axios.patch(`/api/recipes/${recipeId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: onUploadProgress
        });
    },
    deleteRecipe: (recipeId) => {
        return axios.delete(`/api/recipes/${recipeId}`);
    },
    likeRecipe: (recipeId, userId) => {
        return axios.post(`/api/recipes/like/${recipeId}/${userId}`);
    },
    unlikeRecipe: (recipeId, userId) => {
        return axios.delete(`/api/recipes/like/${recipeId}/${userId}`);
    },
    commentOnRecipe: (recipeId, userId, text) => {
        const data = qs.stringify({
            text: text
        });
        return axios.post(`/api/recipes/comment/${recipeId}/${userId}`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    },
    removeCommentFromRecipe: (recipeId, commentId) => {
        return axios.delete(`/api/recipes/comment/${recipeId}/${commentId}`);
    }
}

export default RecipeRepository;
