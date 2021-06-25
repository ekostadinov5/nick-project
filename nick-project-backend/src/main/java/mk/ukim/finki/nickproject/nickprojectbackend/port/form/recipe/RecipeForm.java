package mk.ukim.finki.nickproject.nickprojectbackend.port.form.recipe;

import lombok.AllArgsConstructor;
import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.enumeration.Availability;

import java.util.List;

@Getter
@AllArgsConstructor
public class RecipeForm {

    private final Availability availability;

    private final String name;

    private final String description;

    private final Short prepTime;

    private final Short numServings;

    private final List<String> ingredients;

    private final List<String> prepSteps;

    private final List<String> categories;

    private final Boolean deleteOldImages;

}
