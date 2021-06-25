package mk.ukim.finki.nickproject.nickprojectbackend.application.service.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.enumeration.Availability;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RecipeService {

    List<Recipe> getAllRecipes();

    List<Recipe> getRecipesList(List<RecipeId> recipeIds);

    List<Recipe> getFriendsRecipes(List<UserId> friendsIds);

    List<Recipe> getMostPopularRecipes();

    List<Recipe> searchRecipes(String searchTerm, List<String> categories, List<String> ingredients, Short prepTimeFrom,
                               Short prepTimeTo, Short numServingsFrom, Short numServingsTo);

    Recipe getRecipe(RecipeId recipeId);

    byte[] getOneRecipeImage(String imageFilename);

    Recipe createRecipe(UserId userId, Availability availability, String name, String description, Short prepTime,
                        Short numServings, List<String> ingredients, List<String> preparationSteps,
                        List<String> categoriesNames, List<MultipartFile> imageFiles);

    Recipe updateRecipe(RecipeId recipeId, Availability availability, String name, String description, Short prepTime,
                        Short numServings, List<String> ingredients, List<String> preparationSteps,
                        List<String> categoriesNames, List<MultipartFile> imageFiles, Boolean deleteOldImages);

    void deleteRecipe(RecipeId recipeId);

    Like likeRecipe(RecipeId recipeId, UserId likedBy);

    void unlikeRecipe(RecipeId recipeId, UserId likedBy);

    Comment commentOnRecipe(RecipeId recipeId, UserId commentedBy, String text);

    void removeCommentFromRecipe(RecipeId recipeId, CommentId commentId);

}
