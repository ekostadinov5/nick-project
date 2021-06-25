package mk.ukim.finki.nickproject.nickprojectbackend.application.service.recipe.impl;

import mk.ukim.finki.nickproject.nickprojectbackend.application.service.recipe.RecipeService;
import mk.ukim.finki.nickproject.nickprojectbackend.application.service.file.FileService;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.enumeration.Availability;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCommentedOnEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCreatedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeDeletedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeLikedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe.CategoryRepository;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe.RecipeRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final FileService fileService;
    private final ApplicationEventPublisher applicationEventPublisher;

    public RecipeServiceImpl(RecipeRepository recipeRepository, CategoryRepository categoryRepository,
                             FileService fileService, ApplicationEventPublisher applicationEventPublisher) {
        this.recipeRepository = recipeRepository;
        this.categoryRepository = categoryRepository;
        this.fileService = fileService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Override
    public List<Recipe> getAllRecipes() {
        return this.recipeRepository.findAll();
    }

    @Override
    public List<Recipe> getFriendsRecipes(List<UserId> friendsIds) {
        return this.recipeRepository.findAllFriendsRecipes(friendsIds, PageRequest.of(0, 100));
    }

    @Override
    public List<Recipe> getMostPopularRecipes() {
        return this.recipeRepository.findMostPopularRecipes(PageRequest.of(0, 10));
    }

    @Override
    public List<Recipe> getRecipesList(List<RecipeId> recipeIds) {
        return this.recipeRepository.findAllById(recipeIds);
    }

    @Override
    public List<Recipe> searchRecipes(String searchTerm, List<String> categories, List<String> ingredients,
                                      Short prepTimeFrom, Short prepTimeTo, Short numServingsFrom,
                                      Short numServingsTo) {
        if (searchTerm.isEmpty() && categories.isEmpty() && ingredients.isEmpty() && prepTimeFrom == 1
                && prepTimeTo == 32767 && numServingsFrom == 1 && numServingsTo == 32767) {
            throw new RuntimeException();
        }
        List<Recipe> recipes;
        if (!searchTerm.isEmpty()) {
            recipes = this.recipeRepository.searchRecipes(searchTerm.toLowerCase(), prepTimeFrom, prepTimeTo,
                    numServingsFrom, numServingsTo, PageRequest.of(0, 100));
        } else {
            recipes = this.recipeRepository.searchRecipesWithoutName(prepTimeFrom, prepTimeTo, numServingsFrom,
                    numServingsTo, PageRequest.of(0, 100));
        }
        recipes = filterByCategories(recipes, categories);
        recipes = filterByIngredients(recipes, ingredients);
        return recipes;
    }

    @Override
    public Recipe getRecipe(RecipeId recipeId) {
        return this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
    }

    @Override
    public byte[] getOneRecipeImage(String imageFilename) {
        return fileService.loadFile(imageFilename);
    }

    @Override
    public Recipe createRecipe(UserId userId, Availability availability, String name, String description,
                               Short prepTime, Short numServings, List<String> ingredients,
                               List<String> preparationSteps, List<String> categoriesNames,
                               List<MultipartFile> imageFiles) {
        List<Category> categories = this.categoryRepository.findCategoriesByNames(categoriesNames);
        List<ImageFile> imageFilesEntities = new ArrayList<>();
        imageFiles.forEach(imageFile -> {
            String filename = UUID.randomUUID().toString();
            fileService.saveFile(filename, imageFile);
            imageFilesEntities.add(new ImageFile(filename));
        });
        Recipe recipe = new Recipe(userId, availability, name, description, prepTime, numServings, ingredients,
                preparationSteps, categories, imageFilesEntities);
        RecipeId recipeId = this.recipeRepository.saveAndFlush(recipe).id();

        RecipeCreatedEvent event = new RecipeCreatedEvent(userId, recipeId);
        this.applicationEventPublisher.publishEvent(event);

        return recipe;
    }

    @Override
    public Recipe updateRecipe(RecipeId recipeId, Availability availability, String name, String description,
                               Short prepTime, Short numServings, List<String> ingredients,
                               List<String> preparationSteps, List<String> categoriesNames,
                               List<MultipartFile> imageFiles, Boolean deleteOldImages) {
        List<Category> categories = this.categoryRepository.findCategoriesByNames(categoriesNames);
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        List<ImageFile> imageFilesEntities;
        if (deleteOldImages) {
            imageFilesEntities = new ArrayList<>();
            recipe.getImageFiles().forEach(imageFile -> fileService.deleteFile(imageFile.getFilename()));
        } else {
            imageFilesEntities = new ArrayList<>(recipe.getImageFiles());
        }
        imageFiles.forEach(imageFile -> {
            String filename = UUID.randomUUID().toString();
            fileService.saveFile(filename, imageFile);
            imageFilesEntities.add(new ImageFile(filename));
        });
        recipe.update(availability, name, description, prepTime, numServings, ingredients, preparationSteps, categories,
                imageFilesEntities);
        return this.recipeRepository.saveAndFlush(recipe);
    }

    @Override
    public void deleteRecipe(RecipeId recipeId) {
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        this.recipeRepository.delete(recipe);
        recipe.getImageFiles().forEach(imageFile -> fileService.deleteFile(imageFile.getFilename()));

        RecipeDeletedEvent event = new RecipeDeletedEvent(recipe.getUserId(), recipeId);
        this.applicationEventPublisher.publishEvent(event);
    }

    @Override
    public Like likeRecipe(RecipeId recipeId, UserId likedBy) {
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        Like like = recipe.like(likedBy);
        this.recipeRepository.saveAndFlush(recipe);

        if (!recipe.getUserId().equals(likedBy)) {
            RecipeLikedEvent event = new RecipeLikedEvent(recipe.getUserId(), recipe.id(), likedBy, like.id());
            this.applicationEventPublisher.publishEvent(event);
        }

        return like;
    }

    @Override
    public void unlikeRecipe(RecipeId recipeId, UserId likedBy) {
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        recipe.unlike(likedBy);
        this.recipeRepository.saveAndFlush(recipe);
    }

    @Override
    public Comment commentOnRecipe(RecipeId recipeId, UserId commentedBy, String text) {
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        Comment comment = recipe.comment(commentedBy, text);
        this.recipeRepository.saveAndFlush(recipe);

        if (!recipe.getUserId().equals(commentedBy)) {
            RecipeCommentedOnEvent event = new RecipeCommentedOnEvent(recipe.getUserId(), recipe.id(), commentedBy,
                    comment.id());
            this.applicationEventPublisher.publishEvent(event);
        }

        return comment;
    }

    @Override
    public void removeCommentFromRecipe(RecipeId recipeId, CommentId commentId) {
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow(RuntimeException::new);
        recipe.removeComment(commentId);
        this.recipeRepository.saveAndFlush(recipe);
    }

    private List<Recipe> filterByCategories(List<Recipe> recipes, List<String> categories) {
        return recipes.stream()
                .filter(recipe -> {
                    List<String> recipeCategoriesNames = recipe.getCategories().stream()
                            .map(Category::getName)
                            .collect(Collectors.toList());
                    return recipeCategoriesNames.containsAll(categories);
                })
                .collect(Collectors.toList());
    }

    private List<Recipe> filterByIngredients(List<Recipe> recipes, List<String> ingredients) {
        return recipes.stream()
                .filter(recipe -> {
                    List<String> recipeIngredientsNames = recipe.getIngredients().stream()
                            .map(Ingredient::getName)
                            .collect(Collectors.toList());
//                    return recipeIngredientsNames.containsAll(ingredients);
                    return ingredients.stream().allMatch(i ->
                            recipeIngredientsNames.stream().anyMatch(ri -> ri.toLowerCase().contains(i.toLowerCase())));
                })
                .collect(Collectors.toList());
    }

}
