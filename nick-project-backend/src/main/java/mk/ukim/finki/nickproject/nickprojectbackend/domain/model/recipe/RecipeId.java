package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class RecipeId extends DomainObjectId {

    protected RecipeId() {
        super(DomainObjectId.randomId(RecipeId.class).getId());
    }

    public RecipeId(String id) {
        super(id);
    }

}
