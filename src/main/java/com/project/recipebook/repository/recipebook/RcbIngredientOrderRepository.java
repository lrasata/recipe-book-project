package com.project.recipebook.repository.recipebook;

import java.util.List;

import com.project.recipebook.domain.IngredientOrder;
import com.project.recipebook.repository.IngredientOrderRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RcbIngredientOrderRepository extends IngredientOrderRepository{
    @Query("select distinct ingredientOrder from IngredientOrder ingredientOrder left join fetch ingredientOrder.ingredient" )
    List<IngredientOrder> findAllWithEagerRelationships();

}
