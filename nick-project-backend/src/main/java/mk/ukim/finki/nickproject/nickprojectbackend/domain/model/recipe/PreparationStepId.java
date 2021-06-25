package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class PreparationStepId extends DomainObjectId {

    protected PreparationStepId() {
        super(DomainObjectId.randomId(PreparationStepId.class).getId());
    }

    public PreparationStepId(String id) {
        super(id);
    }

}
