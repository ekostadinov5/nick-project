package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class CategoryId extends DomainObjectId {

    protected CategoryId() {
        super(DomainObjectId.randomId(CategoryId.class).getId());
    }

    public CategoryId(String id) {
        super(id);
    }

}
