package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "ingredient")
@Getter
public class Ingredient extends AbstractEntity<IngredientId> {

    @Column(name = "ingredient_index", nullable = false)
    private Short index;

    @Column(name = "name", nullable = false)
    private String name;

    protected Ingredient() {
    }

    public Ingredient(Short index, String name) {
        super(DomainObjectId.randomId(IngredientId.class));

        this.index = index;
        this.name = name;
    }

}
