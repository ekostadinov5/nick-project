package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.LikeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObject;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

@Getter
public class RecipeLikedEvent implements DomainObject {
    private final UserId userId;
    private final RecipeId recipeId;
    private final UserId likedBy;
    private final LikeId likeId;

    public RecipeLikedEvent(UserId userId, RecipeId recipeId, UserId likedBy, LikeId likeId) {
        this.userId = userId;
        this.recipeId = recipeId;
        this.likedBy = likedBy;
        this.likeId = likeId;
    }

}
