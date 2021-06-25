package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObject;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

@Getter
public class RecipeDeletedEvent implements DomainObject {
    private final UserId userId;
    private final RecipeId recipeId;

    public RecipeDeletedEvent(UserId userId, RecipeId recipeId) {
        this.userId = userId;
        this.recipeId = recipeId;
    }

}
