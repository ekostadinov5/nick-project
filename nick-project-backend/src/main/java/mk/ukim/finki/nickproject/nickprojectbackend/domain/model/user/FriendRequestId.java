package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class FriendRequestId extends DomainObjectId {

    public FriendRequestId() {
        super(DomainObjectId.randomId(FriendRequestId.class).getId());
    }

    public FriendRequestId(String id) {
        super(id);
    }

}
