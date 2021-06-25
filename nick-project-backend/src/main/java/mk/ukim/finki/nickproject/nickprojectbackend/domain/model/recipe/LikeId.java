package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class LikeId extends DomainObjectId {

    protected LikeId() {
        super(DomainObjectId.randomId(LikeId.class).getId());
    }

    public LikeId(String id) {
        super(id);
    }

}
