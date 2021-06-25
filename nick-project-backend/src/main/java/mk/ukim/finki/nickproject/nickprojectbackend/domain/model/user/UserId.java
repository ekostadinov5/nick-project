package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class UserId extends DomainObjectId {

    public UserId() {
        super(DomainObjectId.randomId(UserId.class).getId());
    }

    public UserId(String id) {
        super(id);
    }

}
