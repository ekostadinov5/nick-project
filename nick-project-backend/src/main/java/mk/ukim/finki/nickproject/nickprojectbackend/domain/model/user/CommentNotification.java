package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.CommentId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;

import javax.persistence.*;

@Entity
@Table(name = "comment_notification")
@Getter
public class CommentNotification extends Notification {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "comment_id", nullable = false))
    private CommentId commentId;

    protected CommentNotification() {
    }

    public CommentNotification(RecipeId recipeId, UserId userId, CommentId commentId) {
        super(recipeId, userId);

        this.commentId = commentId;
    }

}
