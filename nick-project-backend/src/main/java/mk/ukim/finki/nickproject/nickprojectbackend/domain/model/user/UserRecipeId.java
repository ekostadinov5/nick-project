package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class UserRecipeId extends DomainObjectId {

    public UserRecipeId() {
        super(DomainObjectId.randomId(UserRecipeId.class).getId());
    }

    public UserRecipeId(String id) {
        super(id);
    }

}
