package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class IngredientId extends DomainObjectId {

    protected IngredientId() {
        super(DomainObjectId.randomId(IngredientId.class).getId());
    }

    public IngredientId(String id) {
        super(id);
    }

}
