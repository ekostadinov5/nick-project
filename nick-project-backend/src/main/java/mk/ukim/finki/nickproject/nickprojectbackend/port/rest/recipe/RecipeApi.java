package mk.ukim.finki.nickproject.nickprojectbackend.port.rest.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.application.service.recipe.RecipeService;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe.CategoryRepository;
import mk.ukim.finki.nickproject.nickprojectbackend.port.dto.recipe.RecipeDto;
import mk.ukim.finki.nickproject.nickprojectbackend.port.dto.recipe.RecipeInfoDto;
import mk.ukim.finki.nickproject.nickprojectbackend.port.form.recipe.RecipeForm;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/api/recipes", produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
public class RecipeApi {
    private final RecipeService recipeService;
    private final CategoryRepository categoryRepository;

    public RecipeApi(RecipeService recipeService, CategoryRepository categoryRepository) {
        this.recipeService = recipeService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<RecipeInfoDto> getAllRecipes() {
        return this.recipeService.getAllRecipes().stream()
                .map(RecipeInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/home")
    public List<RecipeInfoDto> getFriendsRecipes(@RequestHeader List<UserId> friendsIds) {
        return this.recipeService.getFriendsRecipes(friendsIds).stream()
                .map(RecipeInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/popular")
    public List<RecipeInfoDto> getMostPopularRecipes() {
        return this.recipeService.getMostPopularRecipes().stream()
                .map(RecipeInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/list")
    public List<RecipeInfoDto> getRecipesList(@RequestHeader List<RecipeId> recipeIds) {
        return this.recipeService.getRecipesList(recipeIds).stream()
                .map(RecipeInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/search")
    public List<RecipeInfoDto> searchRecipes(@RequestParam(value = "searchTerm", required = false) String searchTerm,
                                             @RequestParam(value = "categories", required = false)
                                                     List<String> categories,
                                             @RequestParam(value = "ingredients", required = false)
                                                     List<String> ingredients,
                                             @RequestParam(value = "prepTimeFrom", required = false,
                                                     defaultValue = "1") Short prepTimeFrom,
                                             @RequestParam(value = "prepTimeTo", required = false,
                                                     defaultValue = "32767") Short prepTimeTo,
                                             @RequestParam(value = "numServingsFrom", required = false,
                                                     defaultValue = "1") Short numServingsFrom,
                                             @RequestParam(value = "numServingsTo", required = false,
                                                     defaultValue = "32767") Short numServingsTo) {
        return this.recipeService.searchRecipes(searchTerm, categories, ingredients, prepTimeFrom, prepTimeTo,
                numServingsFrom, numServingsTo)
                .stream()
                .map(RecipeInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/{recipeId}")
    public RecipeDto getRecipe(@PathVariable RecipeId recipeId) {
        Recipe recipe = this.recipeService.getRecipe(recipeId);
        return new RecipeDto(recipe);
    }

    @GetMapping(path = "/categories")
    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }

    @GetMapping(path = "/image/{imageFilename}")
    public byte[] getOneRecipeImage(@PathVariable String imageFilename) {
        return this.recipeService.getOneRecipeImage(imageFilename);
    }

    @PostMapping(path = "/{userId}")
    public RecipeInfoDto createRecipe(@PathVariable UserId userId,
                                      @RequestPart RecipeForm form,
                                      @RequestPart(required = false) List<MultipartFile> imageFiles) {
        Recipe recipe = this.recipeService.createRecipe(userId, form.getAvailability(), form.getName(),
                form.getDescription(), form.getPrepTime(), form.getNumServings(), form.getIngredients(),
                form.getPrepSteps(), form.getCategories(), imageFiles != null ? imageFiles : new ArrayList<>());
        return new RecipeInfoDto(recipe);
    }

    @PatchMapping(path = "/{recipeId}")
    public RecipeInfoDto updateRecipe(@PathVariable RecipeId recipeId,
                                      @RequestPart RecipeForm form,
                                      @RequestPart(required = false) List<MultipartFile> imageFiles) {
        Recipe recipe = this.recipeService.updateRecipe(recipeId, form.getAvailability(), form.getName(),
                form.getDescription(), form.getPrepTime(), form.getNumServings(), form.getIngredients(),
                form.getPrepSteps(), form.getCategories(), imageFiles != null ? imageFiles : new ArrayList<>(),
                form.getDeleteOldImages());
        return new RecipeInfoDto(recipe);
    }

    @DeleteMapping(path = "/{recipeId}")
    public void deleteRecipe(@PathVariable RecipeId recipeId) {
        this.recipeService.deleteRecipe(recipeId);
    }

    @PostMapping(path = "/like/{recipeId}/{likedBy}")
    public Like likeRecipe(@PathVariable RecipeId recipeId,
                           @PathVariable UserId likedBy) {
        return this.recipeService.likeRecipe(recipeId, likedBy);
    }

    @DeleteMapping(path = "/like/{recipeId}/{likedBy}")
    public void unlikeRecipe(@PathVariable RecipeId recipeId,
                             @PathVariable UserId likedBy) {
        this.recipeService.unlikeRecipe(recipeId, likedBy);
    }

    @PostMapping(path = "/comment/{recipeId}/{commentedBy}")
    public Comment commentOnRecipe(@PathVariable RecipeId recipeId,
                                   @PathVariable UserId commentedBy,
                                   @RequestParam String text) {
        return this.recipeService.commentOnRecipe(recipeId, commentedBy, text);
    }

    @DeleteMapping(path = "/comment/{recipeId}/{commentId}")
    public void removeCommentFromRecipe(@PathVariable RecipeId recipeId,
                                        @PathVariable CommentId commentId) {
        this.recipeService.removeCommentFromRecipe(recipeId, commentId);
    }

}
