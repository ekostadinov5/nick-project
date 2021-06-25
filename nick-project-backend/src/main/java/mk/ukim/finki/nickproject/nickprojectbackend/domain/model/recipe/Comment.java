package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recipe_comment")
@Getter
public class Comment extends AbstractEntity<CommentId> {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "user_id", nullable = false))
    private UserId userId;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "posted_on", nullable = false)
    private final LocalDateTime postedOn;

    protected Comment() {
        this.postedOn = LocalDateTime.now();
    }

    public Comment(UserId userId, String text) {
        super(DomainObjectId.randomId(CommentId.class));

        this.userId = userId;
        this.text = text;
        this.postedOn = LocalDateTime.now();
    }

}
