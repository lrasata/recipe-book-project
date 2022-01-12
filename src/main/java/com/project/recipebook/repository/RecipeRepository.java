package com.project.recipebook.repository;

import com.project.recipebook.domain.Recipe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Recipe entity.
 */
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query(
        value = "select distinct recipe from Recipe recipe left join fetch recipe.ingredients",
        countQuery = "select count(distinct recipe) from Recipe recipe"
    )
    Page<Recipe> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct recipe from Recipe recipe left join fetch recipe.ingredients")
    List<Recipe> findAllWithEagerRelationships();

    @Query("select recipe from Recipe recipe left join fetch recipe.ingredients where recipe.id =:id")
    Optional<Recipe> findOneWithEagerRelationships(@Param("id") Long id);
}
