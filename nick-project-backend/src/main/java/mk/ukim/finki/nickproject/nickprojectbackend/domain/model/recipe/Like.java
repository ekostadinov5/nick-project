package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recipe_like")
@Getter
public class Like extends AbstractEntity<LikeId> {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "user_id", nullable = false))
    private UserId userId;

    @Column(name = "liked_on", nullable = false)
    private final LocalDateTime likedOn;

    protected Like() {
        this.likedOn = LocalDateTime.now();
    }

    public Like(UserId userId) {
        super(DomainObjectId.randomId(LikeId.class));

        this.userId = userId;
        this.likedOn = LocalDateTime.now();
    }

}
