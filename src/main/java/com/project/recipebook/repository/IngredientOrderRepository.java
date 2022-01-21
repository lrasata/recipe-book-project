package com.project.recipebook.repository;

import java.util.List;

import com.project.recipebook.domain.IngredientOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IngredientOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IngredientOrderRepository extends JpaRepository<IngredientOrder, Long> {

}
