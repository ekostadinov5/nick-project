package mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.Category;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.CategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, CategoryId> {

    @Query("SELECT c FROM Category c WHERE c.name in ?1")
    List<Category> findCategoriesByNames(List<String> names);

}
