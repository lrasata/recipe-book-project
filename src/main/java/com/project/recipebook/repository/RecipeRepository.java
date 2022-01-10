package com.project.recipebook.repository;

import com.project.recipebook.domain.Recipe;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Recipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {}
