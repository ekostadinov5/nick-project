package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.CommentId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObject;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

@Getter
public class RecipeCommentedOnEvent implements DomainObject {
    private final UserId userId;
    private final RecipeId recipeId;
    private final UserId commentedBy;
    private final CommentId commentId;

    public RecipeCommentedOnEvent(UserId userId, RecipeId recipeId, UserId commentedBy, CommentId commentId) {
        this.userId = userId;
        this.recipeId = recipeId;
        this.commentedBy = commentedBy;
        this.commentId = commentId;
    }
}
