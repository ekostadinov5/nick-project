package mk.ukim.finki.nickproject.nickprojectbackend.port.dto.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
public class RecipeInfoDto implements Serializable {

    private final String recipeId;

    private final String userId;

    private final LocalDateTime postedOn;

    private final String name;

    private final String description;

    private final Set<Category> categories;

    private final Set<ImageFile> imageFiles;

    private final Set<Like> likes;

    private final Set<Comment> comments;

    public RecipeInfoDto(Recipe recipe){
        this.recipeId = recipe.id().getId();
        this.userId = recipe.getUserId().getId();
        this.postedOn = recipe.getPostedOn();
        this.name = recipe.getName();
        this.description = recipe.getDescription();
        this.categories = recipe.getCategories();
        this.imageFiles = recipe.getImageFiles();
        this.likes = recipe.getLikes();
        this.comments = recipe.getComments();
    }

}
