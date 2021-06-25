package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.enumeration.Availability;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Entity
@Table(name = "recipe")
@Getter
public class Recipe extends AbstractEntity<RecipeId> {

    @Version
    private Long version;

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "user_id", nullable = false))
    private UserId userId;

    @Column(name = "posted_on", nullable = false)
    private LocalDateTime postedOn;

    @Column(name = "availability", nullable = false)
    @Enumerated(EnumType.STRING)
    private Availability availability;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false, length = 300)
    private String description;

    @Column(name = "preparation_time", nullable = false)
    private Short prepTime;

    @Column(name = "number_of_servings", nullable = false)
    private Short numServings;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id")
    private Set<Ingredient> ingredients;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id")
    private Set<PreparationStep> prepSteps;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "recipe_category",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ImageFile> imageFiles;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id")
    private Set<Like> likes;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id")
    private Set<Comment> comments;

    protected Recipe() {
    }

    public Recipe(UserId userId, Availability availability, String name, String description, Short prepTime,
                  Short numServings, List<String> ingredients, List<String> preparationSteps,
                  List<Category> categories, List<ImageFile> imageFiles) {
        super(DomainObjectId.randomId(RecipeId.class));

        Objects.requireNonNull(userId, "userId must not be null");
        this.userId = userId;

        this.postedOn = LocalDateTime.now();
        this.ingredients = new HashSet<>();
        this.prepSteps = new HashSet<>();
        this.categories = new HashSet<>();
        this.imageFiles = new HashSet<>();
        this.likes = new HashSet<>();
        this.comments = new HashSet<>();

        this.setProperties(availability, name, description, prepTime, numServings, ingredients, preparationSteps,
                categories, imageFiles);
    }

    public void update(Availability availability, String name, String description, Short prepTime,
                       Short numServings, List<String> ingredients, List<String> preparationSteps,
                       List<Category> categories, List<ImageFile> imageFiles) {
        this.setProperties(availability, name, description, prepTime, numServings, ingredients, preparationSteps,
                categories, imageFiles);
    }

    public Like like(UserId userId) {
        boolean exists = this.likes.stream().anyMatch(l -> l.getUserId().equals(userId));
        if (exists) {
            throw new RuntimeException();
        }
        Like like = new Like(userId);
        this.likes.add(like);
        return like;
    }

    public void unlike(UserId userId) {
        Like like = this.likes.stream()
                .filter(l -> l.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        this.likes.remove(like);
    }

    public Comment comment(UserId userId, String text) {
        Comment comment = new Comment(userId, text);
        this.comments.add(comment);
        return comment;
    }

    public void removeComment(CommentId commentId) {
        Comment comment = this.comments.stream()
                .filter(c -> c.id().equals(commentId))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        this.comments.remove(comment);
    }

    private void setProperties(Availability availability, String name, String description, Short prepTime,
                               Short numServings, List<String> ingredients, List<String> preparationSteps,
                               List<Category> categories, List<ImageFile> imageFiles) {
        Objects.requireNonNull(availability, "availability must not be null");
        Objects.requireNonNull(name, "name must not be null");
        Objects.requireNonNull(description, "description must not be null");
        Objects.requireNonNull(prepTime, "prepTime must not be null");
        Objects.requireNonNull(numServings, "numServings must not be null");

        this.availability = availability;
        this.name = name;
        this.description = description;
        this.prepTime = prepTime;
        this.numServings = numServings;

        this.ingredients.clear();
        this.ingredients.addAll(IntStream.range(0, ingredients.size())
                .mapToObj(index -> new Ingredient((short) index, ingredients.get(index)))
                .collect(Collectors.toList()));
        this.prepSteps.clear();
        this.prepSteps.addAll(IntStream.range(0, preparationSteps.size())
                .mapToObj(index -> new PreparationStep((short) index, preparationSteps.get(index)))
                .collect(Collectors.toList()));
        this.categories.clear();
        this.categories.addAll(categories);
        this.imageFiles.clear();
        this.imageFiles.addAll(imageFiles);
    }

}
