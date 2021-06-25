package mk.ukim.finki.nickproject.nickprojectbackend.bootstrap;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.Category;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.recipe.CategoryRepository;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataHolder {
    private final CategoryRepository categoryRepository;

    public DataHolder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostConstruct
    public void init() {
        if (this.categoryRepository.count() == 0) {
            List<String> categories = Arrays.asList(
                    "Појадок",
                    "Ручек",
                    "Вечера",
                    "Салата",
                    "Супа",
                    "Главно јадење",
                    "Десерт",
                    "Пица",
                    "Морска храна",
                    "Посно",
                    "Вегетаријанско"
            );
            this.categoryRepository.saveAll(categories.stream().map(Category::new).collect(Collectors.toList()));
        }
    }

}
