package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "preparation_step")
@Getter
public class PreparationStep extends AbstractEntity<PreparationStepId> {

    @Column(name = "preparation_step_index", nullable = false)
    private Short index;

    @Column(name = "text", nullable = false)
    private String text;

    protected PreparationStep() {
    }

    public PreparationStep(Short index, String text) {
        super(DomainObjectId.randomId(PreparationStepId.class));

        this.index = index;
        this.text = text;
    }

}
