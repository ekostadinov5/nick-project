package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@Getter
public class Notification extends AbstractEntity<NotificationId> {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "recipe_id", nullable = false))
    private RecipeId recipeId;

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "action_user_id", nullable = false))
    private UserId userId;

    private final LocalDateTime receivedOn;

    private Boolean seen;

    protected Notification() {
        this.receivedOn = LocalDateTime.now();
    }

    public Notification(RecipeId recipeId, UserId userId) {
        super(DomainObjectId.randomId(NotificationId.class));

        this.recipeId = recipeId;
        this.userId = userId;
        this.receivedOn = LocalDateTime.now();
        this.seen = false;
    }

    public void setOnSeen() {
        this.seen = true;
    }

}
