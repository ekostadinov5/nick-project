package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.LikeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;

import javax.persistence.*;

@Entity
@Table(name = "like_notification")
@Getter
public class LikeNotification extends Notification {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "like_id", nullable = false))
    private LikeId likeId;

    protected LikeNotification() {
    }

    public LikeNotification(RecipeId recipeId, UserId userId, LikeId likeId) {
        super(recipeId, userId);

        this.likeId = likeId;
    }

}
