package com.project.recipebook.repository;

import com.project.recipebook.domain.Ingredient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ingredient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {}
