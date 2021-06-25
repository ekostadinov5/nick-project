package mk.ukim.finki.nickproject.nickprojectbackend.port.dto.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.enumeration.Availability;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
public class RecipeDto implements Serializable {

    private final String recipeId;

    private final String userId;

    private final LocalDateTime postedOn;

    private final Availability availability;

    private final String name;

    private final String description;

    private final Short prepTime;

    private final Short numServings;

    private final Set<Ingredient> ingredients;

    private final Set<PreparationStep> prepSteps;

    private final Set<Category> categories;

    private final Set<ImageFile> imageFiles;

    private final Set<Like> likes;

    private final Set<Comment> comments;

    public RecipeDto(Recipe recipe) {
        this.recipeId = recipe.id().getId();
        this.userId = recipe.getUserId().getId();
        this.postedOn = recipe.getPostedOn();
        this.availability = recipe.getAvailability();
        this.name = recipe.getName();
        this.description = recipe.getDescription();
        this.prepTime = recipe.getPrepTime();
        this.numServings = recipe.getNumServings();
        this.ingredients = recipe.getIngredients();
        this.prepSteps = recipe.getPrepSteps();
        this.categories = recipe.getCategories();
        this.imageFiles = recipe.getImageFiles();
        this.likes = recipe.getLikes();
        this.comments = recipe.getComments();
    }

}
