package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "friend_request")
@Getter
public class FriendRequest extends AbstractEntity<FriendRequestId> {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "requestor_id", nullable = false))
    private UserId requestor;

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "requestee_id", nullable = false))
    private UserId requestee;

    @Column(name = "made_on", nullable = false)
    private LocalDateTime madeOn;

    protected FriendRequest() {
    }

    public FriendRequest(UserId requestor, UserId requestee) {
        super(DomainObjectId.randomId(FriendRequestId.class));

        this.requestor = requestor;
        this.requestee = requestee;
        this.madeOn = LocalDateTime.now();
    }

}
