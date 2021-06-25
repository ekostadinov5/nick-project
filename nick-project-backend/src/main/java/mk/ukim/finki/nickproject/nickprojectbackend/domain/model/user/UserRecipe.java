package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.*;

@Entity
@Table(name = "user_recipe")
@Getter
public class UserRecipe extends AbstractEntity<UserRecipeId> {

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "recipe_id", nullable = false))
    private RecipeId recipeId;

    protected UserRecipe() {
    }

    public UserRecipe(RecipeId recipeId) {
        super(DomainObjectId.randomId(UserRecipeId.class));

        this.recipeId = recipeId;
    }

}
