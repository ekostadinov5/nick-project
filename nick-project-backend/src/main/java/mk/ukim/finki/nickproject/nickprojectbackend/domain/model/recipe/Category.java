package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "category")
@Getter
public class Category extends AbstractEntity<CategoryId> {

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    protected Category() {
    }

    public Category(String name) {
        super(DomainObjectId.randomId(CategoryId.class));

        this.name = name;
    }

}
