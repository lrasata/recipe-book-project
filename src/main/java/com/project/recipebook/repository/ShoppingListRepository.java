package com.project.recipebook.repository;

import com.project.recipebook.domain.ShoppingList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ShoppingList entity.
 */
@Repository
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    @Query(
        value = "select distinct shoppingList from ShoppingList shoppingList left join fetch shoppingList.ingredientOrders",
        countQuery = "select count(distinct shoppingList) from ShoppingList shoppingList"
    )
    Page<ShoppingList> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct shoppingList from ShoppingList shoppingList left join fetch shoppingList.ingredientOrders")
    List<ShoppingList> findAllWithEagerRelationships();

    @Query("select shoppingList from ShoppingList shoppingList left join fetch shoppingList.ingredientOrders where shoppingList.id =:id")
    Optional<ShoppingList> findOneWithEagerRelationships(@Param("id") Long id);
}
