package mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.Recipe;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, RecipeId> {

    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE r.userId IN ?1 " +
                "AND r.availability = 'PUBLIC'")
    List<Recipe> findAllFriendsRecipes(List<UserId> friendsIds, Pageable pageable);

    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE r.availability = 'PUBLIC'" +
            "ORDER BY SIZE(r.likes) DESC")
    List<Recipe> findMostPopularRecipes(Pageable pageable);

    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE LOWER(r.name) LIKE %?1% " +
                "AND r.prepTime >= ?2 " +
                "AND r.prepTime <= ?3 " +
                "AND r.numServings >= ?4 " +
                "AND r.numServings <= ?5 " +
                "AND r.availability = 'PUBLIC'")
    List<Recipe> searchRecipes(String name, Short prepTimeFrom, Short prepTimeTo, Short numServingsFrom,
                               Short numServingsTo, Pageable pageable);

    @Query("SELECT r " +
            "FROM Recipe r " +
            "WHERE r.prepTime >= ?1 " +
                "AND r.prepTime <= ?2 " +
                "AND r.numServings >= ?3 " +
                "AND r.numServings <= ?4 " +
                "AND r.availability = 'PUBLIC'")
    List<Recipe> searchRecipesWithoutName(Short prepTimeFrom, Short prepTimeTo, Short numServingsFrom,
                                          Short numServingsTo, Pageable pageable);

}
